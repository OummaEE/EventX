# EventX Advanced PWA

A comprehensive Progressive Web App for escape room booking with advanced features including push notifications, Apple Pay integration, Apple Wallet tickets, and enhanced offline support.

## 🌟 Features

### Core PWA Features
- ✅ **Service Worker** with advanced caching strategies
- ✅ **Web App Manifest** with shortcuts and protocol handlers
- ✅ **Offline Support** - View bookings and tickets offline
- ✅ **Install Prompt** - Add to home screen functionality
- ✅ **Responsive Design** - Works on all devices

### Advanced Features
- 🔔 **Push Notifications** - Booking reminders (60, 30, 15 minutes before)
- 📱 **Apple Wallet Integration** - Add tickets to Apple Wallet
- 💳 **Apple Pay** - Quick and secure payments
- 🔄 **Background Sync** - Sync data when connection is restored
- 📊 **Real-time Countdown** - Live timers for upcoming bookings
- 🎯 **Smart Caching** - Different strategies for different content types

## 🚀 Quick Start

### 1. Setup Instructions

1. **Upload to GitHub Pages or Web Server**
   ```bash
   # Upload all files to your web server root directory
   # Or create a GitHub repository and enable GitHub Pages
   ```

2. **Configure Push Notifications**
   - Replace VAPID key in `/js/push-notifications.js`
   - Set up push notification server (see implementation guide)

3. **Setup Apple Pay**
   - Replace merchant ID in `/js/apple-pay.js`
   - Upload domain validation file to `/.well-known/`
   - Configure with Apple Developer account

4. **Add Icons**
   - Replace placeholder files in `/icons/` with actual icons
   - Use EventX branding and colors

### 2. Testing PWA Features

1. **Install as PWA**
   - Chrome: Look for install prompt or use Chrome DevTools
   - Safari iOS: "Add to Home Screen" option

2. **Test Offline**
   - Turn off internet connection
   - App should show cached bookings and work offline

3. **Test Notifications**
   - Enable notifications in app
   - Use "Test Notification" button
   - Book a service to get automatic reminders

## 📁 File Structure

```
/
├── index.html                 # Main application file
├── manifest.json             # PWA manifest with advanced features
├── service-worker.js         # Advanced service worker
├── offline.html              # Offline fallback page
├── css/
│   └── styles.css           # Comprehensive responsive styles
├── js/
│   ├── push-notifications.js # Web Push implementation
│   ├── apple-wallet.js      # Apple Wallet PassKit integration
│   ├── apple-pay.js         # Apple Pay Payment Request API
│   └── offline-manager.js   # Enhanced offline functionality
├── icons/
│   └── README.md           # Icon requirements and guidelines
└── .well-known/
    └── apple-developer-merchantid-domain-association
```

## 🔧 Configuration

### VAPID Keys (Push Notifications)
1. Generate VAPID keys: https://vapidkeys.com/
2. Replace public key in `/js/push-notifications.js`
3. Use private key in your push notification server

### Apple Pay Setup
1. Get Apple Developer account
2. Register merchant ID
3. Generate certificates
4. Update domain validation file
5. Replace merchant ID in code

### EmailJS (Optional)
1. Create EmailJS account
2. Setup email templates
3. Add service configuration to `/js/email-service.js`

## 📱 PWA Manifest Features

- **Display Mode**: Standalone (app-like experience)
- **Theme Colors**: Custom EventX branding
- **Shortcuts**: Quick access to booking, news, profile
- **Categories**: Business, entertainment
- **Icons**: Complete set including maskable icons
- **Start URL**: Supports deep linking

## 🔄 Service Worker Capabilities

### Caching Strategies
- **Network First**: Dynamic content (API calls, booking data)
- **Cache First**: Static assets (CSS, JS, images)
- **Stale While Revalidate**: Default strategy

### Background Features
- **Push Event Handling**: Show notifications
- **Background Sync**: Sync bookings when online
- **Periodic Sync**: Check for booking reminders
- **Update Management**: Handle app updates

## 🔔 Push Notification System

### Features
- **Booking Reminders**: Automatic notifications before bookings
- **Customizable Timing**: 60, 30, 15 minutes before
- **Action Buttons**: View booking, get directions
- **Offline Scheduling**: Works even when app is closed

### Implementation
```javascript
// Schedule booking reminder
pushManager.scheduleBookingReminder({
  service: 'QuestBox',
  date: '2024-12-20',
  time: '14:00',
  // ... other booking details
});
```

## 💳 Apple Pay Integration

### Features
- **Payment Request API**: Native Apple Pay interface
- **Security**: Tokenized payments
- **User Experience**: One-touch payments
- **Fallback**: Standard payment for non-Apple devices

### Requirements
- Apple Developer account
- Merchant certificate
- Domain validation
- Payment processor integration

## 📱 Apple Wallet Tickets

### Features
- **PassKit Integration**: Generate .pkpass files
- **Automatic Updates**: Update passes remotely
- **Location Awareness**: Show when near EventX
- **Barcode Support**: QR codes for check-in

### Pass Contents
- Event details (service, date, time)
- Customer information
- QR code for check-in
- EventX branding and colors

## 📊 Offline Functionality

### Cached Data
- User profile and authentication
- Booking history and upcoming events
- News articles and photo gallery
- App shell and essential assets

### Offline Features
- View cached bookings
- Display countdown timers
- Share booking information
- Access profile and statistics

## 🎨 Design System

### Colors
- Primary: #3b82f6 (EventX Blue)
- Secondary: #10b981 (Success Green)
- Warning: #f59e0b (Warning Orange)
- Error: #ef4444 (Error Red)

### Typography
- Font Family: Inter (Google Fonts)
- Responsive sizing
- Material Design principles

### Components
- Cards with shadows and borders
- Material Icons
- Consistent spacing and layouts
- Dark mode support

## 📈 Analytics and Performance

### Performance Features
- Lazy loading of content
- Optimized images and assets
- Efficient caching strategies
- Minimal JavaScript bundles

### Metrics to Track
- PWA installation rate
- Push notification engagement
- Apple Pay usage
- Offline usage patterns

## 🔒 Security Considerations

### Data Protection
- Client-side data encryption
- Secure localStorage usage
- HTTPS-only deployment
- Input validation and sanitization

### Payment Security
- Apple Pay tokenization
- No sensitive data storage
- Secure payment processor integration

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Replace VAPID keys with production keys
- [ ] Setup Apple Pay merchant account
- [ ] Generate and upload actual icons
- [ ] Configure EmailJS templates
- [ ] Test on multiple devices and browsers

### Production Setup
- [ ] Deploy to HTTPS server
- [ ] Configure push notification server
- [ ] Setup Apple Pay domain validation
- [ ] Monitor PWA metrics
- [ ] Setup error tracking

## 📞 Support and Resources

### PWA Resources
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)
- [PWA Builder](https://www.pwabuilder.com/)

### Apple Integration
- [Apple Pay Documentation](https://developer.apple.com/apple-pay/)
- [PassKit Documentation](https://developer.apple.com/documentation/passkit)
- [iOS Safari PWA Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

## 🤝 Contributing

This is a comprehensive PWA template that can be customized for different businesses. Key areas for enhancement:

- Real backend integration
- Advanced analytics
- More payment methods
- Enhanced accessibility
- Progressive loading
- Advanced animations

---

**EventX Advanced PWA** - Built with modern web technologies for the best mobile app experience.
