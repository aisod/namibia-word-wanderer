const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
(async () => {
 const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'namqula-seo-'));
 try {
  await fs.writeFile(path.join(directory,'index.html'),await fs.readFile('index.html'));
  const {buildSEO} = await import(pathToFileURL(path.resolve('scripts/build-seo.mjs')).href);
  await buildSEO(directory);
  const sitemap=await fs.readFile(path.join(directory,'sitemap.xml'),'utf8');
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.equal(urls.length,19); assert.equal(new Set(urls).size,19);
  const titles=new Set();
  for(const url of urls){
   const route=new URL(url).pathname;
   const html=await fs.readFile(path.join(directory,route.slice(1),'index.html'),'utf8');
   assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
   assert(html.includes(`rel="canonical" href="${url}"`));
   assert(html.includes('name="robots" content="index, follow'));
   assert(html.includes('property="og:url" content="'+url+'"'));
   assert(html.includes('https://play.aisod.tech/app-icon-512.png'));
   assert.equal((html.match(/name="description"/g)||[]).length,1);
   const title=html.match(/<title>(.*?)<\/title>/)[1]; assert(!titles.has(title)); titles.add(title);
   const schema=JSON.parse(html.match(/id="namqula-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
   assert.equal(schema['@graph'].find(x=>x['@type']==='WebPage').url,url);
   assert(html.includes('<h1>')); assert(html.includes('AISOD Corpus of Language Data and all its contributors'));
   if(route.startsWith('/words/')){
    const pack=JSON.parse(await fs.readFile('public/data/'+route.split('/')[2]+'.json','utf8'));
    assert.equal((html.match(/<dt>/g)||[]).length,pack.length);
   }
  }
  const robots=await fs.readFile(path.join(directory,'robots.txt'),'utf8');
  assert(robots.includes('Sitemap: https://play.aisod.tech/sitemap.xml')); assert(robots.includes('Disallow: /admin'));
  console.log('SEO: 19 unique titles, canonicals, social tags, structured data, readable vocabulary and sitemap passed');
 } finally {await fs.rm(directory,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
