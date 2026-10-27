(() => {
'use strict';
const BASE='https://amcxpqhldtvpezslblnh.supabase.co';
const KEY='sb_publishable_eA0RJuFYO0RtnLvglo4_3w_UvXj11Kz';
const $=s=>document.querySelector(s);
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9 -]/g,'').trim().replace(/\s+/g,'-').slice(0,100);
const collections=['projects','team','services','pages','faqs'];
const names={overview:'Studio overview.',projects:'The work.',team:'The humans.',services:'Our things.',pages:'Pages & sections.',faqs:'Frequently asked.',settings:'Studio settings.'};
const descriptions={overview:'Everything that makes 8bit lab, 8bit lab.',projects:'The ideas, experiments and work that make us proud.',team:'The people behind the pixels.',services:'What the studio brings to the table.',pages:'Editable page copy and content sections.',faqs:'Answers to good questions.',settings:'Contact details and studio information.'};
const fields={
projects:[['title','Project title'],['slug','URL slug'],['subtitle','Subtitle'],['category','Category'],['summary','Overview','long'],['challenge','The challenge','long'],['approach','The approach','long'],['deliverables','Deliverables (one per line)','long'],['image','Image URL or existing asset'],['concept','Studio concept','boolean']],
team:[['title','Name'],['slug','Profile ID'],['role','Role'],['experience','Experience'],['url','Profile URL'],['image','Photo URL or existing asset'],['visible','Visible on website','boolean']],
services:[['title','Service name'],['slug','Service ID'],['symbol','Symbol'],['description','Description','long'],['deliverables','Deliverables (one per line)','long']],
pages:[['title','Section title'],['slug','Section ID'],['description','Description','long'],['image','Image URL']],
faqs:[['title','Question'],['slug','Question ID'],['answer','Answer','long']]
};
let session=null,section='overview',entries=[],settings=[],editing=null,checked=false;
const notice=msg=>{const x=$('#notice');x.textContent=msg;x.classList.add('show');clearTimeout(window.noticeTimeout);window.noticeTimeout=setTimeout(()=>x.classList.remove('show'),5000);};
async function api(path,{method='GET',body,auth=true,headers={}}={}){
const h={apikey:KEY,...headers};
if(auth&&session?.access_token)h.Authorization='Bearer '+session.access_token;
if(body&&!(body instanceof Blob)&&!(body instanceof File)){h['Content-Type']='application/json';body=JSON.stringify(body);}
const r=await fetch(BASE+path,{method,headers:h,body,cache:'no-store'});
if(!r.ok){let detail;try{detail=await r.json();}catch{}throw Error(detail?.message||detail?.error_description||detail?.msg||('Request failed: '+r.status));}
if(r.status===204)return null;
const text=await r.text();if(!text)return null;try{return JSON.parse(text);}catch{return text;}
}
function store(){if(session)localStorage.setItem('cms_session',JSON.stringify(session));else localStorage.removeItem('cms_session');}
async function refresh(){if(!session?.refresh_token)return false;try{const s=await api('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token},auth:false});session=s;store();return true;}catch{session=null;store();return false;}}
async function ensureSession(){if(!session)return false;if(Date.now()>=(session.expires_at||0)*1000-30000)return refresh();return true;}
async function authorize(){await ensureSession();if(!session)return false;const admin=await api('/rest/v1/cms_admins?select=user_id&user_id=eq.'+encodeURIComponent(session.user.id));return Array.isArray(admin)&&admin.length===1;}
async function start(){session=JSON.parse(localStorage.getItem('cms_session')||'null');try{if(session&&await authorize()){await showApp();return;}}catch(e){notice(e.message);}session=null;store();$('#app').hidden=true;$('#login').hidden=false;}
async function showApp(){$('#login').hidden=true;$('#app').hidden=false;$('#account').textContent=session?.user?.email||'';await reload();render();}
async function reload(){if(!await ensureSession())throw Error('Session expired. Please sign in again.');const [e,s]=await Promise.all([api('/rest/v1/cms_entries?select=*&order=sort_order.asc'),api('/rest/v1/cms_settings?select=*&order=key.asc')]);entries=e||[];settings=s||[];}
$('#login-form').onsubmit=async e=>{e.preventDefault();const btn=e.target.querySelector('button');btn.disabled=true;try{session=await api('/auth/v1/token?grant_type=password',{method:'POST',auth:false,body:{email:$('#email').value.trim(),password:$('#password').value}});session.expires_at=Math.floor(Date.now()/1000)+(session.expires_in||3600);store();if(!await authorize())throw Error('This account has not been approved as a CMS admin.');$('#password').value='';await showApp();}catch(err){session=null;store();notice(err.message);}finally{btn.disabled=false;}};
$('#logout').onclick=async()=>{try{await api('/auth/v1/logout',{method:'POST'});}catch{}session=null;store();$('#app').hidden=true;$('#login').hidden=false;};
$('#nav').addEventListener('click',e=>{const b=e.target.closest('[data-section]');if(!b)return;section=b.dataset.section;render();});
function render(){
document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('current',b.dataset.section===section));
$('#location').textContent='Dashboard / '+(section==='overview'?'Overview':names[section]);
$('#heading').textContent=names[section];$('#subheading').textContent=descriptions[section];
$('#kicker').textContent=section==='overview'?'THE BIG PICTURE':'MANAGE CONTENT';
$('#add').hidden=!collections.includes(section);$('#add').textContent='Add new +';
if(section==='overview'){const count=c=>entries.filter(x=>x.collection===c).length;const published=entries.filter(x=>x.status==='published').length;
$('#main-content').innerHTML='<div class="stats">'+[['Total projects',count('projects')],['Team members',count('team')],['Services',count('services')],['Published items',published]].map(([n,v])=>'<div class="stat"><b>'+v+'</b><span>'+n+'</span></div>').join('')+'</div><div class="panel"><h3>Quick start ↗</h3><p class="muted">Choose a section on the left. Edit content, upload media, or toggle Draft / Published. Save to update Supabase. The public website will read published content after its integration branch is deployed.</p><p class="muted">Current admin: '+escapeHtml(session.user.email)+'</p></div>';return;}
if(section==='settings'){const keySet=['name','email','availability','instagram','linkedin'];$('#main-content').innerHTML='<form id="settings-form" class="panel settings-grid">'+keySet.map(k=>'<label class="field">'+escapeHtml(k.replace(/^./,c=>c.toUpperCase()))+'<input name="'+k+'" value="'+escapeHtml(settings.find(x=>x.key===k)?.value||'')+'"></label>').join('')+'<button class="primary">Save settings ↗</button></form>';$('#settings-form').onsubmit=saveSettings;return;}
const items=entries.filter(x=>x.collection===section);
if(!items.length){$('#main-content').innerHTML='<div class="empty">Nothing here yet. Add the first item to get started.</div>';return;}
$('#main-content').innerHTML='<table class="table"><thead><tr><th>Content</th><th>Status</th><th>Order</th><th>Manage</th></tr></thead><tbody>'+items.map((x,i)=>'<tr><td><div class="row-title">'+escapeHtml(x.title)+'</div><span class="muted">'+escapeHtml(x.slug)+'</span></td><td><span class="tag '+(x.status==='draft'?'draft':'')+'">'+escapeHtml(x.status)+'</span></td><td>'+x.sort_order+'</td><td class="row-actions"><button data-move="-1" data-id="'+x.id+'" '+(i===0?'disabled':'')+'>↑</button> <button data-move="1" data-id="'+x.id+'" '+(i===items.length-1?'disabled':'')+'>↓</button> <button data-edit="'+x.id+'">Edit ↗</button></td></tr>').join('')+'</tbody></table>';
}
$('#main-content').onclick=async e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.edit){openEditor(entries.find(x=>x.id===b.dataset.edit));}else if(b.dataset.move){try{await move(b.dataset.id,Number(b.dataset.move));await reload();render();}catch(err){notice(err.message);}}};
async function move(id,delta){const list=entries.filter(x=>x.collection===section);const index=list.findIndex(x=>x.id===id),other=list[index+delta];if(!other)return;const a=list[index];await api('/rest/v1/cms_entries?id=eq.'+a.id,{method:'PATCH',body:{sort_order:other.sort_order===a.sort_order?index+delta:other.sort_order}});await api('/rest/v1/cms_entries?id=eq.'+other.id,{method:'PATCH',body:{sort_order:a.sort_order===other.sort_order?index: a.sort_order}});}
$('#add').onclick=()=>openEditor(null);
function openEditor(item){editing=item||null;const type=section;const data=item?.data||{};$('#editor-title').textContent=item?'Edit '+item.title:'Add '+type.slice(0,-1);$('#editor-kicker').textContent=type.toUpperCase();$('#delete').hidden=!item;
const specs=fields[type];$('#editor-fields').innerHTML='<div class="form-grid">'+specs.map(([key,label,kind])=>{let v=key==='title'?item?.title:key==='slug'?item?.slug:data[key];if(key==='deliverables')v=Array.isArray(v)?v.join('\n'):v||'';if(kind==='boolean')return '<label class="field wide"><input type="checkbox" name="'+key+'" '+(v?'checked':'')+' style="width:auto"> '+escapeHtml(label)+'</label>';if(kind==='long')return '<label class="field wide">'+escapeHtml(label)+'<textarea name="'+key+'">'+escapeHtml(v||'')+'</textarea></label>';return '<label class="field '+(key==='image'?'wide':'')+'">'+escapeHtml(label)+'<input name="'+key+'" value="'+escapeHtml(v||'')+'">'+(key==='image'?'<img class="image-preview" id="img-preview" src="'+escapeHtml(imageURL(v||''))+'" alt=""><input id="upload" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif"><span class="muted">Optional: upload image (max 8 MB)</span>':'')+'</label>';}).join('')+'<label class="field wide">Publishing status<select name="status"><option value="draft" '+(item?.status==='draft'?'selected':'')+'>Draft</option><option value="published" '+(item?.status==='published'?'selected':'')+'>Published</option></select></label></div>';
$('#upload')?.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const url=await uploadImage(file);$('#editor-fields input[name=image]').value=url;$('#img-preview').src=url;notice('Image uploaded. Save the item to use it.');}catch(err){notice(err.message);}});
$('#editor').showModal();}
function imageURL(s){if(!s)return'';if(/^https:\/\//.test(s))return s;if(/^\/(?!\/)/.test(s))return 'https://8bitlabbycetz.vercel.app'+s;if(/^[\w.-]+\.(webp|png|jpg|jpeg|svg)$/.test(s))return 'https://8bitlabbycetz.vercel.app/'+s;return '';}
async function uploadImage(file){if(file.size>8*1024*1024)throw Error('Image must be below 8 MB.');if(!['image/jpeg','image/png','image/webp','image/avif','image/gif'].includes(file.type))throw Error('Unsupported image type.');const ext={ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif','image/gif':'gif'}[file.type];const name=crypto.randomUUID()+'.'+ext;const r=await fetch(BASE+'/storage/v1/object/cms-media/'+name,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+session.access_token,'Content-Type':file.type,'x-upsert':'false'},body:file});if(!r.ok){const o=await r.json().catch(()=>({}));throw Error(o.message||'Upload failed');}return BASE+'/storage/v1/object/public/cms-media/'+name;}
$('#close').onclick=$('#cancel').onclick=()=>$('#editor').close();
$('#editor-form').onsubmit=async e=>{e.preventDefault();const btn=e.target.querySelector('[type=submit]');btn.disabled=true;try{
const form=new FormData(e.target);const title=String(form.get('title')||'').trim();if(!title)throw Error('Title is required.');
const id=editing?.id;const itemSlug=slug(form.get('slug')||title);if(!itemSlug)throw Error('Enter a valid URL slug.');
const data={...(editing?.data||{})};for(const [key,label,kind] of fields[section]){if(key==='title'||key==='slug')continue;let v=form.get(key);if(kind==='boolean')v=!!v;else if(key==='deliverables')v=String(v||'').split('\n').map(s=>s.trim()).filter(Boolean);else v=String(v||'').trim();data[key]=v;}
if(section==='team'){data.name=title;data.id=itemSlug;}if(section==='projects'||section==='services')data.id=itemSlug;
const status=form.get('status')==='published'?'published':'draft';const payload={collection:section,title,slug:itemSlug,status,data,sort_order:editing?.sort_order??entries.filter(x=>x.collection===section).length};
if(id)await api('/rest/v1/cms_entries?id=eq.'+id,{method:'PATCH',body:payload,headers:{Prefer:'return=minimal'}});else await api('/rest/v1/cms_entries',{method:'POST',body:payload,headers:{Prefer:'return=minimal'}});
await reload();render();$('#editor').close();notice('Saved successfully.');
}catch(err){notice(err.message);}finally{btn.disabled=false;}};
$('#delete').onclick=async()=>{if(!editing||!confirm('Permanently delete this content?'))return;try{await api('/rest/v1/cms_entries?id=eq.'+editing.id,{method:'DELETE'});await reload();render();$('#editor').close();notice('Content deleted.');}catch(err){notice(err.message);}};
async function saveSettings(e){e.preventDefault();const btn=e.target.querySelector('button');btn.disabled=true;try{const pairs=[...new FormData(e.target).entries()].map(([key,value])=>({key,value:String(value).trim()}));await api('/rest/v1/cms_settings?on_conflict=key',{method:'POST',body:pairs,headers:{Prefer:'resolution=merge-duplicates,return=minimal'}});await reload();notice('Studio settings saved.');}catch(err){notice(err.message);}finally{btn.disabled=false;}}
start();
})();
