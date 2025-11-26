// Service Worker simplificado para la aplicación PWA
const CACHE_NAME = 'inventario-ventas-v2.1';

// Instalar Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Service Worker: Cache abierto');
      return cache;
    })
  );
});

// Activar Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests de red
self.addEventListener('fetch', function(event) {
  // No cachear requests a Google Apps Script (evita problemas CORS)
  if (event.request.url.includes('script.google.com')) {
    return;
  }
  
  // Estrategia Cache First para archivos estáticos
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Devolver desde cache si está disponible
          if (response) {
            return response;
          }
          
          // Si no está en cache, hacer fetch
          return fetch(event.request)
            .then(function(response) {
              // Solo cachear responses válidas
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clonar la respuesta para el cache
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            });
        })
        .catch(function() {
          // Fallback cuando no hay conexión
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
    );
  }
});
