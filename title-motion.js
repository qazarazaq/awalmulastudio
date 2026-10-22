(() => {
  const slot=document.querySelector('.rotating-word');if(!slot)return;
  const words=[...slot.children];words.forEach(w=>w.className='title-word');
  const reel=document.createElement('span');reel.className='word-reel';words.forEach(w=>reel.append(w));reel.append(words[0].cloneNode(true));slot.append(reel);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,timer,visible=true;
  function place(animate){reel.style.transition=animate?'transform 300ms ease-in-out':'none';reel.style.transform=`translateY(-${index*(words[0].getBoundingClientRect().height+parseFloat(getComputedStyle(reel).rowGap))}px)`;}
  function advance(){if(document.hidden||!visible||reduced.matches)return;index++;place(true);timer=setTimeout(()=>{if(index===words.length){timer=setTimeout(()=>{index=0;place(false);timer=setTimeout(advance,1000);},1000);}else timer=setTimeout(advance,1000);},300);}
  function reset(){clearTimeout(timer);index=0;place(false);if(!reduced.matches&&!document.hidden&&visible)timer=setTimeout(advance,1000);}
  new IntersectionObserver(([e])=>{visible=e.isIntersecting;reset();}).observe(slot);
  reduced.addEventListener('change',reset);document.addEventListener('visibilitychange',reset);window.addEventListener('resize',()=>place(false));document.fonts.ready.then(reset);
})();
