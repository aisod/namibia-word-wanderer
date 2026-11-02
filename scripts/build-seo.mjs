import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const cache = new Map();
function load(file) {
  file = path.resolve(file); if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require', 'module', 'exports', code)(id => {
    if (!id.startsWith('.')) return require(id);
    const base = path.resolve(path.dirname(file), id); return load(existsSync(base + '.ts') ? base + '.ts' : base);
  }, module, module.exports);
  return module.exports;
}
const { pageMetadata, PUBLIC_PATHS, SEO_IMAGE, SITE_URL } = load('src/lib/seo.ts');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function buildSEO(directory = 'dist') {
  const template = await readFile(path.join(directory, 'index.html'), 'utf8');
  for (const route of PUBLIC_PATHS) {
    const p = pageMetadata(route), l = p.language;
    let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(p.title)}</title>`)
      .replace(/\s*<meta (?:name="(?:description|robots|twitter:[^"]*)"|property="og:[^"]*")[^>]*>/g, '')
      .replace(/\s*<link rel="canonical"[^>]*>/g, '');
    const head = `<meta name="description" content="${escape(p.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${p.url}"><meta property="og:type" content="website"><meta property="og:site_name" content="NAMQULA"><meta property="og:url" content="${p.url}"><meta property="og:title" content="${escape(p.title)}"><meta property="og:description" content="${escape(p.description)}"><meta property="og:image" content="${SEO_IMAGE}"><meta property="og:image:alt" content="NAMQULA — learn languages through play"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(p.title)}"><meta name="twitter:description" content="${escape(p.description)}"><meta name="twitter:image" content="${SEO_IMAGE}"><script id="namqula-schema" type="application/ld+json">${JSON.stringify(p.data).replace(/</g,'\\u003c')}</script>`;
    let content = `<h1>${escape(l ? p.title.split(' | ')[0] : 'NAMQULA — learn African languages through play')}</h1><p>${escape(p.description)}</p>`;
    if (l) {
      content += `<p>${escape(l.description)}</p>`;
      if (p.section === 'language') content += `<h2>History & culture</h2><p>${escape(l.history)}</p><h2>Where it is spoken</h2><p>${escape(l.geography)}</p>`;
      if (p.section === 'words') {
        const pack = JSON.parse(await readFile(`public/data/${l.slug}.json`, 'utf8'));
        content += '<h2>Explore vocabulary</h2><dl>' + pack.map(w => `<dt>${escape(w.oshikwanyama)}</dt><dd>${escape(w.english)}</dd>`).join('') + '</dl>';
      }
      content += `<nav aria-label="${escape(l.name)} learning"><a href="/language/${l.slug}">History & culture</a> · <a href="/words/${l.slug}">Words & phrases</a> · <a href="/games/${l.slug}">Play games</a></nav>`;
    } else content += '<h2>Choose your language</h2><ul>' + PUBLIC_PATHS.filter(p => p.startsWith('/language/')).map(route => `<li><a href="${route}">${escape(pageMetadata(route).language.name)}</a></li>`).join('') + '</ul><h2>Four ways to practise</h2><p>Flashcards, Word Match, Quiz and Word Search. Install NAMQULA for offline play after saving the language packs online. Practice progress stays on your device.</p>';
    content += '<p>Powered by <a href="https://corpus.aisod.tech">AISOD Corpus of Language Data and all its contributors</a>.</p><p>Open NAMQULA with JavaScript enabled to play the interactive games.</p>';
    html = html.replace('</head>', head + '</head>').replace('<div id="root"></div>', `<div id="root"><main style="max-width:72ch;margin:3rem auto;padding:1rem;font:1.1rem/1.7 system-ui">${content}</main></div>`);
    const destination = route === '/' ? directory : path.join(directory, route.slice(1));
    await mkdir(destination, { recursive: true }); await writeFile(path.join(destination, 'index.html'), html);
  }
  await writeFile(path.join(directory, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + PUBLIC_PATHS.map(p => `<url><loc>${SITE_URL}${p}</loc></url>`).join('') + '</urlset>');
  await writeFile(path.join(directory, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /community\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  console.log(`SEO: ${PUBLIC_PATHS.length} readable pages and sitemap generated`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildSEO();
