// Apple Wallet Integration for EventX PWA
// PassKit implementation for booking tickets

class AppleWalletManager {
    constructor() {
        this.isSupported = this.checkSupport();
        this.passTypeId = 'pass.com.eventx.booking'; // Replace with your pass type ID
        this.teamId = 'YOUR_TEAM_ID'; // Replace with your Apple Developer Team ID

        console.log('[Wallet] Apple Wallet support:', this.isSupported);
    }

    checkSupport() {
        // Check if running on iOS Safari and supports PassKit
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        return isIOS && isSafari && 'PassKit' in window;
    }

    // Generate Apple Wallet pass for booking
    async generateBookingPass(booking) {
        try {
            if (!this.isSupported) {
                throw new Error('Apple Wallet not supported on this device');
            }

            const passData = this.createPassData(booking);
            const passBuffer = await this.createPassFile(passData);

            // Create blob and download link
            const blob = new Blob([passBuffer], { type: 'application/vnd.apple.pkpass' });
            const url = URL.createObjectURL(blob);

            // For iOS Safari, we can use the PassKit API
            if ('PassKit' in window) {
                try {
                    await window.PassKit.addPass(url);
                    console.log('[Wallet] Pass added to Apple Wallet');
                } catch (error) {
                    console.error('[Wallet] Failed to add pass:', error);
                    // Fallback to download
                    this.downloadPass(url, `eventx-booking-${booking.id}.pkpass`);
                }
            } else {
                // Fallback to download
                this.downloadPass(url, `eventx-booking-${booking.id}.pkpass`);
            }

            return url;

        } catch (error) {
            console.error('[Wallet] Failed to generate pass:', error);
            throw error;
        }
    }

    // Create pass data structure
    createPassData(booking) {
        const now = new Date();
        const bookingDate = new Date(booking.date + ' ' + booking.time);

        return {
            formatVersion: 1,
            passTypeIdentifier: this.passTypeId,
            serialNumber: `booking-${booking.id}-${Date.now()}`,
            teamIdentifier: this.teamId,
            organizationName: 'EventX',
            description: `EventX Booking - ${booking.service}`,
            logoText: 'EventX',
            foregroundColor: 'rgb(255, 255, 255)',
            backgroundColor: 'rgb(15, 23, 42)',
            labelColor: 'rgb(148, 163, 184)',

            // Pass structure
            eventTicket: {
                primaryFields: [
                    {
                        key: 'event',
                        label: 'EVENT',
                        value: booking.service
                    }
                ],
                secondaryFields: [
                    {
                        key: 'date',
                        label: 'DATE',
                        value: this.formatDate(bookingDate),
                        textAlignment: 'PKTextAlignmentLeft'
                    },
                    {
                        key: 'time',
                        label: 'TIME',
                        value: booking.time,
                        textAlignment: 'PKTextAlignmentRight'
                    }
                ],
                auxiliaryFields: [
                    {
                        key: 'participants',
                        label: 'PARTICIPANTS',
                        value: `${booking.participants} чел.`
                    },
                    {
                        key: 'booking-id',
                        label: 'BOOKING ID',
                        value: booking.id
                    }
                ],
                backFields: [
                    {
                        key: 'customer-name',
                        label: 'Customer Name',
                        value: booking.customerName
                    },
                    {
                        key: 'email',
                        label: 'Email',
                        value: booking.email
                    },
                    {
                        key: 'phone',
                        label: 'Phone',
                        value: booking.phone
                    },
                    {
                        key: 'location',
                        label: 'Location',
                        value: 'EventX\nStockholm, Sweden'
                    },
                    {
                        key: 'instructions',
                        label: 'Instructions',
                        value: 'Please arrive 15 minutes before your scheduled time. Bring a valid ID and be ready for an amazing experience!'
                    },
                    {
                        key: 'terms',
                        label: 'Terms & Conditions',
                        value: 'This booking is non-refundable. Please contact us at least 24 hours in advance for any changes.'
                    }
                ]
            },

            // Barcode for easy check-in
            barcodes: [
                {
                    message: booking.id,
                    format: 'PKBarcodeFormatQR',
                    messageEncoding: 'iso-8859-1'
                }
            ],

            // Relevant dates
            relevantDate: bookingDate.toISOString(),
            expirationDate: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Expires 24h after booking

            // Location relevance
            locations: [
                {
                    latitude: 59.3293,  // Stockholm coordinates (replace with actual EventX location)
                    longitude: 18.0686,
                    relevantText: 'Welcome to EventX!'
                }
            ],

            // App association
            associatedStoreIdentifiers: [
                // Your iOS app ID (if you have one)
            ],

            // Web service authentication (for pass updates)
            webServiceURL: 'https://eventx.nu/passkit',
            authenticationToken: this.generateAuthToken(booking.id)
        };
    }

