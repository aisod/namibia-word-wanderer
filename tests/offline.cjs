const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'namqula-offline-'));
  try {
    for (const folder of ['assets', 'data']) await fs.mkdir(path.join(directory, folder));
    for (const name of ['index.html','manifest.webmanifest','app-icon.png','app-icon-512.png','logo.webp','heroimage.webp','assets/quiz.js','assets/main.css','data/rukwangali.json','data/chokwe.json']) await fs.writeFile(path.join(directory,name), name);
    const { buildOffline } = await import(pathToFileURL(path.resolve('scripts/build-offline.mjs')).href);
    await buildOffline(directory);
    const source = await fs.readFile(path.join(directory,'sw.js'),'utf8');
    assert(source.includes('/assets/quiz.js')); assert(source.includes('/data/rukwangali.json')); assert(source.includes('/data/chokwe.json'));
    const handlers = {}; const stores = new Map(); let fail = false;
    const caches = {
      async open(key) { if (!stores.has(key)) stores.set(key,new Map()); const data=stores.get(key); return {async addAll(requests) { if(fail) throw Error('network'); for(const r of requests) data.set(new URL(r.url,'https://play.aisod.tech').pathname,r.url); }, async match(key) { return data.get(key); }}; },
      async keys() { return [...stores.keys()]; }, async delete(key) { return stores.delete(key); }
    };
    let claimed=false; let skipped=false;
    vm.runInNewContext(source,{caches,Request:class {constructor(url){this.url=url;}},URL,fetch:async()=>{throw Error('offline');},self:{async skipWaiting(){skipped=true;},location:{origin:'https://play.aisod.tech'},clients:{async claim(){claimed=true;}},addEventListener(name,handler){handlers[name]=handler;}}});
    let pending; handlers.install({waitUntil(promise){pending=promise;}}); await pending;
    stores.set('unrelated-cache',new Map()); stores.set('namqula-offline-old',new Map());
    handlers.activate({waitUntil(promise){pending=promise;}}); await pending; assert(claimed); assert(stores.has('unrelated-cache')); assert(!stores.has('namqula-offline-old'));
    async function request(url,mode='cors',method='GET') { let answer; handlers.fetch({request:{url,mode,method},respondWith(promise){answer=promise;}}); return answer; }
    assert.equal(await request('https://play.aisod.tech/games/chokwe','navigate'),'/index.html');
    assert.equal(await request('https://play.aisod.tech/data/rukwangali.json'),'/data/rukwangali.json');
    assert.equal(await request('https://play.aisod.tech/assets/quiz.js'),'/assets/quiz.js');
    assert.equal(await request('https://play.aisod.tech/admin','navigate'),undefined);
    assert.equal(await request('https://play.aisod.tech/community','navigate'),undefined);
    assert.equal(await request('https://database.example/rest/v1/words'),undefined);
    assert.equal(await request('https://play.aisod.tech/api','cors','POST'),undefined);
    let ready; handlers.message({data:'OFFLINE_STATUS',ports:[{postMessage(value){ready=value.ready;}}]}); assert(ready);
    handlers.message({data:'ACTIVATE_UPDATE',waitUntil(promise){pending=promise;}}); await pending; assert(skipped);
    await fs.writeFile(path.join(directory,'data/chokwe.json'),'updated'); await buildOffline(directory);
    assert.notEqual(source,await fs.readFile(path.join(directory,'sw.js'),'utf8'));
    fail=true; stores.set('namqula-offline-previous',new Map()); handlers.install({waitUntil(promise){pending=promise;}}); await assert.rejects(pending); assert(stores.has('namqula-offline-previous'));
    for(const name of ['oshikwanyama','oshindonga','otjiherero','khoekhoegowab','chokwe','rukwangali']) for(const row of JSON.parse(await fs.readFile(`public/data/${name}.json`,'utf8'))) { assert.equal(row.corpusUrl,'https://corpus.aisod.tech'); assert(row.corpusAttribution.includes('all its contributors')); assert(row.sourceUrl); assert(row.license); }
    console.log('Offline caching, deep links, update isolation, failure recovery and all 311 corpus credits passed');
  } finally { await fs.rm(directory,{recursive:true,force:true}); }
})().catch(error=>{console.error(error);process.exitCode=1;});
