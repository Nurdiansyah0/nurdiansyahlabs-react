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

    const currentDir = await client.pwd();
    console.log(`[*] Current remote directory: ${currentDir}`);

    const list = await client.list();
    console.log(`[*] Remote directory contains ${list.length} entries:`, list.map(i => i.name));

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
  } catch (err) {
    console.error('[-] Error during cleanup:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
  console.log('=== Cleanup Tool Finished ===');
}

cleanup();
