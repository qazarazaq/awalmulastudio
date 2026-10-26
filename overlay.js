/* Figma-inspired full-page panels; deliberate isolation from existing SPA routes. */
(() => {
  'use strict';
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const panel=document.createElement('section');
  panel.className='lab-overlay';
  panel.id='lab-overlay';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-modal','true');
  panel.setAttribute('aria-label','8bit lab');
  panel.setAttribute('aria-hidden','true');
  panel.innerHTML='<div class="lab-overlay__top"><span class="lab-overlay__brand"><img src="/imgWorkshopSpark.svg" alt="">8bit lab®</span><button type="button" class="lab-overlay__close" aria-label="Close overlay">Close <span aria-hidden="true">×</span></button></div><div class="lab-overlay__content"></div>';
  document.body.appendChild(panel);
  const body=panel.querySelector('.lab-overlay__content');
  const closeButton=panel.querySelector('.lab-overlay__close');
  let opened='',previousFocus=null,closeTimer=null,originalOverflow='';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=s=>{try {const u=new URL(s);return u.protocol==='https:'?u.href:'';}catch{return '';}};
  const humanPage=async()=>{
    let people=[];
    try {const r=await fetch('/studio.json');if(!r.ok)throw Error('network');people=(await r.json()).creators.filter(c=>c.visible!==false).slice(0,4);}catch{people=[];}
    const defaults=[['Ekky F','Senior Designers','10+ Experiences'],['Maulana C','Senior Designers','8+ Experiences'],['Primus W','Senior Designers','5+ Experiences'],['Wildan R','Senior Design + Developers','7+ Experiences']];
    return '<div class="lab-overlay__inner lab-overlay__humans"><h1 class="lab-overlay__heading">The brains behind the <em>pixels.</em></h1><p class="lab-overlay__lede">Four curious minds, one creative mission. We turn bold ideas into digital experiences that make people go “aha!”</p><div class="lab-overlay__people">'+defaults.map((d,i)=>{const p=people[i]||{};const link=safeUrl(p.url);return '<article class="lab-overlay__person"><div class="lab-overlay__portrait"><img src="/creator-'+(i+1)+'.webp" alt="'+esc(p.name||d[0])+'" loading="lazy"><div class="lab-overlay__person-info"><strong>'+esc(p.name||d[0])+'</strong><p>'+esc(p.role||d[1])+'</p><p>'+esc(p.experience||d[2])+'</p></div></div>'+(link?'<a class="lab-overlay__person-link" href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">Know '+esc((p.name||d[0]).split(' ')[0])+' More <span aria-hidden="true">↗</span></a>':'<span class="lab-overlay__person-link" aria-label="Profile coming soon">Know '+esc(d[0].split(' ')[0])+' More <span aria-hidden="true">↗</span></span>')+'</article>';}).join('')+'</div></div>';
  };
  const sparkle=()=>{const pixels=[3,4,10,11,15,16,17,18,19,22,23,24,25,26,27,29,30,31,32,33,36,37,38,39,45,46];return '<div class="lab-overlay__spark-art" aria-hidden="true">'+Array.from({length:49},(_,i)=>pixels.includes(i)?'<i style="grid-column:'+(i%7+1)+';grid-row:'+(Math.floor(i/7)+1)+'"></i>':'').join('')+'</div>';};
  const contactPage=()=>'<div class="lab-overlay__inner lab-overlay__contact"><div><div class="lab-overlay__eyebrow">CONTACT / LET’S MAKE SOMETHING</div><h1 class="lab-overlay__heading">Big ideas.<br>Good energy.<br><em>Let’s talk.</em></h1><p class="lab-overlay__lede">Have a spark of an idea? We’ll bring the curious minds, bold thinking, and a little pixel magic.</p><div class="lab-overlay__spark">'+sparkle()+'<div><strong>SMALL SPARK. BIG POSSIBILITIES.</strong><p>A rough idea or a ready-to-go brief. We’re curious either way.</p></div></div></div><form class="lab-overlay__form"><h2>What do you need?</h2><p class="lab-overlay__form-intro">Pick a little of this, a little of that. Select all that fit.</p><div class="lab-overlay__choices">'+['UI/UX','Branding & Visual Identity','Social Media & Digital Design','Marketing Collateral'].map((s,i)=>'<label class="lab-overlay__choice"><input type="checkbox" name="service" value="'+esc(s)+'" '+(i<2?'checked':'')+'><span>'+esc(s)+'</span></label>').join('')+'</div><hr class="lab-overlay__divider"><div class="lab-overlay__step">02 / YOU & YOUR IDEA</div><div class="lab-overlay__fields"><label class="lab-overlay__field">Your name *<input name="name" placeholder="What should we call you?" required autocomplete="name"></label><label class="lab-overlay__field">Email address *<input name="email" type="email" placeholder="you@company.com" required autocomplete="email"></label></div><label class="lab-overlay__field lab-overlay__field--wide">Tell us about your project *<textarea name="message" required placeholder="The idea, the challenge, the dream. Share your goals, timeline, or anything else we should know."></textarea></label><div class="lab-overlay__submit"><small>* REQUIRED FIELDS<br>No perfect brief needed. Just say hello.</small><button type="submit">Send your idea ↗</button></div></form></div>';
  const open=async kind=>{
    clearTimeout(closeTimer);
    if(!opened){previousFocus=document.activeElement;originalOverflow=document.documentElement.style.overflow;}
    opened=kind;panel.classList.remove('is-open','is-closing');panel.setAttribute('aria-hidden','false');
    body.innerHTML=kind==='humans'?await humanPage():contactPage();
    panel.setAttribute('aria-label',kind==='humans'?'The Humans':'Contact Us');
    panel.scrollTop=0;document.documentElement.style.overflow='hidden';
    requestAnimationFrame(()=>{panel.classList.add('is-open');closeButton.focus({preventScroll:true});});
    document.querySelector('#navigation')?.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded','false');
  };
  const close=()=>{
    if(!opened)return;opened='';panel.classList.remove('is-open');panel.classList.add('is-closing');
    document.documentElement.style.overflow=originalOverflow;
    previousFocus?.focus?.({preventScroll:true});
    closeTimer=setTimeout(()=>{panel.classList.remove('is-closing');panel.setAttribute('aria-hidden','true');body.innerHTML='';},reduce.matches?0:760);
  };
  closeButton.addEventListener('click',close);
  document.addEventListener('keydown',e=>{
    if(!opened)return;
    if(e.key==='Escape'){e.preventDefault();close();}
    if(e.key==='Tab'){const focusable=[...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  },true);
  document.addEventListener('click',e=>{
    const anchor=e.target.closest('a[href]');if(!anchor||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const url=new URL(anchor.href,location.href);
    if(url.origin!==location.origin)return;
    const href=anchor.getAttribute('href')||'';
    const kind=(url.pathname==='/'&&url.hash==='#about')||href==='/humans'?'humans':(url.pathname==='/'&&url.hash==='#contact')?'contact':null;
    if(!kind)return;
    e.preventDefault();e.stopImmediatePropagation();open(kind);
  },true);
  panel.addEventListener('submit',e=>{
    if(!e.target.matches('.lab-overlay__form'))return;e.preventDefault();
    const data=new FormData(e.target);
    const services=data.getAll('service').join(', ')||'To discuss';
    const message='Hello 8bit lab,\n\n'+data.get('message')+'\n\nName: '+data.get('name')+'\nEmail: '+data.get('email')+'\nInterested in: '+services;
    location.href='mailto:cesam19@gmail.com?subject='+encodeURIComponent('New project inquiry — 8bit lab')+'&body='+encodeURIComponent(message);
  });
})();
