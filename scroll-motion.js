(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  function render(){
    frame=0;
    if(reduced.matches){document.documentElement.style.setProperty('--hero-drift','0px');document.documentElement.style.setProperty('--copy-drift','0px');document.querySelectorAll('[data-parallax]').forEach(e=>e.style.removeProperty('--scroll-drift'));return;}
    const hero=document.querySelector('.hero');
    if(hero&&!document.querySelector('#home').hidden){
      const rect=hero.getBoundingClientRect(),progress=clamp(-rect.top,0,rect.height);
      const mobile=innerWidth<768;
      document.documentElement.style.setProperty('--hero-drift',`${progress*(mobile?.08:.18)}px`);
      document.documentElement.style.setProperty('--copy-drift',`${progress*.045}px`);
    }
    document.querySelectorAll('[data-parallax]').forEach(e=>{
      const rect=e.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;
      const distance=innerHeight/2-(rect.top+rect.height/2);
      e.style.setProperty('--scroll-drift',`${clamp(distance*Number(e.dataset.parallax),e.classList.contains("project-visual")?-8:-24,e.classList.contains("project-visual")?8:24).toFixed(2)}px`);
    });
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render);}
  document.querySelector('.studio-copy>.spark')?.setAttribute('data-parallax','.09');
  function artwork(){document.querySelectorAll('#project-track .project-visual').forEach(e=>e.setAttribute('data-parallax','.045'));schedule();}
  new MutationObserver(artwork).observe(document.querySelector('#project-track'),{childList:true});
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('popstate',schedule);reduced.addEventListener('change',schedule);artwork();
})();