    // Generate authentication token for pass updates
    generateAuthToken(bookingId) {
        // In production, generate a secure token
        return btoa(`eventx-${bookingId}-${Date.now()}`);
    }

    // Format date for display
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    // Create pass file (simplified - in production you need proper signing)
    async createPassFile(passData) {
        try {
            // In a real implementation, you would:
            // 1. Create pass.json with the passData
            // 2. Add required images (icon.png, logo.png, etc.)
            // 3. Create manifest.json with file hashes
            // 4. Sign the manifest with your certificate
            // 5. Create a ZIP file with all components

            // For demo purposes, we'll create a simple JSON file
            // In production, use a backend service to properly sign the pass
            const passJson = JSON.stringify(passData, null, 2);

            // Create a mock .pkpass file (should be a proper ZIP in production)
            const encoder = new TextEncoder();
            return encoder.encode(passJson);

        } catch (error) {
            console.error('[Wallet] Failed to create pass file:', error);
            throw error;
        }
    }

    // Download pass file
    downloadPass(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Check if user can add passes to wallet
    canAddPassesToWallet() {
        return this.isSupported && 'PassKit' in window;
    }

    // Show add to wallet button for iOS users
    showAddToWalletButton(booking, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.isSupported) {
            const button = document.createElement('button');
            button.className = 'apple-wallet-btn';
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.5 2.5h15v15h-15z M4.5 4.5v11h11v-11z M6.5 6.5h7v1h-7z M6.5 8.5h7v1h-7z M6.5 10.5h7v1h-7z M6.5 12.5h5v1h-5z"/>
                </svg>
                Add to Apple Wallet
            `;

            button.onclick = async () => {
                try {
                    button.disabled = true;
                    button.textContent = 'Generating...';

                    await this.generateBookingPass(booking);

                    button.textContent = 'Added to Wallet';
                    setTimeout(() => {
                        button.disabled = false;
                        button.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.5 2.5h15v15h-15z M4.5 4.5v11h11v-11z M6.5 6.5h7v1h-7z M6.5 8.5h7v1h-7z M6.5 10.5h7v1h-7z M6.5 12.5h5v1h-5z"/>
                            </svg>
                            Add to Apple Wallet
                        `;
                    }, 3000);

                } catch (error) {
                    console.error('[Wallet] Add to wallet failed:', error);
                    button.disabled = false;
                    button.textContent = 'Try Again';
                }
            };

            container.appendChild(button);
        }
    }

    // Update pass (for booking changes)
    async updatePass(booking) {
        try {
            // In production, you would send an update notification to Apple's servers
            // This would trigger the wallet to fetch the updated pass
            console.log('[Wallet] Pass update requested for booking:', booking.id);

            // For now, generate a new pass
            return await this.generateBookingPass(booking);

        } catch (error) {
            console.error('[Wallet] Failed to update pass:', error);
            throw error;
        }
    }

    // Get pass information
    getPassInfo(booking) {
        return {
            passTypeId: this.passTypeId,
            serialNumber: `booking-${booking.id}`,
            isSupported: this.isSupported,
            canAdd: this.canAddPassesToWallet()
        };
    }

    // Setup CSS for Apple Wallet button
    setupWalletButtonStyles() {
        if (!document.getElementById('apple-wallet-styles')) {
            const style = document.createElement('style');
            style.id = 'apple-wallet-styles';
            style.textContent = `
                .apple-wallet-btn {
                    background: linear-gradient(135deg, #000 0%, #333 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 20px;
                    font-size: 14px;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .apple-wallet-btn:hover {
                    background: linear-gradient(135deg, #333 0%, #555 100%);
                    transform: translateY(-1px);
                }

                .apple-wallet-btn:active {
                    transform: translateY(0);
                }

                .apple-wallet-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .apple-wallet-btn svg {
                    flex-shrink: 0;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize Apple Wallet manager
window.appleWalletManager = new AppleWalletManager();

// Setup styles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.appleWalletManager.setupWalletButtonStyles();
    });
} else {
    window.appleWalletManager.setupWalletButtonStyles();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppleWalletManager;
}
