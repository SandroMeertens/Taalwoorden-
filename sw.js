/* Taalwoorden werkt ook zonder internet.
   De pagina: eerst online kijken (voor updates), maar nooit langer dan 3 seconden wachten; dan de bewaarde versie.
   Lettertypes en plaatjes: uit de bewaarde versie. Het grote Firebase-bestand wordt niet vooraf bewaard
   (alleen de leerkracht heeft het nodig), zodat een update op de iPads weinig downloadt. */
var CACHE="taalwoorden-v19";
var VOORAF=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./favicon.svg",
  "./fonts/bricolage-grotesque-latin-opsz-normal.woff2","./fonts/atkinson-hyperlegible-latin-400-normal.woff2","./fonts/atkinson-hyperlegible-latin-700-normal.woff2"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(VOORAF.map(function(u){return /fonts\//.test(u)?u:new Request(u,{cache:"reload"});}));}));self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;var u=new URL(r.url);
  /* Database en inloggen gaan altijd rechtstreeks naar internet. */
  if(u.origin!==self.location.origin)return;
  if(r.mode==="navigate"){
    var net=fetch(r.url,{cache:"no-cache",credentials:"same-origin"}).then(function(res){if(res.ok){var k=res.clone();caches.open(CACHE).then(function(c){c.put("./index.html",k);});}return res;});
    var traag=new Promise(function(ok){setTimeout(function(){caches.match("./index.html").then(function(h){if(h)ok(h);});},3000);});
    e.respondWith(Promise.race([net.catch(function(){return caches.match("./index.html");}),traag]));
    e.waitUntil(net.catch(function(){}));return;}
  e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res&&res.ok){var k=res.clone();caches.open(CACHE).then(function(c){c.put(r,k);});}return res;});}));});
