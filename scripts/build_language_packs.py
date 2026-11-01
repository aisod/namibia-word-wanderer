import json, pathlib, hashlib, shutil, sys
root=pathlib.Path(__file__).resolve().parents[1]; corpus=pathlib.Path(sys.argv[1]) if len(sys.argv)>1 else root.parent/'Oshindonga_Corpus_Organized'; out=root/'public/data'; out.mkdir(parents=True,exist_ok=True)
records=[json.loads(l) for l in (corpus/'dictionary_records.jsonl').read_text(encoding='utf-8').splitlines()]
# Explicit source record choices retain sense distinctions; no automatic first-match translation.
selected={
'animals':'699 999 1766 1927 2222 2490 2823 3308 4142 5045 5240',
'body':'738 760 2077 2295 2621 2693 3124 3645 3802 5157 5962 5967',
'family':'538 1083 2122 2527 3630 6401',
'nature':'1165 1883 2211 2271 2535 3204 3619 3638 4497 4721 4938 5441 5493 5626 6046 6294 6413',
'food':'572 803 1908 2289 2377 3543 3585 3901 4839 5605',
'numbers':'1911 2232 2343 2847 3773 5010 5153 5790 5896 6112',
'verbs':'1458 1826 1893 2691 3178 3217 4522 4966 5136 5150 5187 5354 5434 6256 6493',
'everyday':'1034 1530 1776 2006 2833 3624 3717 3771 3776 4902 5705 5951 6501 6505 6506'
}
byid={x['id']:x for x in records}; vocab=[]
for category,ids in selected.items():
 for num in ids.split():
  x=byid[f'dictionary-{int(num):06d}']; assert x['source_var']!='__builtins__' and x['license']=='MIT'
  vocab.append(dict(id='ndo-'+x['id'],english=x['en'],oshikwanyama=x['ndo'],category=category,difficulty='easy',sourceRecordId=x['id'],sourceUrl='https://github.com/abiatarfestus/oshinglish',license='MIT',reviewStatus='source-backed'))
(out/'oshindonga.json').write_text(json.dumps(vocab,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
shutil.copyfile(corpus/'licenses/LICENSE_oshinglish_MIT.txt',out/'LICENSE-oshinglish.txt')
# Individual Wiktionary Herero sections checked 2026-11-01.
herero=[('eye','eho','body',None),('finger','omunwe','body',73065704),('face','omurungu','body',73065760),('heart','omutima','body',83886303),('tail','omutjira','body',73065749),('cow','ongombe','animals',85373605),('snake','onyoka','animals',85552275),('dog','ombwa','animals',87270566),('water','omeva','nature',85618428),('tree','omuti','nature',90186275),('father','tate','family',92126484),('person','omundu','family',None)]
rows=[]
for i,(en,native,cat,rev) in enumerate(herero):
 url=f'https://en.wiktionary.org/w/index.php?title={native}&oldid={rev}' if rev else f'https://en.wiktionary.org/wiki/{native}#Herero'
 rows.append(dict(id=f'her-{i+1:03}',english=en,oshikwanyama=native,category=cat,difficulty='easy',sourceUrl=url,license='CC-BY-SA-4.0',reviewStatus='source-backed'))
(out/'otjiherero.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Only unambiguous whole forms from the Khoekhoe Swadesh list. Preserve clicks and tone marks.
khoe={'numbers':[('one','ǀgui'),('two','ǀgam'),('three','ǃnona'),('four','haka'),('five','koro')], 'verbs':[('drink','ā'),('eat','ǂû'),('spit','ǁnaru'),('breathe','ǀom'),('laugh','âi'),('see','mû'),('hear','ǁnâu'),('know','ǂan'),('think','ǂâi'),('sleep','ǁom'),('live','ûi'),('die','ǁō'),('swim','tsâ'),('walk','ǃgû'),('sit','ǂnôa'),('stand','mâ'),('pull','ǂgae'),('sew','ǂom'),('sing','ǁnae'),('play','ǀhuru')], 'qualities':[('big','kai'),('small','ǂkhari'),('short','ǃnubu'),('narrow','ǂō'),('red','ǀapa'),('green','ǃam'),('yellow','ǃhuni'),('white','ǃuri'),('black','ǂnū'),('cold','ǃkhai'),('good','ǃgâi'),('old','kaira'),('wet','ǀâ'),('dry','ǂnâsa')], 'everyday':[('here','nepa'),('where','mapa'),('not','tama'),('few','ǀoro'),('in','ǃnâ')]}
rows=[]
for cat,pairs in khoe.items():
 for en,native in pairs:
  rows.append(dict(id=f'naq-{len(rows)+1:03}',english=en,oshikwanyama=native,category=cat,difficulty='easy',sourceUrl='https://en.wiktionary.org/wiki/Appendix:Khoekhoe_Swadesh_list',license='CC-BY-SA-4.0',reviewStatus='source-backed'))
(out/'khoekhoegowab.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Separate Oshikwanyama course, never relabelled Oshindonga.
kua_groups=json.loads((root/'scripts/oshikwanyama-curation.json').read_text(encoding='utf-8'))
kua=[]
for category,page,pairs in kua_groups:
 for en,native in pairs:
  kua.append(dict(id=f'kua-{len(kua)+1:03d}',english=en,oshikwanyama=native,category=category,difficulty='easy',sourceUrl=f'https://wingolog.org/pub/hai-ti/hai-ti.pdf#page={page}',sourceTitle='Hai ti! — A Beginner’s Guide to Oshikwanyama (2004)',sourcePage=page,license='CC-BY-SA-2.0',reviewStatus='source-backed'))
(out/'oshikwanyama.json').write_text(json.dumps(kua,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for slug,words in json.loads((root/'scripts/additional-language-curation.json').read_text(encoding='utf-8')).items():
 (out/f'{slug}.json').write_text(json.dumps(words,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# AISOD corpus stewardship credit supplements, rather than replaces, original rights.
for pack in out.glob('*.json'):
 if pack.name == 'manifest.json': continue
 rows=json.loads(pack.read_text(encoding='utf-8'))
 for row in rows:
  row['corpusAttribution']='AISOD Corpus of Language Data and all its contributors'
  row['corpusUrl']='https://corpus.aisod.tech'
 pack.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
stats={'localSourceSha256':hashlib.sha256((corpus/'dictionary_records.jsonl').read_bytes()).hexdigest(),'rawRecords':len(records),'excludedPythonInternals':sum(x['source_var']=='__builtins__' for x in records),'packs':{p.stem:len(json.loads(p.read_text(encoding='utf-8'))) for p in out.glob('*.json') if p.name != 'manifest.json'}}
(out/'manifest.json').write_text(json.dumps(stats,indent=2)+'\n',encoding='utf-8');print(json.dumps(stats))
