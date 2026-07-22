const CACHE='fwd115-v1';
self.addEventListener('install',function(e){ self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(['./','./index.html','./manifest.webmanifest']);}).catch(function(){})); });
self.addEventListener('activate',function(e){ e.waitUntil(
  caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return k===CACHE?null:caches.delete(k);}));}).then(function(){return self.clients.claim();})); });
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(resp){
      if(resp&&resp.status===200){ var copy=resp.clone(); caches.open(CACHE).then(function(c){c.put(e.request,copy);}); }
      return resp;
    }).catch(function(){
      return caches.match(e.request,{ignoreSearch:true}).then(function(r){ return r||caches.match('./index.html'); });
    })
  );
});
