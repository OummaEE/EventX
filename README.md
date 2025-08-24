# 🎯 EventX Escape Room PWA

> Progressive Web App для бронирования escape room услуг от EventX

[![PWA](https://img.shields.io/badge/PWA-enabled-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-blue.svg)](https://username.github.io/eventx-escape-room-pwa)

## 🚀 Live Demo

**🔗 Попробуйте приложение:** https://username.github.io/eventx-escape-room-pwa

## 📱 Возможности

### 🎪 Основные функции:
- ✅ **Система бронирования** - QuestBox, QuestGames, QuestHouse
- ✅ **Двуязычность** - шведский и английский
- ✅ **PWA установка** - работает как нативное приложение
- ✅ **Offline режим** - функциональность без интернета

### 👤 Пользовательский кабинет:
- ✅ **Регистрация/авторизация** пользователей
- ✅ **Активные бронирования** с обратным отсчетом
- ✅ **История посещений** с фотографиями
- ✅ **Email уведомления** администратору и клиенту

### 📱 Интерфейс:
- ✅ **Bottom Navigation** - 5 основных разделов
- ✅ **Material Design** - нативный вид приложения
- ✅ **Адаптивный дизайн** - все устройства
- ✅ **Push уведомления** - напоминания и новости

## 🛠️ Технологии

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **PWA:** Service Worker, Web App Manifest
- **Email:** EmailJS для уведомлений
- **Storage:** LocalStorage для данных пользователей
- **Icons:** Material Design Icons
- **Hosting:** GitHub Pages ready

## ⚡ Быстрый старт

### 1. Клонирование:
```bash
git clone https://github.com/USERNAME/eventx-escape-room-pwa.git
cd eventx-escape-room-pwa
```

### 2. Локальный запуск:
```bash
# Python
python -m http.server 8000

# Node.js (если установлен)
npm start

# Откройте: http://localhost:8000
```

### 3. GitHub Pages:
1. Settings → Pages → Deploy from branch: main
2. Приложение будет доступно: `https://USERNAME.github.io/eventx-escape-room-pwa`

## 📧 Настройка Email

1. **Зарегистрируйтесь на [EmailJS](https://www.emailjs.com/)**
2. **Следуйте инструкции:** [EMAIL_SETUP.md](EMAIL_SETUP.md)
3. **Обновите настройки в:** `js/email-service.js`

## 🧪 Тестирование

### Demo пользователи:
- **Email:** `anna@example.com` | **Password:** `demo123`
- **Email:** `erik@example.com` | **Password:** `demo123`  
- **Email:** `sofia@example.com` | **Password:** `demo123`

**Подробнее:** [DEMO_USERS.md](DEMO_USERS.md)

## 📱 Установка PWA

### Android:
1. Откройте в Chrome
2. Нажмите "Добавить на главный экран"

### iOS:
1. Откройте в Safari  
2. Поделиться → "На экран 'Домой'"

### Desktop:
1. Иконка установки в адресной строке
2. Или кнопка "Installera appen" в приложении

## 📂 Структура проекта

```
eventx-escape-room-pwa/
├── index.html              # Главная страница приложения
├── manifest.json           # PWA манифест
├── service-worker.js       # Service Worker для offline
├── js/
│   ├── user-system.js      # Система пользователей
│   ├── email-service.js    # EmailJS интеграция
│   └── app-data.js         # Демо данные
├── icons/                  # Иконки PWA (все размеры)
├── README.md              # Эта документация
├── EMAIL_SETUP.md         # Настройка email
├── DEMO_USERS.md          # Тестовые пользователи
└── DEPLOYMENT.md          # Инструкция по развертыванию
```

## 🔧 Кастомизация

### Брендинг:
- **Логотип:** замените в `icons/`
- **Цвета:** обновите CSS переменные
- **Контакты:** измените в `js/app-data.js`

### Услуги:
- **Добавьте новые:** в массиве services
- **Цены:** обновите в данных услуг
- **Описания:** переведите на нужные языки

## 📈 Мониторинг

- 🔍 **Lighthouse audit** - PWA проверка
- 📊 **Google Analytics** - аналитика использования
- 📧 **EmailJS dashboard** - статистика уведомлений

## 🤝 Контакты

- **EventX:** https://eventx.nu/
- **Email:** info@eventx.nu
- **Телефон:** 073 521 40 77

## 📄 Лицензия

MIT License - можете использовать и модифицировать для своих проектов.

---

**Создано для EventX** 🎪 *Vi skapar upplevelser som engagerar, utvecklar och förflyttar*
