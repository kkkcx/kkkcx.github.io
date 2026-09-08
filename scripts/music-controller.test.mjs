import test from 'node:test';
import assert from 'node:assert/strict';
import {createMusicController} from '../assets/music-controller.js';
class Hub{
 listeners=new Map();
 addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
 removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
 emit(type,extra={}){for(const fn of this.listeners.get(type)||[])fn({type,target:this,isTrusted:true,...extra});}
 closest(){return null;}
}
class Audio extends Hub{
 paused=true;error=null;mode='success';plays=0;loads=0;
 play(){this.plays++;if(this.mode==='blocked')return Promise.reject(new Error('NotAllowedError'));this.paused=false;this.emit('play');if(this.mode==='pending')return new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;});queueMicrotask(()=>this.emit('playing'));return Promise.resolve();}
 pause(){if(!this.paused){this.paused=true;this.emit('pause');}}
 load(){this.loads++;this.error=null;}
}
function fixture(timeoutMs=20000){
 const audio=new Audio(),events=new Hub(),button=new Hub(),messages=[];button.dataset={};button.attrs={};button.classList={toggle(){}};button.setAttribute=(k,v)=>button.attrs[k]=v;button.closest=s=>s==='#sound-toggle'?button:null;
 const controller=createMusicController({audio,events,button,timeoutMs,t:key=>key,message:value=>messages.push(value)});
 return {audio,events,button,messages,controller};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('touch followed by compatibility click starts once and shows actual playback',async()=>{
 const f=fixture();f.events.emit('touchend');assert.equal(f.button.attrs['aria-busy'],'true');assert.equal(f.button.attrs['aria-pressed'],'false');assert.equal(f.button.disabled,false);f.events.emit('click');await tick();assert.equal(f.audio.plays,1);assert.equal(f.controller.state,'playing');assert.equal(f.button.attrs['aria-pressed'],'true');f.controller.destroy();
});
test('blocked first interaction can retry on a later trusted interaction',async()=>{
 const f=fixture();f.audio.mode='blocked';f.events.emit('touchend');await tick();assert.equal(f.controller.state,'error');assert.equal(f.button.disabled,false);f.audio.mode='success';f.events.emit('click');await tick();assert.equal(f.audio.plays,2);assert.equal(f.controller.state,'playing');f.controller.destroy();
});
test('touching the music button does not start and immediately pause',async()=>{
 const f=fixture();f.events.emit('touchend',{target:f.button});f.button.emit('click');f.events.emit('click',{target:f.button});await tick();assert.equal(f.audio.plays,1);assert.equal(f.controller.state,'playing');f.controller.destroy();
});
test('manual pause persists across room interactions and allows explicit resume',async()=>{
 const f=fixture();f.events.emit('touchend');await tick();f.button.emit('click');f.events.emit('touchend');f.events.emit('click');await tick();assert.equal(f.audio.plays,1);assert(f.audio.paused);f.button.emit('click');await tick();assert.equal(f.audio.plays,2);assert.equal(f.controller.state,'playing');f.controller.destroy();
});
test('a pending play can be cancelled and its late rejection is ignored',async()=>{
 const f=fixture();f.audio.mode='pending';f.button.emit('click');assert.equal(f.button.disabled,false);f.button.emit('click');f.audio.reject(new Error('AbortError'));await tick();assert.equal(f.controller.state,'paused');assert.equal(f.messages.length,0);f.events.emit('touchend');assert.equal(f.audio.plays,1);f.controller.destroy();
});
test('a never-settling media request times out without locking the button',async()=>{
 const f=fixture(15);f.audio.mode='pending';f.events.emit('touchend');await new Promise(r=>setTimeout(r,35));assert.equal(f.controller.state,'error');assert(f.audio.paused);assert.equal(f.button.disabled,false);f.audio.mode='success';f.button.emit('click');await tick();assert.equal(f.controller.state,'playing');f.controller.destroy();
});
test('buffering is distinct from playback and remains cancellable',async()=>{
 const f=fixture();f.button.emit('click');await tick();f.audio.emit('waiting');assert.equal(f.controller.state,'loading');assert.equal(f.button.attrs['aria-pressed'],'false');assert.equal(f.button.attrs['aria-busy'],'true');f.button.emit('click');assert(f.audio.paused);assert.equal(f.controller.state,'paused');f.controller.destroy();
});
test('a failed media source reloads on explicit retry',async()=>{
 const f=fixture();f.button.emit('click');await tick();f.audio.error={code:2};f.audio.emit('error');assert.equal(f.controller.state,'error');f.button.emit('click');await tick();assert.equal(f.audio.loads,1);assert.equal(f.controller.state,'playing');f.controller.destroy();
});
test('untrusted events cannot auto-start; keyboard activation can',async()=>{
 const f=fixture();f.events.emit('click',{isTrusted:false});f.events.emit('keydown',{key:'Tab'});assert.equal(f.audio.plays,0);f.events.emit('keydown',{key:'Enter'});await tick();assert.equal(f.controller.state,'playing');f.controller.destroy();
});
test('a delayed playing event after cancellation cannot restart sound',()=>{
 const f=fixture();f.audio.mode='pending';f.button.emit('click');f.button.emit('click');f.audio.paused=false;f.audio.emit('playing');assert(f.audio.paused);assert.equal(f.controller.state,'paused');f.controller.destroy();
});
