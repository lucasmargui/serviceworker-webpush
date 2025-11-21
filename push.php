<?php
require __DIR__ . '/vendor/autoload.php';

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

// Subscription do usuário (você pegou via JS e salvou no banco)
$subscription = Subscription::create([
    'endpoint' => 'ENDPOINT_DO_USUARIO',
    'publicKey' => 'CHAVE_P256DH_DO_USUARIO',
    'authToken' => 'CHAVE_AUTH_DO_USUARIO'
]);

// Chaves VAPID do seu servidor
$auth = [
    'VAPID' => [
        'subject' => 'mailto:seuemail@dominio.com',
        'publicKey' => 'SUA_CHAVE_PUBLICA',
        'privateKey' => 'SUA_CHAVE_PRIVADA'
    ]
];

$webPush = new WebPush($auth);

// Envia a notificação
$webPush->sendOneNotification(
    $subscription,
    json_encode([
        'title' => 'Olá!',
        'body' => 'Esta é uma notificação do seu servidor PHP.'
    ])
);