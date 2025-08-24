// Advanced Service Worker for EventX PWA
// Version 2.1 - Enhanced with Push Notifications, Apple Wallet, and Advanced Offline

const CACHE_NAME = 'eventx-pwa-v2.1';
const STATIC_CACHE = 'eventx-static-v2.1';
const DYNAMIC_CACHE = 'eventx-dynamic-v2.1';
const OFFLINE_CACHE = 'eventx-offline-v2.1';

// Cache resources
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/js/user-system.js',
    '/js/email-service.js',
    '/js/push-notifications.js',
    '/js/apple-wallet.js',
    '/js/apple-pay.js',
    '/css/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/offline.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Network-first resources (for dynamic content)
const NETWORK_FIRST = [
    '/api/',
    '/booking/',
    '/news/',
    '/photos/'
];

// Cache-first resources (for static assets)
const CACHE_FIRST = [
    '/icons/',
    '/css/',
    '/js/',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.svg'
];

// Install Event - Cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing...');

    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),

            // Cache offline page
            caches.open(OFFLINE_CACHE).then(cache => {
                return cache.add('/offline.html');
            })
        ]).then(() => {
            console.log('[SW] Installation complete');
            self.skipWaiting();
        })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');

    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== OFFLINE_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),

            // Take control of all pages
            self.clients.claim()
        ]).then(() => {
            console.log('[SW] Activation complete');
        })
    );
});

// Fetch Event - Advanced caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Handle different caching strategies
    if (shouldUseNetworkFirst(request)) {
        event.respondWith(handleNetworkFirst(request));
    } else if (shouldUseCacheFirst(request)) {
        event.respondWith(handleCacheFirst(request));
    } else {
        event.respondWith(handleStaleWhileRevalidate(request));
    }
});

// Network-first strategy (for dynamic content)
async function handleNetworkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', error);

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }

        throw error;
    }
}

// Cache-first strategy (for static assets)
async function handleCacheFirst(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Cache and network failed:', error);
        throw error;
    }
}

// Stale-while-revalidate strategy (default)
async function handleStaleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.log('[SW] Network failed:', error);
        return cachedResponse;
    });

    return cachedResponse || fetchPromise;
}

// Helper functions to determine caching strategy
function shouldUseNetworkFirst(request) {
    return NETWORK_FIRST.some(pattern => request.url.includes(pattern));
}

function shouldUseCacheFirst(request) {
    return CACHE_FIRST.some(pattern => request.url.includes(pattern));
}

// Push Event - Handle push notifications
self.addEventListener('push', event => {
    console.log('[SW] Push notification received');

    let notificationData = {
        title: 'EventX Notification',
        body: 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'eventx-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'View Details',
                icon: '/icons/action-view.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/icons/action-dismiss.png'
            }
        ],
        data: {
            url: '/',
            timestamp: Date.now()
        }
    };

    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = { ...notificationData, ...pushData };
        } catch (error) {
            console.log('[SW] Error parsing push data:', error);
            notificationData.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Notification Click Event
self.addEventListener('notificationclick', event => {
    console.log('[SW] Notification clicked:', event.notification.tag);

    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.postMessage({
                            type: 'NOTIFICATION_CLICKED',
                            action: event.action,
                            data: event.notification.data
                        });
                        return client.focus();
                    }
                }

                // Open new window if app is not open
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// Background Sync Event
self.addEventListener('sync', event => {
    console.log('[SW] Background sync triggered:', event.tag);

    if (event.tag === 'booking-sync') {
        event.waitUntil(syncBookings());
    } else if (event.tag === 'notification-sync') {
        event.waitUntil(syncNotifications());
    }
});

// Background sync functions
async function syncBookings() {
    try {
        console.log('[SW] Syncing bookings...');

        // Get pending bookings from IndexedDB or localStorage
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_BOOKINGS'
            });
        });

        console.log('[SW] Booking sync completed');
    } catch (error) {
        console.error('[SW] Booking sync failed:', error);
    }
}

async function syncNotifications() {
    try {
        console.log('[SW] Syncing notifications...');

        // Check for scheduled notifications
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_NOTIFICATIONS'
            });
        });

        console.log('[SW] Notification sync completed');
    } catch (error) {
        console.error('[SW] Notification sync failed:', error);
    }
}

// Periodic Background Sync (when supported)
self.addEventListener('periodicsync', event => {
    console.log('[SW] Periodic sync triggered:', event.tag);

    if (event.tag === 'booking-reminders') {
        event.waitUntil(checkBookingReminders());
    }
});

async function checkBookingReminders() {
    try {
        console.log('[SW] Checking booking reminders...');

        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CHECK_REMINDERS'
            });
        });

    } catch (error) {
        console.error('[SW] Reminder check failed:', error);
    }
}

// Message Event - Handle messages from main thread
self.addEventListener('message', event => {
    console.log('[SW] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    } else if (event.data && event.data.type === 'CACHE_BOOKING') {
        cacheBookingData(event.data.booking);
    } else if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
        scheduleNotification(event.data.notification);
    }
});

// Cache booking data for offline access
async function cacheBookingData(booking) {
    try {
        const cache = await caches.open(OFFLINE_CACHE);
        const bookingUrl = `/booking/${booking.id}`;

        const response = new Response(JSON.stringify(booking), {
            headers: { 'Content-Type': 'application/json' }
        });

        await cache.put(bookingUrl, response);
        console.log('[SW] Booking cached for offline access:', booking.id);
    } catch (error) {
        console.error('[SW] Failed to cache booking:', error);
    }
}

// Schedule notification (store in IndexedDB for later)
async function scheduleNotification(notification) {
    try {
        console.log('[SW] Scheduling notification:', notification);

        // Send message to main thread to handle scheduling
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'NOTIFICATION_SCHEDULED',
                notification: notification
            });
        });

    } catch (error) {
        console.error('[SW] Failed to schedule notification:', error);
    }
}

// Console log for debugging
console.log('[SW] EventX Advanced Service Worker v2.1 loaded');
