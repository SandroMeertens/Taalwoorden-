/* Taalwoorden werkt ook zonder internet. De pagina zelf: eerst online kijken (voor updates), anders de bewaarde versie. Lettertypes en plaatjes: uit de bewaarde versie. */
var CACHE="taalwoorden-v2";
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./vendor/firebase.js"]);}));self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;var u=new URL(r.url);
  /* Database en inloggen gaan altijd rechtstreeks naar internet. */
  if(u.origin!==self.location.origin&&!/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(function(res){var k=res.clone();caches.open(CACHE).then(function(c){c.put("./index.html",k);});return res;}).catch(function(){return caches.match("./index.html");}));return;}
  e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res&&(res.ok||res.type==="opaque")){var k=res.clone();caches.open(CACHE).then(function(c){c.put(r,k);});}return res;});}));});
