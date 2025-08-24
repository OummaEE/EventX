// Offline Functionality Module for EventX PWA
// Enhanced offline experience for My Ticket and My Booking screens

class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.offlineData = this.loadOfflineData();

        this.init();
        console.log('[Offline] Manager initialized, online status:', this.isOnline);
    }

    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.onOnline();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.onOffline();
        });

        // Check if we're currently offline and update UI
        this.updateOfflineStatus();
    }

    // Handle coming back online
    onOnline() {
        console.log('[Offline] Back online');
        this.updateOfflineStatus();
        this.syncPendingData();
        this.showOnlineMessage();
    }

    // Handle going offline
    onOffline() {
        console.log('[Offline] Gone offline');
        this.updateOfflineStatus();
        this.showOfflineMessage();
    }

    // Update UI to show offline status
    updateOfflineStatus() {
        const offlineIndicator = document.querySelector('.offline-indicator');
        const offlineScreens = document.querySelectorAll('.offline-screen');
        const onlineContent = document.querySelectorAll('.online-content');

        if (!this.isOnline) {
            // Show offline indicator
            if (offlineIndicator) {
                offlineIndicator.style.display = 'block';
            }

            // Show offline screens for booking/ticket tabs
            offlineScreens.forEach(screen => {
                screen.style.display = 'block';
            });

            // Hide online-only content
            onlineContent.forEach(content => {
                content.style.display = 'none';
            });
        } else {
            // Hide offline indicator
            if (offlineIndicator) {
                offlineIndicator.style.display = 'none';
            }

            // Hide offline screens
            offlineScreens.forEach(screen => {
                screen.style.display = 'none';
            });

            // Show online content
            onlineContent.forEach(content => {
                content.style.display = 'block';
            });
        }
    }

    // Cache booking data for offline access
    cacheBookingData(booking) {
        const bookings = this.offlineData.bookings || [];
        const existingIndex = bookings.findIndex(b => b.id === booking.id);

        if (existingIndex >= 0) {
            bookings[existingIndex] = booking;
        } else {
            bookings.push(booking);
        }

        this.offlineData.bookings = bookings;
        this.saveOfflineData();

        // Cache in service worker too
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CACHE_BOOKING',
                booking: booking
            });
        }

        console.log('[Offline] Booking cached:', booking.id);
    }

    // Get cached bookings for offline viewing
    getCachedBookings() {
        return this.offlineData.bookings || [];
    }

    // Cache user data for offline access
    cacheUserData(userData) {
        this.offlineData.user = userData;
        this.saveOfflineData();
        console.log('[Offline] User data cached');
    }

    // Get cached user data
    getCachedUserData() {
        return this.offlineData.user || null;
    }

    // Create offline booking screen
    createOfflineBookingScreen() {
        const cachedBookings = this.getCachedBookings();
        const cachedUser = this.getCachedUserData();

        return `
            <div class="offline-screen" id="offline-bookings">
                <div class="offline-header">
                    <div class="offline-icon">📱</div>
                    <h2>Offline Mode</h2>
                    <p>Viewing cached bookings</p>
                </div>

                <div class="offline-content">
                    ${cachedBookings.length > 0 ? `
                        <div class="cached-bookings">
                            ${cachedBookings.map(booking => `
                                <div class="booking-card offline-booking">
                                    <div class="booking-header">
                                        <h3>${booking.service}</h3>
                                        <span class="booking-status">
                                            ${booking.status || 'Confirmed'}
                                        </span>
                                    </div>

                                    <div class="booking-details">
                                        <div class="detail-item">
                                            <span class="material-icons">event</span>
                                            <span>${booking.date} at ${booking.time}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="material-icons">group</span>
                                            <span>${booking.participants} participants</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="material-icons">confirmation_number</span>
                                            <span>ID: ${booking.id}</span>
                                        </div>
                                    </div>

                                    <div class="booking-actions offline-actions">
                                        <button class="btn-outline" onclick="window.offlineManager.viewOfflineTicket('${booking.id}')">
                                            <span class="material-icons">local_activity</span>
                                            View Ticket
                                        </button>
                                        <button class="btn-outline" onclick="window.offlineManager.shareBooking('${booking.id}')">
                                            <span class="material-icons">share</span>
                                            Share
                                        </button>
                                    </div>

                                    <div class="offline-note">
                                        <span class="material-icons">info</span>
                                        Cached data - Connect to internet for latest updates
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="no-cached-data">
                            <div class="empty-state">
                                <span class="material-icons">cloud_off</span>
                                <h3>No Cached Bookings</h3>
                                <p>Make a booking while online to view it here when offline.</p>
                            </div>
                        </div>
                    `}
                </div>

                <div class="offline-footer">
                    <button class="btn-primary" onclick="window.offlineManager.checkConnection()">
                        <span class="material-icons">refresh</span>
                        Check Connection
                    </button>
                </div>
            </div>
        `;
    }

    // Create offline ticket screen
    createOfflineTicketScreen(bookingId) {
        const booking = this.getCachedBookings().find(b => b.id === bookingId);
        if (!booking) return '<div>Ticket not found offline</div>';

        return `
            <div class="offline-ticket">
                <div class="ticket-header">
                    <h2>My Ticket</h2>
                    <div class="offline-badge">Offline</div>
                </div>

                <div class="ticket-content">
                    <div class="ticket-main">
                        <div class="event-info">
                            <h1>${booking.service}</h1>
                            <div class="event-details">
                                <div class="detail-row">
                                    <span class="material-icons">event</span>
                                    <div>
                                        <strong>${booking.date}</strong>
                                        <span>${booking.time}</span>
                                    </div>
                                </div>
                                <div class="detail-row">
                                    <span class="material-icons">group</span>
                                    <span>${booking.participants} participants</span>
                                </div>
                                <div class="detail-row">
                                    <span class="material-icons">location_on</span>
                                    <span>EventX, Stockholm</span>
                                </div>
                            </div>
                        </div>

                        <div class="qr-code-section">
                            <div class="qr-placeholder">
                                <div class="qr-code">
                                    <span class="material-icons">qr_code</span>
                                    <div>QR Code</div>
                                    <small>ID: ${booking.id}</small>
                                </div>
                            </div>
                            <p>Show this at EventX for check-in</p>
                        </div>
                    </div>

                    <div class="ticket-actions">
                        <button class="btn-outline" onclick="window.offlineManager.shareTicket('${booking.id}')">
                            <span class="material-icons">share</span>
                            Share Ticket
                        </button>
                        ${window.appleWalletManager && window.appleWalletManager.isSupported ? `
                            <button class="btn-outline" onclick="window.appleWalletManager.generateBookingPass(${JSON.stringify(booking).replace(/"/g, '&quot;')})">
                                <span class="material-icons">account_balance_wallet</span>
                                Add to Wallet
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div class="offline-warning">
                    <span class="material-icons">warning</span>
                    <div>
                        <strong>Offline Mode</strong>
                        <p>This is cached ticket data. Connect to internet to verify latest status and receive updates.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // View offline ticket
    viewOfflineTicket(bookingId) {
        const ticketHtml = this.createOfflineTicketScreen(bookingId);

        // Create modal or navigate to ticket view
        const modal = document.createElement('div');
        modal.className = 'offline-ticket-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.offline-ticket-modal').remove()">
                    <span class="material-icons">close</span>
                </button>
                ${ticketHtml}
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Share booking/ticket
    shareBooking(bookingId) {
        const booking = this.getCachedBookings().find(b => b.id === bookingId);
        if (!booking) return;

        const shareData = {
            title: `EventX Booking - ${booking.service}`,
            text: `My booking for ${booking.service} on ${booking.date} at ${booking.time}`,
            url: window.location.origin + `/?booking=${bookingId}`
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback - copy to clipboard
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            navigator.clipboard.writeText(text).then(() => {
                this.showMessage('Booking details copied to clipboard!', 'success');
            });
        }
    }

    // Share ticket
    shareTicket(bookingId) {
        this.shareBooking(bookingId);
    }

    // Check internet connection
    async checkConnection() {
        try {
            const response = await fetch('/manifest.json', { 
                method: 'HEAD',
                cache: 'no-cache'
            });

            if (response.ok) {
                this.isOnline = true;
                this.onOnline();
            } else {
                throw new Error('Connection failed');
            }
        } catch (error) {
            this.showMessage('Still offline. Please check your internet connection.', 'warning');
        }
    }

    // Sync pending data when back online
    async syncPendingData() {
        try {
            console.log('[Offline] Syncing pending data...');

            // Trigger service worker sync
            if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register('booking-sync');
            }

        } catch (error) {
            console.error('[Offline] Sync failed:', error);
        }
    }

    // Load offline data from localStorage
    loadOfflineData() {
        try {
            const data = localStorage.getItem('eventx-offline-data');
            return data ? JSON.parse(data) : { bookings: [], user: null };
        } catch (error) {
            console.error('[Offline] Failed to load offline data:', error);
            return { bookings: [], user: null };
        }
    }

    // Save offline data to localStorage
    saveOfflineData() {
        try {
            localStorage.setItem('eventx-offline-data', JSON.stringify(this.offlineData));
        } catch (error) {
            console.error('[Offline] Failed to save offline data:', error);
        }
    }

    // Show online message
    showOnlineMessage() {
        this.showMessage('Back online! 🌐', 'success');
    }

    // Show offline message
    showOfflineMessage() {
        this.showMessage('You're offline. Showing cached data.', 'info');
    }

    // Show message to user
    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `offline-message offline-message--${type}`;
        messageEl.innerHTML = `
            <span class="material-icons">
                ${type === 'success' ? 'check_circle' : 
                  type === 'warning' ? 'warning' : 
                  type === 'error' ? 'error' : 'info'}
            </span>
            <span>${message}</span>
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // Get offline status
    getOfflineStatus() {
        return {
            isOnline: this.isOnline,
            cachedBookings: this.getCachedBookings().length,
            hasCachedUser: !!this.getCachedUserData(),
            lastSync: this.offlineData.lastSync || null
        };
    }
}

// Initialize offline manager
window.offlineManager = new OfflineManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OfflineManager;
}
