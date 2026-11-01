const fs = require('fs'), path = require('path');
const ts = require('typescript');
function walk(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]); }
let errors=[];
for (const file of walk('src').filter(f=>/\.tsx?$/.test(f)&&!f.endsWith('.d.ts'))) {
 const result=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
 for (const d of result.diagnostics||[]) if(d.category===ts.DiagnosticCategory.Error)errors.push(file+': '+ts.flattenDiagnosticMessageText(d.messageText,' '));
}
console.log(JSON.stringify({syntaxErrors:errors},null,2));if(errors.length)process.exitCode=1;
const util=ts.transpileModule(fs.readFileSync('src/lib/vocabularyUtils.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const m={exports:{}}; new Function('exports','require',util)(m.exports,require);
const {gridLetters,makeOptions,uniqueVocabulary,shuffle}=m.exports;
const assert=require('node:assert/strict');let count=0;
for(const slug of ['oshikwanyama','oshindonga','otjiherero','khoekhoegowab','chokwe','rukwangali']) {
 const raw=JSON.parse(fs.readFileSync(`public/data/${slug}.json`,'utf8')); const words=uniqueVocabulary(raw);
 assert.equal(words.length,raw.length,'Ambiguous active words: '+slug);count++;
 assert.ok(words.every(w=>w.sourceUrl&&w.license));count++;
 for(let round=0;round<50;round++)for(const word of words)for(const direction of [true,false]){
  const options=makeOptions(word,words,direction);assert.equal(options.length,4);assert.equal(new Set(options).size,4);assert.ok(options.includes(direction?word.oshikwanyama:word.english));count+=3;
 }
 const short=words.filter(w=>gridLetters(w.oshikwanyama).length>=3&&gridLetters(w.oshikwanyama).length<=8);assert.ok(short.length>=5);count++;
}
assert.deepEqual(gridLetters('ǁnâu'),['ǁ','N','Â','U']);count++;
assert.deepEqual(gridLetters('ǂû'),['ǂ','Û']);count++;
assert.deepEqual(gridLetters('n\u0061\u0302u'),['N','Â','U']);count++;
const original=[1,2,3,4];for(let i=0;i<100;i++)assert.deepEqual(shuffle(original).sort(),original);count+=100;
console.log(`${count} vocabulary and Unicode assertions passed`);

const catalogModule = ts.transpileModule(fs.readFileSync('src/data/languageCatalog.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const profiles = {exports:{}}; new Function('exports',ts.transpileModule(fs.readFileSync('src/data/languageProfiles.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(profiles.exports);
const catalog = {exports:{}}; new Function('exports','require',catalogModule)(catalog.exports,id=>id==='./languageProfiles'?profiles.exports:require(id));
assert.equal(catalog.exports.getLocalLanguage('oshikwanyama').slug,'oshikwanyama');
assert.equal(catalog.exports.getLocalLanguage('oshindonga').slug,'oshindonga');
assert.equal(catalog.exports.getLocalLanguage('kwangari').slug,'rukwangali');
assert.equal(catalog.exports.LOCAL_LANGUAGES.length,6);
assert.ok(catalog.exports.LOCAL_LANGUAGES.every(l=>l.isAvailable&&l.wordCount>=4));
assert.deepEqual(catalog.exports.LOCAL_LANGUAGES.filter(l=>!l.isAvailable).map(l=>l.slug),[]);
console.log('Separate Oshiwambo routes and six-language catalog checks passed');

for(const language of catalog.exports.LOCAL_LANGUAGES){
 assert.ok(language.description.length>200,language.slug+' lacks an introduction');
 assert.ok(language.history.length>450,language.slug+' lacks history and culture');
 assert.ok(language.geography.length>150,language.slug+' lacks geographic detail');
 assert.ok(language.regions.includes('Namibia'),language.slug+' omits Namibia');
 assert.ok(language.funFacts.length>=3);
 assert.ok(!/Wiktionary|Hai ti|starter pack|source-backed|translated by/i.test(language.description+' '+language.history));
}
console.log('All six researched language profiles have substantive cultural and geographic content');
