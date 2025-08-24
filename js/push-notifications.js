// Push Notifications Module for EventX PWA
// Advanced Web Push implementation with VAPID keys and booking reminders

class PushNotificationManager {
    constructor() {
        this.vapidPublicKey = 'BEL2kRXdLFZzKjyHHe2RFxqN2Xq4o3r2k8X9V3L1N6M5q8P9S2F7G4H2j9K6n3B1'; // Replace with your VAPID public key
        this.registration = null;
        this.subscription = null;
        this.isSupported = this.checkSupport();
        this.isEnabled = false;

        this.init();
    }

    checkSupport() {
        return 'serviceWorker' in navigator && 
               'PushManager' in window && 
               'Notification' in window;
    }

    async init() {
        if (!this.isSupported) {
            console.warn('[Push] Web Push not supported');
            return;
        }

        try {
            this.registration = await navigator.serviceWorker.ready;
            this.subscription = await this.registration.pushManager.getSubscription();
            this.isEnabled = !!this.subscription;

            console.log('[Push] Initialized:', { isEnabled: this.isEnabled });

            // Listen for service worker messages
            navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

            // Auto-check reminders on init
            this.checkScheduledReminders();

        } catch (error) {
            console.error('[Push] Initialization failed:', error);
        }
    }

    async requestPermission() {
        if (!this.isSupported) {
            throw new Error('Push notifications not supported');
        }

        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('[Push] Permission granted');
            return true;
        } else {
            console.log('[Push] Permission denied');
            return false;
        }
    }

    async subscribe() {
        try {
            if (!this.registration) {
                throw new Error('Service Worker not ready');
            }

            // Request permission first
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                throw new Error('Push permission denied');
            }

            // Convert VAPID key to Uint8Array
            const applicationServerKey = this.urlBase64ToUint8Array(this.vapidPublicKey);

            // Subscribe to push service
            this.subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            });

            this.isEnabled = true;

            // Save subscription to localStorage
            localStorage.setItem('pushSubscription', JSON.stringify(this.subscription));

            // Send subscription to your server (implement as needed)
            await this.sendSubscriptionToServer(this.subscription);

            console.log('[Push] Subscribed successfully');
            return this.subscription;

        } catch (error) {
            console.error('[Push] Subscription failed:', error);
            throw error;
        }
    }

    async unsubscribe() {
        try {
            if (this.subscription) {
                await this.subscription.unsubscribe();
                this.subscription = null;
                this.isEnabled = false;

                localStorage.removeItem('pushSubscription');
                localStorage.removeItem('scheduledNotifications');

                console.log('[Push] Unsubscribed successfully');
                return true;
            }
        } catch (error) {
            console.error('[Push] Unsubscribe failed:', error);
            throw error;
        }
    }

    // Schedule booking reminder notifications
    scheduleBookingReminder(booking) {
        const bookingTime = new Date(booking.date + ' ' + booking.time);
        const now = new Date();

        // Schedule reminders at different intervals
        const reminders = [
            { minutes: 60, message: '1 час до вашей игры в ' + booking.service },
            { minutes: 30, message: '30 минут до вашей игры в ' + booking.service },
            { minutes: 15, message: '15 минут до начала! Время собираться в ' + booking.service }
        ];

        reminders.forEach(reminder => {
            const reminderTime = new Date(bookingTime.getTime() - (reminder.minutes * 60 * 1000));

            if (reminderTime > now) {
                this.scheduleNotification({
                    id: `booking-${booking.id}-${reminder.minutes}`,
                    title: 'EventX Напоминание',
                    body: reminder.message,
                    scheduledTime: reminderTime.getTime(),
                    data: {
                        bookingId: booking.id,
                        type: 'booking-reminder',
                        url: '/?tab=bookings'
                    },
                    actions: [
                        {
                            action: 'view-booking',
                            title: 'Посмотреть бронь',
                            icon: '/icons/action-view.png'
                        },
                        {
                            action: 'get-directions',
                            title: 'Маршрут',
                            icon: '/icons/action-map.png'
                        }
                    ]
                });
            }
        });
    }

    // Schedule a notification
    scheduleNotification(notification) {
        const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
        scheduledNotifications.push(notification);
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));

        console.log('[Push] Notification scheduled:', notification);

        // Set timeout for immediate scheduling
        const timeUntilNotification = notification.scheduledTime - Date.now();
        if (timeUntilNotification > 0 && timeUntilNotification <= 24 * 60 * 60 * 1000) { // Within 24 hours
            setTimeout(() => {
                this.showLocalNotification(notification);
            }, timeUntilNotification);
        }

        // Register background sync for long-term scheduling
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('notification-sync');
            });
        }
    }

    // Show local notification
    async showLocalNotification(notification) {
        if (!this.isSupported || Notification.permission !== 'granted') {
            return;
        }

        try {
            if (this.registration) {
                await this.registration.showNotification(notification.title, {
                    body: notification.body,
                    icon: '/icons/icon-192x192.png',
                    badge: '/icons/badge-72x72.png',
                    tag: notification.id,
                    data: notification.data,
                    actions: notification.actions || [],
                    requireInteraction: true,
                    vibrate: [200, 100, 200]
                });
            } else {
                // Fallback to browser notification
                new Notification(notification.title, {
                    body: notification.body,
                    icon: '/icons/icon-192x192.png',
                    tag: notification.id,
                    data: notification.data
                });
            }

            console.log('[Push] Local notification shown:', notification.id);

        } catch (error) {
            console.error('[Push] Failed to show notification:', error);
        }
    }

    // Check for scheduled reminders that need to be triggered
    checkScheduledReminders() {
        const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
        const now = Date.now();
        const pendingNotifications = [];

        scheduledNotifications.forEach(notification => {
            if (notification.scheduledTime <= now) {
                // Time to show this notification
                this.showLocalNotification(notification);
            } else {
                // Keep for later
                pendingNotifications.push(notification);
            }
        });

        // Update stored notifications
        localStorage.setItem('scheduledNotifications', JSON.stringify(pendingNotifications));

        // Schedule next check in 1 minute
        setTimeout(() => {
            this.checkScheduledReminders();
        }, 60000);
    }

    // Handle messages from service worker
    handleServiceWorkerMessage(event) {
        const { data } = event;

        switch (data.type) {
            case 'NOTIFICATION_CLICKED':
                this.handleNotificationClick(data);
                break;
            case 'SYNC_NOTIFICATIONS':
                this.checkScheduledReminders();
                break;
            case 'CHECK_REMINDERS':
                this.checkScheduledReminders();
                break;
            default:
                console.log('[Push] Unknown message from SW:', data);
        }
    }

    // Handle notification clicks
    handleNotificationClick(data) {
        console.log('[Push] Notification clicked:', data);

        // Handle different notification actions
        if (data.action === 'view-booking' && data.data?.bookingId) {
            // Navigate to booking details
            if (typeof showTab === 'function') {
                showTab('bookings');
            }
        } else if (data.action === 'get-directions') {
            // Open maps with EventX location
            const eventxAddress = 'EventX, Stockholm, Sweden';
            const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(eventxAddress)}`;
            window.open(mapsUrl, '_blank');
        }
    }

    // Send subscription to server (implement according to your backend)
    async sendSubscriptionToServer(subscription) {
        try {
            // This is where you would send the subscription to your server
            // Replace with your actual endpoint
            console.log('[Push] Subscription to send to server:', subscription);

            /* Example implementation:
            const response = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription)
            });

            if (!response.ok) {
                throw new Error('Failed to save subscription on server');
            }
            */

        } catch (error) {
            console.error('[Push] Failed to send subscription to server:', error);
        }
    }

    // Convert VAPID key from base64 to Uint8Array
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Get current subscription status
    getSubscriptionStatus() {
        return {
            isSupported: this.isSupported,
            isEnabled: this.isEnabled,
            permission: Notification.permission,
            subscription: this.subscription
        };
    }

    // Test notification
    async sendTestNotification() {
        if (!this.isEnabled) {
            throw new Error('Push notifications not enabled');
        }

        await this.showLocalNotification({
            id: 'test-notification',
            title: 'EventX Test',
            body: 'Push-уведомления работают! 🎉',
            data: { type: 'test' },
            scheduledTime: Date.now()
        });
    }
}

// Create global instance
window.pushManager = new PushNotificationManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PushNotificationManager;
}
