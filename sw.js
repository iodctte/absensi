self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Pass-through fetch (tidak melakukan caching rumit, hanya by-pass)
});
