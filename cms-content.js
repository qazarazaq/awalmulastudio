/* Supabase-backed published content. Read-only client key; RLS protects drafts. */
(function(root){
const base='https://amcxpqhldtvpezslblnh.supabase.co/rest/v1/';
const headers={apikey:'sb_publishable_eA0RJuFYO0RtnLvglo4_3w_UvXj11Kz'};
async function get(path){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),6500);try{const r=await fetch(base+path,{headers,signal:controller.signal,cache:'no-store'});if(!r.ok)throw Error('CMS '+r.status);return await r.json();}finally{clearTimeout(timer)}}
async function load(){
 const [entries,settings]=await Promise.all([
  get('cms_entries?select=collection,title,slug,sort_order,data&status=eq.published&order=sort_order.asc'),
  get('cms_settings?select=key,value')
 ]);
 if(!entries.length)throw Error('No published CMS content');
 const site=Object.fromEntries(settings.map(s=>[s.key,s.value]));
 const map=collection=>entries.filter(e=>e.collection===collection).map(e=>({ ...e.data, id:e.data.id||e.slug, title:e.title, image:e.data.image||((e.data.image_url||'').startsWith('/')?e.data.image_url.slice(1):e.data.image_url||'')}));
 const content={version:2,site,creators:map('team').map(p=>({...p,name:p.name||p.title})),projects:map('projects'),services:map('services')};
 if(!root.StudioModel||root.StudioModel.validate(content).length)throw Error('CMS content does not match site model');
 return content;
}
root.CMSContent={load};
})(window);
