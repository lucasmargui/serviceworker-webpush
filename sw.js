self.addEventListener('push', event => {
    let data = { title: 'Notificação', body: 'Mensagem padrão', url: '/' };

    if (event.data) {
        data = event.data.json(); // espera que o servidor envie JSON
    }

    const options = {
        body: data.body,
        icon: data.icon || '/icon.png',
        badge: data.badge || '/badge.png',
        data: data.url
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = event.notification.data || '/';
    event.waitUntil(clients.openWindow(url));
});
