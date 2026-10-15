/* Caché versionada para la interfaz del portal. No cachea peticiones externas,
   datos personales ni la carpeta de reconocimiento facial. */
const VERSION="portal-ia-cbtis-v1";
const CORE_CACHE=`${VERSION}-core`;
const RUNTIME_CACHE=`${VERSION}-runtime`;
const CORE=["./","./index.html","./estilos.css","./app.js","./manifest.json","./icon.svg","./offline.html","./imagenesia/imagenlogo.jpg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CORE_CACHE).then(cache=>cache.addAll(CORE.filter(x=>x!=="./imagenesia/imagenlogo.jpg").concat([])).then(()=>cache.add("./imagenesia/imagenlogo.jpg").catch(()=>{}))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("portal-ia-cbtis-")&&![CORE_CACHE,RUNTIME_CACHE].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",event=>{
 const req=event.request;const url=new URL(req.url);
 if(req.method!=="GET"||url.origin!==self.location.origin)return;
 // No interceptar el clasificador integrado: conserva su service worker y recursos propios.
 if(url.pathname.includes("/reconocimiento_facial/"))return;
 if(req.mode==="navigate"){event.respondWith(fetch(req).then(resp=>{if(resp.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,resp.clone()));return resp;}).catch(async()=>await caches.match(req)||await caches.match("./index.html")||await caches.match("./offline.html")));return;}
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(resp=>{if(resp.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,resp.clone()));return resp;}).catch(()=>new Response("Recurso no disponible sin conexión",{status:503,statusText:"Offline"}))));
});