# 🚀 Deployment Guide - EventX PWA

## GitHub Pages Deployment

### Автоматическое развертывание:

1. **Включите GitHub Pages:**
   - Зайдите в Settings вашего репозитория
   - Прокрутите до раздела "Pages"
   - Source: "Deploy from a branch"
   - Branch: "main" / (root)
   - Нажмите "Save"

2. **Ваше приложение будет доступно по адресу:**
   ```
   https://ВАШ-USERNAME.github.io/eventx-escape-room-pwa
   ```

### Альтернативные платформы:

#### Netlify:
1. Перетащите папку проекта на netlify.com
2. Или подключите GitHub репозиторий
3. Build settings: оставьте пустыми
4. Publish directory: `/`

#### Vercel:
1. Импортируйте проект с GitHub
2. Framework Preset: "Other"
3. Build Command: оставьте пустым
4. Output Directory: `./`

### 📱 После развертывания:

1. **Проверьте HTTPS** - обязательно для PWA
2. **Протестируйте установку** на мобильном
3. **Настройте EmailJS** для отправки уведомлений
4. **Обновите контактные данные** в коде

### ⚙️ Настройки для продакшена:

1. **Замените demo данные** в `js/app-data.js`
2. **Настройте EmailJS** в `js/email-service.js`
3. **Обновите манифест** с правильным URL
4. **Добавьте Google Analytics** (опционально)

### 🔧 Локальная разработка:

```bash
# Запуск локального сервера
python -m http.server 8000
# или
npm start

# Откройте в браузере
http://localhost:8000
```

### 📈 Мониторинг:

- **Lighthouse audit** для PWA проверки
- **Google PageSpeed Insights** для производительности  
- **PWA Builder** от Microsoft для дополнительной оптимизации
