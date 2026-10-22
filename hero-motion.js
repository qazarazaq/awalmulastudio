import {setup,render} from './hero-shader.js';
// Native WebGPU host for the unchanged shader exported by Figma.
const host=document.querySelector('.pixel-hero'),canvas=host?.querySelector('canvas');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let device,context,frame,raf=0,visible=true,start=performance.now(),last=0;
async function init(){
  if(!canvas||!navigator.gpu)return;
  try{
    const adapter=await navigator.gpu.requestAdapter({powerPreference:'low-power'});if(!adapter)return;
    device=await adapter.requestDevice();context=canvas.getContext('webgpu');if(!context)return;
    const format=navigator.gpu.getPreferredCanvasFormat();context.configure({device,format,alphaMode:'opaque'});
    frame={state:{},params:{pixelSize:4,characterSize:120,morphDuration:.4399999976158142,loopDuration:14},time:0,renderScale:1};
    setup(device,frame);
    device.lost.then(()=>{cancelAnimationFrame(raf);host.dataset.gpu='unavailable';});
    new ResizeObserver(resize).observe(host);resize();
    new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();},{threshold:0}).observe(host);
    document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);resume();
  }catch(error){host.dataset.gpu='unavailable';console.warn('Pixel shader unavailable in this browser',error.message);}
}
function resize(){if(!frame)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(host.clientWidth*dpr));canvas.height=Math.max(1,Math.round(host.clientHeight*dpr));frame.renderScale=dpr;draw(performance.now());}
function draw(now){try{frame.time=reduced.matches?0:now-start;const texture=context.getCurrentTexture();frame.output={format:navigator.gpu.getPreferredCanvasFormat(),width:canvas.width,height:canvas.height,physicalWidth:canvas.width,physicalHeight:canvas.height,createView:()=>texture.createView()};render(device,frame);host.dataset.gpu='ready';}catch(error){cancelAnimationFrame(raf);host.dataset.gpu='unavailable';}}
function tick(now){raf=0;if(!visible||document.hidden||reduced.matches)return;if(now-last>1000/30){draw(now);last=now;}raf=requestAnimationFrame(tick);}
function resume(){cancelAnimationFrame(raf);raf=0;if(reduced.matches){draw(0);return;}if(visible&&!document.hidden)raf=requestAnimationFrame(tick);}
init();
