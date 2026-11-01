const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const ts=require('typescript');
const React=require('react');
const {act,create}=require('react-test-renderer');
const jsx=require('react/jsx-runtime');
let currentData, toastCount=0;const cache={};
function load(file){
 file=path.resolve('src',file);
 if(cache[file])return cache[file].exports;
 const module={exports:{}};cache[file]=module;
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const mockedRequire=id=>{
  if(id==='react')return React;
  if(id==='react/jsx-runtime')return jsx;
  if(id==='@/hooks/useLanguageData')return {useLanguageData:()=>currentData};
  if(id==='@/hooks/use-toast')return {toast:()=>toastCount++};
  if(id==='@/lib/utils')return {cn:(...args)=>args.filter(Boolean).join(' ')};
  if(id==='lucide-react')return new Proxy({},{get:(_,name)=>props=>React.createElement('i',{'data-icon':String(name)})});
  if(id.includes('/ui/')){
   return new Proxy({},{get:(_,name)=>props=>React.createElement(name==='Button'?'button':'div',props,props.children)});
  }
  const target=id.startsWith('@/')?path.join(process.cwd(),'src',id.slice(2)):path.resolve(path.dirname(file),id);
  const resolved=fs.existsSync(target+'.tsx')?target+'.tsx':target+'.ts';
  return load(path.relative(path.resolve('src'),resolved));
 };
 new Function('require','module','exports',code)(mockedRequire,module,module.exports);return module.exports;
}
const util=load('lib/vocabularyUtils.ts');
const text=node=>typeof node==='string'?node:node==null?'':Array.isArray(node)?node.map(text).join(''):text(node.children);
const snapshot=renderer=>text(renderer.toJSON());
let checks=0;
async function main(){
 for(const slug of ['oshikwanyama','oshindonga','otjiherero','khoekhoegowab','chokwe','rukwangali']){
  const words=JSON.parse(fs.readFileSync(`public/data/${slug}.json`,'utf8'));
  currentData={isLoading:false,error:null,retry:()=>{},languageInfo:{name:slug},allVocabulary:words,categories:[{id:'all',name:'All',icon:'',count:words.length}],getRandomVocabulary:(count,cat)=>util.shuffle(words.filter(w=>!cat||w.category===cat)).slice(0,count)};
  for(const name of ['QuizGame','WordMatchGame','WordSearchGame','FlashcardGame']){
   const Component=load(`components/${name}.tsx`)[name];let renderer;
   act(()=>{renderer=create(React.createElement(Component,{languageId:slug,onBack:()=>{}}));});
   assert.ok(snapshot(renderer).length>20,slug+' '+name+' blank screen');checks++;
   if(name==='QuizGame'){
    const answers=renderer.root.findAllByType('button').filter(b=>b.props['aria-label']?.startsWith('Answer: '));
    assert.equal(answers.length,4);checks++;
    act(()=>answers[0].props.onClick());assert.ok(snapshot(renderer).includes('Next')||snapshot(renderer).includes('Continue'));checks++;
   }
   if(name==='WordMatchGame'){
    const choices=()=>renderer.root.findAll(n=>n.type==='button'&&n.props['data-match-side']);
    const englishChoices=choices().filter(n=>n.props['data-match-side']==='english');
    const english=englishChoices[0].props['data-word'];const translation=words.find(w=>w.english===english).oshikwanyama;
    act(()=>englishChoices[0].props.onClick());
    act(()=>choices().find(n=>n.props['data-match-side']==='native'&&n.props['data-word']===translation).props.onClick());
    assert.equal(toastCount,0);assert.ok(snapshot(renderer).includes("Total: 10"));checks+=2;
    assert.equal(choices().filter(n=>n.props.disabled).length,2,'Matched tiles must be disabled on both sides');checks++;
    assert.ok(snapshot(renderer).includes('Matched:'),'Matching needs readable feedback');checks++;
    assert.ok(choices().length<=12,'A round must not exceed six pairs');checks++;
    await act(async()=>{await new Promise(resolve=>setTimeout(resolve,550));});
    assert.equal(toastCount,0);assert.ok(snapshot(renderer).includes("Total: 10"));checks+=2;toastCount=0;
   }
   if(name==='WordSearchGame'){
    const buttons=renderer.root.findAllByType('button').filter(b=>b.props['aria-label']?.startsWith('Row '));
    assert.equal(buttons.length,64);checks++;
    assert.ok(buttons.every(b=>!b.props.disabled));checks++;
    const grid=Array.from({length:8},(_,row)=>buttons.slice(row*8,row*8+8).map(b=>b.children.join('')));
    const labels=snapshot(renderer);const targets=words.filter(w=>renderer.root.findAll(n=>n.type==='span'&&n.children.length===1&&n.children[0]===w.oshikwanyama).length&&util.gridLetters(w.oshikwanyama).length>=3).sort((a,b)=>util.gridLetters(a.oshikwanyama).length-util.gridLetters(b.oshikwanyama).length);
    let positions;
    outer:for(const word of targets){const letters=util.gridLetters(word.oshikwanyama);for(let row=0;row<8;row++)for(let col=0;col<8;col++)for(const [dr,dc] of [[0,1],[1,0]]){
     const cells=letters.map((_,i)=>[row+dr*i,col+dc*i]);if(cells.every(([rr,cc],i)=>grid[rr]?.[cc]===letters[i])){positions=cells;break outer;}
    }}
    assert.ok(positions,'No complete target in grid');checks++;
    for(const [row,col] of positions)act(()=>renderer.root.findAllByType('button').filter(b=>b.props['aria-label']?.startsWith('Row '))[row*8+col].props.onClick());
    assert.equal(toastCount,1);checks++;
    assert.ok(renderer.root.findAllByType('button').filter(b=>b.props['aria-label']?.startsWith('Row ')).every(b=>!b.props.disabled),'Crossings became disabled');checks++;toastCount=0;
   }
   if(name==='FlashcardGame'){
    const category=renderer.root.findAll(n=>n.type==='div'&&n.props.onClick).find(n=>n.children.some(c=>typeof c==='object'&&text(c.props?.children).includes('All')));
    // Category cards remain rendered as UI stubs, choose the first category.
    const clickable=renderer.root.findAll(n=>n.type==='div'&&n.props.onClick);
    act(()=>clickable[0].props.onClick());
    const flip=renderer.root.findByProps({'aria-label':'Flip vocabulary card'});
    act(()=>flip.props.onClick());assert.ok(snapshot(renderer).includes('Powered by AISOD Corpus and its contributors'));checks++;
   }
   act(()=>renderer.unmount());
  }
 }
 // The same game must expose recovery, rather than blank content, after a data failure.
 currentData={isLoading:false,error:new Error('offline'),retry:()=>{},languageInfo:null,allVocabulary:[],categories:[],getRandomVocabulary:()=>[]};
 for(const name of ['QuizGame','WordMatchGame','WordSearchGame','FlashcardGame']){let r;act(()=>r=create(React.createElement(load(`components/${name}.tsx`)[name],{languageId:'missing',onBack:()=>{}})));assert.ok(snapshot(r).includes('Try again'));checks++;act(()=>r.unmount());}
 console.log(`${checks} React game behavior checks passed`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
