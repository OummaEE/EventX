# 🎯 EventX Escape Room PWA

> Fullständig Progressive Web App för bokning av EventX escape room upplevelser

[![PWA](https://img.shields.io/badge/PWA-enabled-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ready-blue.svg)](#)

## 🚀 Live Demo

**🔗 Demo applikation:** [https://cfueyyby.gensparkspace.com/](https://cfueyyby.gensparkspace.com/)

## 📱 Funktioner

### 🎪 Huvudfunktioner:
- ✅ **Komplett bokningssystem** - QuestBox, QuestGames, QuestHouse
- ✅ **Användarregistrering** - säkert inloggsystem med localStorage
- ✅ **E-postmeddelanden** - automatiska bekräftelser till admin och kund
- ✅ **Personlig profil** - aktiva bokningar med nedräkning
- ✅ **Fotogalleri** - bilder från tidigare evenemang
- ✅ **Nyhetsflöde** - EventX nyheter och erbjudanden
- ✅ **Tvåspråkighet** - svenska och engelska
- ✅ **PWA-installation** - fungerar som native app

### 📱 Navigation (5 tabs):
- 🏠 **Hem** - tjänstebokning och information
- 📅 **Mina bokningar** - personlig översikt med nedräkning
- 📰 **Nyheter** - EventX nyheter och kampanjer
- 📸 **Mina foton** - galleri från evenemang
- 👤 **Profil** - användarinställningar

## ⚡ Installation & Användning

### 1. GitHub Repository:
```bash
git clone https://github.com/USERNAME/eventx-escape-room-pwa.git
cd eventx-escape-room-pwa
```

### 2. Lokal utveckling:
```bash
# Med Python
python -m http.server 8000

# Med Node.js
npm start

# Öppna: http://localhost:8000
```

### 3. GitHub Pages Deploy:
1. **Repository Settings** → **Pages**
2. **Source:** Deploy from branch: `main`
3. **Folder:** `/ (root)`
4. **Save**

## 📧 E-post konfiguration

### Snabbkonfiguration:
1. **Registrera på EmailJS** (gratis 200 e-post/månad)
2. **Skapa Email Service** (Gmail/Outlook)
3. **Uppdatera js/email-service.js:**

```javascript
// DINA EMAILJS INSTÄLLNINGAR:
const SERVICE_ID = 'din_service_id';
const ADMIN_TEMPLATE_ID = 'admin_template_id'; 
const PUBLIC_KEY = 'din_public_key';

// ADMIN E-POST (hit kommer bokningar):
const ADMIN_EMAIL = 'info@eventx.nu';
```

## 🧪 Testning

### Demo-användare (redan skapade):
- **E-post:** `anna@example.com` | **Lösenord:** `demo123`
- **E-post:** `erik@example.com` | **Lösenord:** `demo123`
- **E-post:** `sofia@example.com` | **Lösenord:** `demo123`

## 📱 PWA Installation

### Android:
1. Öppna i Chrome
2. Tryck "Lägg till på startskärmen" banner

### iOS:
1. Öppna i Safari
2. Dela-knappen → "Lägg till på hemskärmen"

## 📂 Projektstruktur

```
eventx-escape-room-pwa/
├── index.html                 # Huvudapplikation
├── manifest.json              # PWA manifest
├── service-worker.js          # Offline funktionalitet
├── js/
│   ├── user-system.js         # Användarsystem & autentisering
│   ├── email-service.js       # EmailJS integration
│   └── app-data.js           # Demo data (nyheter, foton)
├── icons/                     # PWA ikoner (alla storlekar)
├── .gitignore                # Git konfiguration
├── package.json              # Projekt metadata
└── README.md                 # Denna dokumentation
```

## 🤝 Support

- **EventX Webb:** [https://eventx.nu/](https://eventx.nu/)
- **E-post:** info@eventx.nu
- **Telefon:** 073 521 40 77

## 📄 Licens

MIT License - Fri att använda och modifiera för egna projekt.

---

**Utvecklad för EventX** 🎪  
*Vi skapar upplevelser som engagerar, utvecklar och förflyttar*

### Funktionalitet Overview:

✅ **Komplett bokningssystem** med e-postbekräftelser  
✅ **Användarsystem** med registrering och inloggning  
✅ **Personlig profil** med aktiva bokningar och nedräkning  
✅ **Fotogalleri** från tidigare evenemang  
✅ **Nyhetsflöde** med EventX uppdateringar  
✅ **PWA funktionalitet** - installeras som native app  
✅ **Offline support** - fungerar utan internetuppkoppling  
✅ **Responsive design** - alla enheter och skärmstorlekar  
✅ **Tvåspråkig** - svenska och engelska  
✅ **GitHub Pages ready** - redo för deploy  

**Detta är en komplett, produktionsklar applikation!** 🚀
