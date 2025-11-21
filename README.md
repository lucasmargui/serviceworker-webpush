# 📘 Web Push Notification System 

A fully structured, professional, and production‑oriented documentation for a complete **Web Push Notification System** using:
- **PHP backend**
- **Service Worker (sw.js)**
- **Browser Push Subscriptions**
- **Hash map device-user linkage** for secure notification routing

---

# 🚀 Overview
This project implements a robust Web Push Notification system designed to deliver notifications across devices while ensuring:
- Consistent subscription management
- Secure user-to-device association
- Optimized endpoint lookup via a hash map
- Multi-device delivery support

The system consists of:
1. **Frontend + Service Worker (browser layer)**
2. **Backend in PHP (server layer)**
3. **Subscription storage** (`subscriptions.json`)
4. **Hash map device registry** (`hashmap.json`)

---

# 🌐 Architecture Summary

```
┌────────────────┐        Push Request        ┌────────────────────┐
│ PHP Backend    │  ───────────────────────► │ Browser Push Service│
└────────────────┘                            └────────────────────┘
         ▲                                              │
         │                                              ▼
         │                                     Push Event Triggered
         │                                              │
         ▼                                              ▼
┌────────────────┐   Subscription + SW Events   ┌────────────────────┐
│ Frontend + SW  │ ◄─────────────────────────── │ User's Browser     │
└────────────────┘                              └────────────────────┘
```

<img width="2048" height="607" alt="image" src="https://github.com/user-attachments/assets/9203f841-0f99-4d01-a80f-a5a88be061c7" />


---

# 🛰️ 1. Web Push Fundamentals

Web Push allows your server to send notifications even when:
- The website is closed
- The tab is not active
- The browser is minimized

It works using:
- Browser API (PushManager)
- A Service Worker acting as a background listener
- Backend signed messages (via VAPID keys)

---

# 🔑 2. Subscription Workflow

A subscription is created when:
1. The user grants permission
2. The browser generates a **subscription object** containing:
   - `endpoint` (unique, device/browser-specific address)
   - `p256dh` and `auth` keys (for encrypted payload delivery)

The backend stores this subscription for later message delivery.

---

# 🧠 3. Service Worker (`sw.js`)

The Service Worker runs independently from the web page.

## Responsibilities
- Receive **push events** from the browser Push Service
- Build and display notifications
- Handle **notification interaction** (clicks)

## 📡 Push Event
```js
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            image: data.image,
            tag: data.tag,
            data: { url: data.url }
        })
    );
});
```

## 🖱️ Notification Click
```js
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

---

# 🖥️ 4. Backend (PHP)

The backend is responsible for:
- Managing subscriptions
- Linking endpoints to users
- Sending notifications to all active devices
- Generating dynamic payloads (with random tags)
- Storing data in JSON files

### Installation
```
composer require minishlink/web-push
```

---

# 📬 5. Notification Payload Example

```php
$payload = json_encode([
    'title' => '🚀 Invitation Request!',
    'body' => 'You received a new invitation request. Click for more details!',
    'icon' => '/images/codigo-qr.png',
    'image' => '/images/formulario.png',
    'tag' => 'invite-request-' . rand(100000, 999999),
    'url' => '/'
]);
```

---

# 🗂️ 6. Database Structure

## A. `subscriptions.json`
Holds all subscriptions per user.

A user may have multiple subscriptions:
- Mobile
- Laptop
- Chrome
- Firefox

### Example
```json
{
    "3": {
        "active": true,
        "subscriptions": [
            {
                "endpoint": "https://fcm.googleapis.com/fcm/send/...",
                "expirationTime": null,
                "keys": {
                    "p256dh": "...",
                    "auth": "..."
                }
            }
        ]
    }
}
```

---

# 🔐 7. Hash Map Device Registry (`hashmap.json`)

## Why It Exists
Each browser generates a **unique and permanent endpoint**. By storing:

- **KEY:** Subscription endpoint
- **VALUE:** User ID

your system gains the ability to:
- Know **which user** is currently logged into a device
- Ensure notifications go **only** to the correct user
- Prevent cross‑user notification leaks
- Avoid scanning all users when resolving a device

## Example
```json
{
    "https://fcm.googleapis.com/fcm/send/ABC123": 3,
    "https://updates.push.services.mozilla.com/push/XYZ789": 7
}
```

## Benefits
- 🔍 **Instant lookup**: endpoint → user ID
- 🔐 **Device-level security**: only the mapped user receives notifications
- 🧼 **Easy maintenance**: update mappings when users switch accounts
- ⚡ **High performance**: avoids iterating large subscription files

---

# 🧭 8. Complete Workflow Summary

1. User enters their ID and submits via AJAX
2. PHP validates and converts ID to integer
3. Browser creates Service Worker subscription
4. Backend stores:
   - Subscription in `subscriptions.json`
   - Endpoint→User mapping in `hashmap.json`
5. Backend sends notification
6. Random `tag` prevents message merging
7. Service Worker displays notification
8. User clicks → redirected to URL

---

# 🎯 Conclusion
This notification architecture is designed for:
- Multi-device reliability
- Secure endpoint‑to‑user tracking
- Fast lookups via hash map
- Professional maintainability
- Scalable notification delivery

<img width="1722" height="863" alt="image" src="https://github.com/user-attachments/assets/d97adf77-8267-463b-9d9b-69b78d446887" />


Your system now ensures that **each device only receives notifications belonging to the last logged‑in user**, preventing cross-account issues and keeping delivery accurate.


