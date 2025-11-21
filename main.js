// Verifica se o navegador suporta service workers e push
if ('serviceWorker' in navigator && 'PushManager' in window) {

    const publicVapidKey = 'SUA_CHAVE_PUBLICA_VAPID'; // gerada no servidor

    // Registra o Service Worker
    const sw = await navigator.serviceWorker.register('sw.js');
    console.log('Service Worker registrado:', sw);

    const subscribeBtn = document.getElementById('subscribe');
    subscribeBtn.addEventListener('click', async () => {
        // Solicita permissão de notificação
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Permissão negada!');
            return;
        }

        // Cria a subscription
        const subscription = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        // Envia a subscription para o servidor
        await fetch('/save-subscription.php', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Subscription enviada para o servidor!');
    });

} else {
    console.warn('Service Worker ou Push Notifications não suportados neste navegador.');
}

// Função auxiliar para converter chave VAPID
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}
