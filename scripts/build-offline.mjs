import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Include every emitted chunk: games must also open for the first time offline.
export async function buildOffline(directory = 'dist') {
  const urls = ['/index.html', '/manifest.webmanifest', '/app-icon.png', '/app-icon-512.png', '/logo.webp', '/heroimage.webp'];
  async function walk(folder) {
    for (const entry of await readdir(path.join(directory, folder), { withFileTypes: true })) {
      const name = `${folder}/${entry.name}`;
      if (entry.isDirectory()) await walk(name);
      else urls.push(`/${name}`);
    }
  }
  await walk('assets'); await walk('data');
  const template = await readFile(new URL('./offline-worker.js', import.meta.url), 'utf8');
  const hash = createHash('sha256');
  hash.update(template);
  for (const url of urls.sort()) { hash.update(url); hash.update(await readFile(path.join(directory, url.slice(1)))); }
  const version = hash.digest('hex').slice(0, 16);
  await writeFile(path.join(directory, 'sw.js'), template.replace('__VERSION__', version).replace('__FILES__', JSON.stringify(urls)));
  console.log(`Offline release ${version}: ${urls.length} files`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildOffline();
