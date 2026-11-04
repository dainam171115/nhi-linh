const V='banhang-v59',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-512-maskable.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Ưu tiên mạng (tối đa 4 giây) để luôn nhận bản mới; mất mạng thì dùng bản đã lưu trong máy */
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith((async()=>{
  const c=await caches.open(V);
  try{
   const n=await Promise.race([fetch(e.request,{cache:'no-cache'}),new Promise((_,r)=>setTimeout(r,4000))]);
   if(n&&n.ok)c.put(e.request,n.clone());
   return n;
  }catch(x){
   return (await c.match(e.request,{ignoreSearch:true}))||(e.request.mode==='navigate'?await c.match('index.html'):Response.error());
  }
 })());
});
