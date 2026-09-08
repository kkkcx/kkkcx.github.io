// Keep play() in the user gesture; report actual playback, not a pending request.
export function createMusicController({audio,button,message,t,events=document,notify=()=>{},timeoutMs=20000}){
 let state='idle',wantsPlay=false,autoStart=true,attempt=0,timer;
 const listeners=[];
 const listen=(target,type,fn,options)=>{target.addEventListener(type,fn,options);listeners.push(()=>target.removeEventListener(type,fn,options));};
 const clearTimer=()=>{clearTimeout(timer);timer=undefined;};
 function sync(){
  const playing=state==='playing'&&!audio.paused;
  button.disabled=false;
  button.dataset.state=state;
  button.setAttribute('aria-pressed',String(playing));
  button.setAttribute('aria-busy',String(state==='loading'));
  button.setAttribute('aria-label',t(wantsPlay?'sound.pause':'sound.play'));
  button.title=t(wantsPlay?'sound.pause':'sound.play');
  button.classList.toggle('playing',playing);
  notify(playing);
 }
 function stop(){
  autoStart=false;wantsPlay=false;attempt++;clearTimer();audio.pause();state='paused';sync();
 }
 function fail(id,key='sound.startError'){
  if(id!==attempt)return;
  wantsPlay=false;attempt++;clearTimer();audio.pause();state='error';sync();message(t(key));
 }
 function watch(id){clearTimer();timer=setTimeout(()=>fail(id),timeoutMs);}
 function start(){
  if(wantsPlay)return;
  wantsPlay=true;state='loading';const id=++attempt;sync();watch(id);
  try{
   // A failed media resource needs a fresh load before another explicit attempt.
   if(audio.error)audio.load();
   const result=audio.play();
   Promise.resolve(result).catch(()=>fail(id));
  }catch{fail(id);}
 }
 function toggle(){if(wantsPlay||!audio.paused)stop();else start();}
 function onGesture(event){
  if(!event.isTrusted||!autoStart||event.target?.closest?.('#sound-toggle'))return;
  if(event.type==='keydown'&&(event.repeat||!['Enter',' '].includes(event.key)))return;
  start();
 }
 // touchend is a direct iOS gesture; click also covers mouse and keyboard activation.
 // Failed first attempts stay armed. A successful start or explicit pause stops this behavior.
 listen(events,'touchend',onGesture,{passive:true});
 listen(events,'click',onGesture);
 listen(events,'keydown',onGesture);
 listen(button,'click',toggle);
 listen(audio,'playing',()=>{
  if(!wantsPlay){audio.pause();return;}
  autoStart=false;clearTimer();state='playing';sync();message(t('sound.nowPlaying'));
 });
 listen(audio,'waiting',()=>{if(wantsPlay){state='loading';sync();watch(attempt);}});
 listen(audio,'pause',()=>{
  if(!audio.paused)return;
  wantsPlay=false;attempt++;clearTimer();if(state!=='error')state='paused';sync();
 });
 listen(audio,'error',()=>fail(attempt,'sound.unavailable'));
 sync();
 return {toggle,sync,get state(){return state;},destroy(){stop();listeners.forEach(remove=>remove());}};
}
