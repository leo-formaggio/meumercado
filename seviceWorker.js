const staticMeuMercado = "meu-mercado-v1";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/scripts.js",
  "/assets/car-logo.png",
  "/assets/new-logo.png",
  "/assets/icons8-add-new-40.png",
  "/assets/icons8-close-window-40.png",
  "/assets/icons8-download-40.png",
  "/assets/icons8-upload-40.png",
  "/assets/moco-lab-cart2.png"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticMeuMercado).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});