// 🔄 UBAH NOMOR VERSI INI SETIAP KALI ANDA MELAKUKAN PERUBAHAN KODE DI INDEX.HTML / ADMIN.HTML
const CACHE_NAME = 'ikra-pwa-cache-v1.1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/admin.html',
  '/manifest.json',
  '/manifest-admin.json'
];

// Tahap Install: Memaksa Service Worker baru langsung aktif
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Menggunakan mode 'reload' agar mengambil data segar dari server GitHub, bukan cache
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return fetch(new Request(url, { cache: 'reload' }))
            .then(response => {
              if (response.ok) return cache.put(url, response);
              fail;
            })
            .catch(() => console.log('Gagal mengunduh aset untuk cache:', url));
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Tahap Activate: Membersihkan cache versi lama agar tidak menumpuk di HP
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lawas:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Tahap Fetch: Mengambil dari jaringan internet dulu (Network First) agar data selalu update, jika offline baru ambil dari cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Jika berhasil tersambung ke internet, berikan respon segar
        return response;
      })
      .catch(() => {
        // Jika offline atau jaringan gagal, ambil dari cache lokal yang ada
        return caches.match(event.request);
      })
  );
});
