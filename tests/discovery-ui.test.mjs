import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { filterGames, availableCategories } from '../assets/catalogue.js';
const data=JSON.parse(await readFile(new URL('../games.json',import.meta.url)));
const source=(await readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import .*;\n/gm,'');
class Element {
  constructor(tag='div'){this.tag=tag;this.children=[];this.attributes={};this.listeners={};this.value='';this.hidden=false;}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=children;}
  setAttribute(key,value){this.attributes[key]=value;}
  addEventListener(key,fn){this.listeners[key]=fn;}
  querySelectorAll(tag){return this.children.filter(c=>c.tag===tag);}
  focus(){this.focused=true;}
  showModal(){this.open=true;}
  close(){this.open=false;}
}
function setup(response=data){
  const nodes=new Map();const get=s=>{if(!nodes.has(s))nodes.set(s,new Element());return nodes.get(s);};
  const context=vm.createContext({document:{querySelector:get,createElement:t=>new Element(t),createTextNode:t=>({textContent:t})},window:{addEventListener(){}},fetch:async()=>({ok:true,json:async()=>response}),readProgress:()=>({progress:{}}),completionCount:()=>0,filterGames,availableCategories,Date});
  vm.runInContext(source,context);
  return {get,context};
}
const count=data.games.filter(g=>g.status==='published').length;
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('UI separates real collection from unavailable ranking and supports repeated filtering/reset',async()=>{
 const {get}=setup();await flush();assert.equal(get('#game-grid').children.length,count);assert.ok(get('#top-availability').textContent.includes(`${count} juegos`));
 const buttons=get('#category-filters').children;const arcade=buttons.find(b=>b.textContent==='Arcade');arcade.onclick();assert.equal(get('#game-grid').children.length,1);assert.equal(arcade.attributes['aria-pressed'],'true');arcade.onclick();assert.equal(get('#category-filters').children,buttons);
 get('#search').listeners.input({target:{value:'jardín'}});assert.equal(get('#game-grid').children[0].className,'no-results');assert.ok(get('#catalogue-status').textContent.includes(`0 de ${count}`));
 get('#clear-filters').onclick();assert.equal(get('#game-grid').children.length,count);assert.equal(get('#search').focused,true);assert.equal(get('#clear-filters').hidden,true);
 get('#search').listeners.input({target:{value:'ORBITA'}});assert.equal(get('#game-grid').children.length,1);assert.ok(get('#catalogue-status').textContent.includes(`1 de ${count}`));
});
test('UI only includes published games and populated categories',async()=>{
 const draft={...data.games[0],id:'draft',number:99,status:'draft',category:'aventura'};
 const {get}=setup({...data,games:[...data.games,draft]});await flush();assert.equal(get('#game-grid').children.length,count);assert.equal(get('#category-filters').children.length,4);assert.equal(get('#featured-title').textContent,[...data.games].filter(g=>g.status==='published').sort((a,b)=>b.number-a.number)[0].title);
});
