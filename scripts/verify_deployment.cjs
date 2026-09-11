const ftp = require('basic-ftp');
const http = require('http');
const https = require('https');
const { Writable } = require('stream');

function fetchUrl(targetUrl, maxRedirects = 3, timeoutMs = 15000) {
  return new Promise((resolve) => {
    function get(currentUrl, redirectsLeft) {
      try {
        const parsed = new URL(currentUrl);
        const client = parsed.protocol === 'https:' ? https : http;
        const req = client.get(currentUrl, {
          headers: {
            'User-Agent': 'DeploymentVerification/1.0 (GitHubActions-Verifier)',
            'Accept': '*/*'
          },
          timeout: timeoutMs
        }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
            const nextUrl = new URL(res.headers.location, currentUrl).toString();
            console.log(`[*] Redirect ${res.statusCode} -> ${nextUrl}`);
            return get(nextUrl, redirectsLeft - 1);
          }
          let data = '';
          res.setEncoding('utf8');
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
        });
        req.on('error', err => resolve({ status: null, error: err.message, data: '' }));
        req.on('timeout', () => {
          req.destroy();
          resolve({ status: null, error: 'timeout', data: '' });
        });
      } catch (err) {
        resolve({ status: null, error: err.message, data: '' });
      }
    }
    get(targetUrl, maxRedirects);
  });
}

async function verify() {
  console.log('====================================================');
  console.log('=== Production Deployment Verification Suite     ===');
  console.log('====================================================');

  const rawServer = process.env.FTP_SERVER || '';
  const rawUser = process.env.FTP_USERNAME || '';
  const rawPassword = process.env.FTP_PASSWORD || '';
  const rawPort = process.env.FTP_PORT || '21';

  const server = rawServer.trim().replace(/^ftps?:\/\//i, '').replace(/\/+$/, '');
  const user = rawUser.trim();
  const password = rawPassword.trim();
  const port = parseInt(rawPort.trim(), 10) || 21;

  let ftpVerified = true;

  if (server && user && password) {
    console.log('\n--- 1. Direct FTP Filesystem Topology Audit ---');
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      try {
        await client.access({ host: server, user, password, port, secure: false });
      } catch (connErr) {
        console.warn(`[!] Plain FTP access failed (${connErr.message}), falling back to explicit FTPS...`);
        await client.access({ host: server, user, password, port, secure: 'explicit' });
      }

      const list = await client.list();
      const names = list.map(item => item.name);
      console.log(`[*] Remote root directory contains ${names.length} entries.`);

      // 1. Check nested public_html is ABSENT
      const hasNested = names.includes('public_html');
      if (hasNested) {
        console.error('[FAIL] Orphaned nested directory "public_html" is STILL PRESENT in root!');
        ftpVerified = false;
      } else {
        console.log('[PASS] Orphaned nested directory "public_html" is ABSENT.');
      }

      // 2. Check root index.html is PRESENT
      const hasIndexHtml = names.includes('index.html');
      if (!hasIndexHtml) {
        console.error('[FAIL] Root index.html is MISSING!');
        ftpVerified = false;
      } else {
        console.log('[PASS] Root index.html is PRESENT.');
      }

      // 3. Check deploy_manifest.txt in root and download its content
      const hasManifest = names.includes('deploy_manifest.txt');
      if (hasManifest) {
        console.log('[PASS] deploy_manifest.txt is PRESENT in remote root.');
        const chunks = [];
        const memStream = new Writable({
          write(chunk, encoding, callback) {
            chunks.push(chunk);
            callback();
          }
        });
        await client.downloadTo(memStream, 'deploy_manifest.txt');
        const manifestContent = Buffer.concat(chunks).toString('utf-8');
        console.log('[*] Manifest content from remote server:\n' + manifestContent.trim());
      } else {
        console.warn('[WARN] deploy_manifest.txt was not found in remote root.');
      }

      // 4. Check assets directory
      if (names.includes('assets')) {
        const assets = await client.list('assets');
        const assetNames = assets.map(a => a.name);
        const mainJs = assetNames.filter(n => n.startsWith('index-') && n.endsWith('.js'));
        const mainCss = assetNames.filter(n => n.startsWith('index-') && n.endsWith('.css'));
        console.log(`[PASS] Remote assets directory contains ${assetNames.length} items.`);
        console.log(`[*] Main JS bundle(s) in root assets/:`, mainJs);
        console.log(`[*] Main CSS bundle(s) in root assets/:`, mainCss);
        if (mainJs.length === 0) {
          console.error('[FAIL] No index-*.js bundle found in remote assets/!');
          ftpVerified = false;
        }
      } else {
        console.error('[FAIL] "assets/" directory is MISSING in remote root!');
        ftpVerified = false;
      }
    } catch (e) {
      console.error('[-] FTP verification error:', e.message);
      ftpVerified = false;
    } finally {
      client.close();
    }
  } else {
    console.log('[-] FTP credentials not available. Skipping FTP filesystem audit.');
  }

  console.log('\n--- 2. Live HTTP Endpoint Verification ---');
  const rootRes = await fetchUrl('https://nurdiansyahlabs.com/');
  console.log(`[*] Root URL (https://nurdiansyahlabs.com/) status: ${rootRes.status || rootRes.error}`);
  let liveJsBundle = null;
  if (rootRes.data) {
    const jsMatches = rootRes.data.match(/\/assets\/index-[a-zA-Z0-9_-]+\.js/g);
    const cssMatches = rootRes.data.match(/\/assets\/index-[a-zA-Z0-9_-]+\.css/g);
    console.log(`[*] Live JS bundle(s) found in HTML:`, jsMatches);
    console.log(`[*] Live CSS bundle(s) found in HTML:`, cssMatches);
    if (jsMatches && jsMatches.length > 0) {
      liveJsBundle = jsMatches[0];
      if (rootRes.data.includes('index-DYPwEsWH.js')) {
        console.log('[PASS] Live HTML serves the expected latest Vite bundle: index-DYPwEsWH.js');
      }
    }
  }

  // Check asset directly
  if (liveJsBundle) {
    const assetUrl = `https://nurdiansyahlabs.com${liveJsBundle}`;
    const assetRes = await fetchUrl(assetUrl);
    console.log(`[*] Live JS bundle direct request (${assetUrl}) status: ${assetRes.status || assetRes.error}`);
  }

  // Check manifest
  const manifestRes = await fetchUrl('https://nurdiansyahlabs.com/deploy_manifest.txt');
  console.log(`[*] Manifest URL (https://nurdiansyahlabs.com/deploy_manifest.txt) status: ${manifestRes.status || manifestRes.error}`);
  if (manifestRes.data) {
    console.log(`[*] Live Manifest Content:\n${manifestRes.data.trim()}`);
  }

  // Check nested public_html/
  const nestedRes = await fetchUrl('https://nurdiansyahlabs.com/public_html/');
  console.log(`[*] Nested URL (https://nurdiansyahlabs.com/public_html/) status: ${nestedRes.status || nestedRes.error}`);
  if (nestedRes.status === 404 || nestedRes.status === 403) {
    console.log(`[PASS] Nested URL correctly returned ${nestedRes.status} (cleanly inactive).`);
  } else if (nestedRes.data && !nestedRes.data.includes('August 24')) {
    console.log(`[*] Nested URL did not serve stale August 24 release.`);
  }

  console.log('\n====================================================');
  console.log(`=== Verification Finished: FTP Status = ${ftpVerified ? 'OK' : 'FAILED'} ===`);
  console.log('====================================================');

  if (!ftpVerified) {
    process.exit(1);
  }
}

verify();
