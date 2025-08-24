// Apple Pay Integration for EventX PWA
// Payment Request API with Apple Pay support

class ApplePayManager {
    constructor() {
        this.isSupported = this.checkSupport();
        this.merchantId = 'merchant.com.eventx.booking'; // Replace with your Apple Pay Merchant ID
        this.supportedNetworks = ['visa', 'mastercard', 'amex', 'discover'];
        this.supportedTypes = ['debit', 'credit'];
        this.countryCode = 'SE'; // Sweden
        this.currencyCode = 'SEK';

        console.log('[ApplePay] Apple Pay support:', this.isSupported);
        this.init();
    }

    checkSupport() {
        // Check for Payment Request API and Apple Pay
        if (!window.PaymentRequest) {
            return false;
        }

        // Check if Apple Pay is available
        try {
            const request = new PaymentRequest(
                [{ supportedMethods: 'https://apple.com/apple-pay' }],
                { total: { label: 'Test', amount: { currency: 'SEK', value: '0.01' } } }
            );
            return !!request.canMakePayment;
        } catch (error) {
            return false;
        }
    }

    async init() {
        if (this.isSupported) {
            // Check if Apple Pay is actually available on device
            try {
                const testRequest = this.createPaymentRequest({
                    service: 'Test',
                    amount: 0.01,
                    bookingId: 'test'
                });

                this.canMakePayment = await testRequest.canMakePayment();
                console.log('[ApplePay] Can make payment:', this.canMakePayment);
            } catch (error) {
                console.log('[ApplePay] Payment availability check failed:', error);
                this.canMakePayment = false;
            }
        }
    }

    // Create payment request for booking
    createPaymentRequest(bookingDetails) {
        const methodData = [{
            supportedMethods: 'https://apple.com/apple-pay',
            data: {
                version: 3,
                merchantIdentifier: this.merchantId,
                merchantCapabilities: ['supports3DS'],
                supportedNetworks: this.supportedNetworks,
                countryCode: this.countryCode,
                requiredBillingContactFields: ['postalAddress'],
                requiredShippingContactFields: ['name', 'phone', 'email']
            }
        }];

        const details = {
            total: {
                label: `EventX - ${bookingDetails.service}`,
                amount: {
                    currency: this.currencyCode,
                    value: bookingDetails.amount.toFixed(2)
                }
            },
            displayItems: [
                {
                    label: bookingDetails.service,
                    amount: {
                        currency: this.currencyCode,
                        value: bookingDetails.amount.toFixed(2)
                    }
                }
            ]
        };

        const options = {
            requestPayerName: true,
            requestPayerEmail: true,
            requestPayerPhone: true,
            requestShipping: false
        };

        return new PaymentRequest(methodData, details, options);
    }

    // Process payment for booking
    async processPayment(bookingDetails) {
        try {
            if (!this.isSupported || !this.canMakePayment) {
                throw new Error('Apple Pay not available');
            }

            const paymentRequest = this.createPaymentRequest(bookingDetails);

            // Show Apple Pay payment sheet
            const paymentResponse = await paymentRequest.show();

            // Process the payment
            const result = await this.handlePaymentResponse(paymentResponse, bookingDetails);

            if (result.success) {
                await paymentResponse.complete('success');
                return {
                    success: true,
                    transactionId: result.transactionId,
                    paymentMethod: 'Apple Pay'
                };
            } else {
                await paymentResponse.complete('fail');
                throw new Error(result.error || 'Payment failed');
            }

        } catch (error) {
            console.error('[ApplePay] Payment failed:', error);
            throw error;
        }
    }

