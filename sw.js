importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// 1. Inicialização do Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC4dm0KoyJswhyCY7tgbF4D2nmuZl84X8E",
    projectId: "quizlegends-f58fc",
    messagingSenderId: "1050463164018",
    appId: "1:1050463164018:web:91de002b8afc8e678f54eb"
});

const messaging = firebase.messaging();

// 2. Gerenciamento de Notificações (CORRIGIDO: Removido admin.png que não existia)
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'app-512.png' // Usando o ícone que existe para evitar erro
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 3. LÓGICA PWA - CACHE ESSENCIAL
const CACHE_NAME = 'quiz-legends-v3'; // Versão 3 para forçar atualização
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'manifest-jogo.json',
    'app-192.png',
    'app-512.png',
    'admin-vertical.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Adiciona os arquivos um por um para não travar se um falhar
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(asset => cache.add(asset))
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

// Evento Fetch (Obrigatório para o botão de instalar aparecer)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
