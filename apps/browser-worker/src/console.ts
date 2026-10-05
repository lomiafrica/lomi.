/** Screenshot console. Page script never runs here; the merchant clicks the image. */
export function browserConsole(sessionId: string, token: string): string {
  const screenshot = JSON.stringify(
    `/sessions/${sessionId}/screenshot?token=${encodeURIComponent(token)}`,
  );
  const input = JSON.stringify(
    `/sessions/${sessionId}/input?token=${encodeURIComponent(token)}`,
  );
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>lomi. browser</title><style>
*{box-sizing:border-box}body{margin:0;background:#fcfcfc;color:#172125;font:14px -apple-system,BlinkMacSystemFont,system-ui,sans-serif}
header{padding:12px;display:flex;align-items:center;justify-content:space-between;gap:12px}#status{color:#697176;font-size:12px}#status.live{color:#248258}
button,input{font:inherit;border:1px solid #e9edef;border-radius:24px;padding:10px 14px;background:white;color:inherit;min-height:42px}
button{cursor:pointer}button:disabled{opacity:.45}form{padding:0 12px 10px;display:flex;gap:8px}input{flex:1;min-width:0}
nav{display:flex;gap:6px;padding:0 12px 12px;flex-wrap:wrap}
#stage{overflow:hidden;background:#eef1f3;border-radius:18px;min-height:160px;margin:0 8px}img{display:block;width:100%;height:auto;cursor:crosshair}
img.stale{opacity:.45;pointer-events:none}#error{margin:0 12px 12px;color:#984a41}#error:empty{display:none}
footer{padding:12px;color:#697176;font-size:12px}
</style><header><strong>lomi. browser</strong><span id="status">Connecting…</span><button id="refresh" type="button">Refresh</button></header>
<form><input id="text" aria-label="Text to type" autocomplete="off" placeholder="Type into the field you tapped"><button id="type" type="submit">Send text</button></form>
<nav><button type="button" data-key="Enter">Enter</button><button type="button" data-key="Tab">Tab</button><button type="button" data-key="Backspace">Delete</button><button type="button" id="up">Scroll up</button><button type="button" id="down">Scroll down</button></nav>
<div id="error" role="alert"></div><div id="stage"><img id="screen" class="stale" alt="Browser session" draggable="false"></div>
<footer>Tap the page, then send text. This is the assistant’s browser. Passwords stay in this view.</footer><script>
const image=document.querySelector('#screen'),error=document.querySelector('#error'),status=document.querySelector('#status'),field=document.querySelector('#text');
const screenshot=${screenshot},inputUrl=${input};
let refreshing=false,sending=false,imageUrl,live=false;
function controls(){document.querySelectorAll('nav button,#type').forEach(button=>button.disabled=sending||!live);image.classList.toggle('stale',!live||sending);}
async function refresh(){if(refreshing||sending||document.hidden)return;refreshing=true;try{
const r=await fetch(screenshot,{cache:'no-store'});
if(!r.ok)throw new Error(r.status===401?'This view expired. Ask the assistant for a new link.':'The browser is closed.');
const blob=await r.blob();const next=URL.createObjectURL(blob);
if(imageUrl)URL.revokeObjectURL(imageUrl);imageUrl=next;image.src=next;live=true;status.textContent='Live';status.className='live';error.textContent='';
}catch(e){live=false;status.textContent='Disconnected';error.textContent=e.message;}finally{refreshing=false;controls();}}
async function send(body){if(sending||!live)return false;sending=true;controls();try{
const r=await fetch(inputUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
if(!r.ok)throw new Error('That action failed.');
return true;
}catch(e){error.textContent=e.message;return false;}finally{sending=false;controls();await refresh();}}
image.onclick=e=>{const r=image.getBoundingClientRect();send({type:'click',x:Math.min(1279,Math.max(0,Math.floor((e.clientX-r.left)*1280/r.width))),y:Math.min(799,Math.max(0,Math.floor((e.clientY-r.top)*800/r.height)))});};
document.querySelector('form').onsubmit=async e=>{e.preventDefault();const text=field.value;if(text&&await send({type:'text',text}))field.value='';};
document.querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>send({type:'key',key:b.dataset.key}));
document.querySelector('#up').onclick=()=>send({type:'scroll',deltaY:-600});
document.querySelector('#down').onclick=()=>send({type:'scroll',deltaY:600});
document.querySelector('#refresh').onclick=()=>refresh();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
controls();refresh();setInterval(refresh,2000);
</script></html>`;
}