    // Handle payment response (integrate with your payment processor)
    async handlePaymentResponse(paymentResponse, bookingDetails) {
        try {
            console.log('[ApplePay] Processing payment response:', paymentResponse);

            // Extract payment token
            const paymentToken = paymentResponse.details.paymentToken;

            // In production, send this to your payment processor (Stripe, Square, etc.)
            const paymentData = {
                token: paymentToken,
                amount: bookingDetails.amount,
                currency: this.currencyCode,
                bookingId: bookingDetails.bookingId,
                service: bookingDetails.service,
                customerInfo: {
                    name: paymentResponse.payerName,
                    email: paymentResponse.payerEmail,
                    phone: paymentResponse.payerPhone
                }
            };

            // Mock payment processing (replace with actual API call)
            const response = await this.processPaymentWithServer(paymentData);

            return response;

        } catch (error) {
            console.error('[ApplePay] Payment processing failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Process payment with your server (mock implementation)
    async processPaymentWithServer(paymentData) {
        try {
            // Replace this with actual API call to your payment processor
            console.log('[ApplePay] Would send payment data to server:', paymentData);

            /* Example with Stripe:
            const response = await fetch('/api/process-apple-pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            const result = await response.json();
            return result;
            */

            // Mock successful payment
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                success: true,
                transactionId: 'mock_' + Date.now(),
                message: 'Payment processed successfully'
            };

        } catch (error) {
            console.error('[ApplePay] Server processing failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Show Apple Pay button
    showApplePayButton(bookingDetails, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.isSupported && this.canMakePayment) {
            const button = document.createElement('button');
            button.className = 'apple-pay-btn';
            button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 4.5c-.8 0-1.5.3-2.1.8-.5.5-.8 1.2-.8 2.1 0 .1 0 .2.1.3 1.2-.1 2.3-.7 2.8-1.7.4-.6.6-1.3.6-2 0-.2 0-.3-.1-.5-.2.1-.3.1-.5 0zm2.8 2.8c-1.5-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.8-.4 7 1.1 9.3.8 1.1 1.7 2.4 2.9 2.4 1.2 0 1.6-.8 3-.8 1.4 0 1.7.8 3 .8 1.2 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.4-3.6 0-2.2 1.8-3.2 1.9-3.3-1.1-1.6-2.7-1.7-3.2-1.8z"/>
                </svg>
                Pay with Apple Pay
            `;

            button.onclick = async () => {
                try {
                    button.disabled = true;
                    button.textContent = 'Processing...';

                    const result = await this.processPayment(bookingDetails);

                    if (result.success) {
                        // Handle successful payment
                        this.onPaymentSuccess(result, bookingDetails);
                    }

                } catch (error) {
                    console.error('[ApplePay] Payment failed:', error);
                    this.onPaymentError(error);
                } finally {
                    button.disabled = false;
                    button.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.5 4.5c-.8 0-1.5.3-2.1.8-.5.5-.8 1.2-.8 2.1 0 .1 0 .2.1.3 1.2-.1 2.3-.7 2.8-1.7.4-.6.6-1.3.6-2 0-.2 0-.3-.1-.5-.2.1-.3.1-.5 0zm2.8 2.8c-1.5-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.8-.4 7 1.1 9.3.8 1.1 1.7 2.4 2.9 2.4 1.2 0 1.6-.8 3-.8 1.4 0 1.7.8 3 .8 1.2 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.4-3.6 0-2.2 1.8-3.2 1.9-3.3-1.1-1.6-2.7-1.7-3.2-1.8z"/>
                        </svg>
                        Pay with Apple Pay
                    `;
                }
            };

            container.appendChild(button);
        }
    }

    // Handle successful payment
    onPaymentSuccess(result, bookingDetails) {
        console.log('[ApplePay] Payment successful:', result);

        // Show success message
        this.showPaymentMessage('Payment successful! 🎉', 'success');

        // Trigger booking confirmation
        if (typeof window.onApplePaySuccess === 'function') {
            window.onApplePaySuccess(result, bookingDetails);
        }
    }

    // Handle payment error
    onPaymentError(error) {
        console.error('[ApplePay] Payment error:', error);

        let message = 'Payment failed. Please try again.';
        if (error.name === 'AbortError') {
            message = 'Payment cancelled.';
        } else if (error.message) {
            message = error.message;
        }

        this.showPaymentMessage(message, 'error');

        if (typeof window.onApplePayError === 'function') {
            window.onApplePayError(error);
        }
    }

    // Show payment message
    showPaymentMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `apple-pay-message apple-pay-message--${type}`;
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // Get payment capabilities
    getPaymentCapabilities() {
        return {
            isSupported: this.isSupported,
            canMakePayment: this.canMakePayment,
            merchantId: this.merchantId,
            supportedNetworks: this.supportedNetworks,
            currencyCode: this.currencyCode
        };
    }

    // Setup CSS for Apple Pay button and messages
    setupApplePayStyles() {
        if (!document.getElementById('apple-pay-styles')) {
            const style = document.createElement('style');
            style.id = 'apple-pay-styles';
            style.textContent = `
                .apple-pay-btn {
                    background: #000;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 16px 24px;
                    font-size: 16px;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    min-width: 200px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .apple-pay-btn:hover {
                    background: #333;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .apple-pay-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .apple-pay-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .apple-pay-btn svg {
                    flex-shrink: 0;
                }

                .apple-pay-message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                }

                .apple-pay-message--success {
                    background: #10b981;
                }

                .apple-pay-message--error {
                    background: #ef4444;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize Apple Pay manager
window.applePayManager = new ApplePayManager();

// Setup styles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.applePayManager.setupApplePayStyles();
    });
} else {
    window.applePayManager.setupApplePayStyles();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApplePayManager;
}
