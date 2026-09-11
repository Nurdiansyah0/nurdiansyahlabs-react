const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

async function cleanup() {
  console.log('=== Production Deployment Cleanup Tool ===');

  const rawServer = process.env.FTP_SERVER || '';
  const rawUser = process.env.FTP_USERNAME || '';
  const rawPassword = process.env.FTP_PASSWORD || '';
  const rawPort = process.env.FTP_PORT || '21';

  const server = rawServer.trim().replace(/^ftps?:\/\//i, '').replace(/\/+$/, '');
  const user = rawUser.trim();
  const password = rawPassword.trim();
  const port = parseInt(rawPort.trim(), 10) || 21;

  if (!server || !user || !password) {
    console.log('[-] FTP credentials not set in environment. Skipping remote cleanup.');
    return;
  }

  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log(`[*] Connecting to FTP server: ${server}:${port}...`);
    try {
      await client.access({
        host: server,
        user: user,
        password: password,
        port: port,
        secure: false
      });
      console.log('[+] Connected successfully via standard FTP.');
    } catch (connErr) {
      console.warn(`[!] Standard FTP connection failed (${connErr.message}), attempting explicit FTPS...`);
      await client.access({
        host: server,
        user: user,
        password: password,
        port: port,
        secure: 'explicit'
      });
      console.log('[+] Connected successfully via explicit FTPS.');
    }

    const initialDir = await client.pwd();
    console.log(`[*] Remote initial directory: ${initialDir}`);

    const list = await client.list();
    console.log(`[*] Remote directory contains ${list.length} entries:`, list.map(i => i.name));

    // 1. Remove orphaned nested public_html
    const nestedItem = list.find(item => item.name === 'public_html');
    if (nestedItem) {
      console.log(`[!] Found orphaned nested "public_html" (type: ${nestedItem.isDirectory ? 'dir' : 'file'}). Eradicating recursively...`);
      if (nestedItem.isDirectory) {
        await client.removeDir('public_html');
      } else {
        await client.remove('public_html');
      }

      // Verify removal
      const checkList = await client.list();
      const stillPresent = checkList.some(item => item.name === 'public_html');
      if (stillPresent) {
        throw new Error('Nested "public_html" still present after removal attempt!');
      }
      console.log('[+] Successfully eradicated orphaned "public_html" directory!');
    } else {
      console.log('[+] No orphaned nested "public_html" found. Remote root is clean.');
    }

    // 2. Remove stale sync state file if present to prevent 553 on uncreated directories
    const hasSyncState = list.some(item => item.name === '.ftp-deploy-sync-state.json');
    if (hasSyncState) {
      console.log('[!] Stale .ftp-deploy-sync-state.json detected. Removing to force clean synchronization...');
      try {
        await client.remove('.ftp-deploy-sync-state.json');
        console.log('[+] Removed stale .ftp-deploy-sync-state.json successfully.');
      } catch (err) {
        console.warn('[-] Warning removing .ftp-deploy-sync-state.json:', err.message);
      }
    }

    // 3. Pre-create all remote directories required by dist/
    const distPath = path.resolve(__dirname, '..', 'dist');
    if (fs.existsSync(distPath)) {
      console.log('[*] Pre-ensuring all remote directories exist for dist/...');
      const allDirs = [];
      function collectDirs(currentDir, relPath = '') {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const subRel = relPath ? `${relPath}/${entry.name}` : entry.name;
            allDirs.push(subRel);
            collectDirs(path.join(currentDir, entry.name), subRel);
          }
        }
      }
      collectDirs(distPath);

      for (const relDir of allDirs) {
        // Skip excluded cache or upload_articles or node_modules
        if (relDir.startsWith('cache') || relDir.startsWith('upload_articles') || relDir.includes('node_modules')) {
          continue;
        }
        try {
          await client.ensureDir(relDir);
          await client.cd(initialDir);
        } catch (dirErr) {
          console.warn(`[!] ensureDir warning for "${relDir}":`, dirErr.message);
          await client.cd(initialDir);
        }
      }
      console.log(`[+] Pre-ensured ${allDirs.length} remote directories exist on production server.`);
    }

    // Return to root directory before exit
    await client.cd(initialDir);
    console.log('[+] Remote environment fully prepared for FTP deployment.');
  } catch (err) {
    console.error('[-] Error during cleanup:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
  console.log('=== Cleanup Tool Finished ===');
}

cleanup();
