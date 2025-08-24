# 📧 Email Setup Guide - EventX PWA

## Настройка EmailJS для отправки уведомлений

### 1. Регистрация в EmailJS:

1. Зайдите на https://www.emailjs.com/
2. Нажмите "Sign Up" и создайте аккаунт
3. **Бесплатный план:** до 200 писем в месяц

### 2. Настройка Email Service:

1. В панели EmailJS нажмите "Add New Service"
2. Выберите ваш email провайдер:
   - **Gmail** (рекомендуется)
   - **Outlook/Hotmail**  
   - **Yahoo**
   - Или другой SMTP

3. **Для Gmail:**
   - Включите 2-step verification
   - Создайте App Password в настройках Google
   - Используйте App Password в EmailJS

4. Скопируйте **Service ID** (например: `service_gmail_123`)

### 3. Создание Email Template:

#### Шаблон для администратора:
```html
Тема: Новая регистрация EventX - {{service_name}}

Получена новая регистрация:

👤 КЛИЕНТ:
Имя: {{user_name}}
Email: {{user_email}}  
Телефон: {{user_phone}}

📅 БРОНИРОВАНИЕ:
Услуга: {{service_name}}
Дата: {{booking_date}}
Время: {{booking_time}}
Участники: {{participants}} чел.

💬 СООБЩЕНИЕ:
{{message}}

---
Отправлено через EventX PWA
{{current_date}}
```

#### Шаблон подтверждения клиенту:
```html
Тема: Bekräftelse av bokning - EventX {{service_name}}

Hej {{user_name}}!

Tack för din bokning hos EventX! 🎉

📅 DINA UPPGIFTER:
Aktivitet: {{service_name}}
Datum: {{booking_date}}
Tid: {{booking_time}}
Antal deltagare: {{participants}}

📍 PLATS:
EventX kommer till er eller träffas på överenskommen plats

📞 KONTAKT:
Telefon: 073 521 40 77
Email: info@eventx.nu

Vi ser fram emot att skapa en fantastisk upplevelse för er!

Med vänliga hälsningar,
EventX Team
```

### 4. Получение API ключей:

1. **Service ID:** найдите в разделе "Email Services"
2. **Template ID:** найдите в разделе "Email Templates"  
3. **Public Key:** в "Account" → "API Keys"

### 5. Обновление кода:

В файле `js/email-service.js` замените:

```javascript
// ВАШИ ДАННЫЕ EMAILJS:
const SERVICE_ID = 'service_gmail_123';        // ваш Service ID
const ADMIN_TEMPLATE_ID = 'template_admin_456'; // шаблон для админа
const USER_TEMPLATE_ID = 'template_user_789';   // шаблон для клиента
const PUBLIC_KEY = 'user_ABC123DEF456';         // ваш Public Key

// ПОЧТА АДМИНИСТРАТОРА:
const ADMIN_EMAIL = 'info@eventx.nu';           // ваша почта для заявок
```

### 6. Тестирование:

1. Сделайте тестовое бронирование в приложении
2. Проверьте почту администратора
3. Проверьте подтверждение клиенту
4. Проверьте консоль браузера на ошибки

### 7. Возможные проблемы:

#### "403 Forbidden":
- Проверьте Public Key
- Убедитесь что домен добавлен в настройки EmailJS

#### "Template not found":  
- Проверьте Template ID
- Убедитесь что шаблон активен

#### Письма не приходят:
- Проверьте папку "Спам"
- Убедитесь в правильности email адресов
- Проверьте лимиты EmailJS (200 писем/месяц бесплатно)

### 8. Дополнительные настройки:

#### Автоответчик:
- Настройте автоматические напоминания
- Добавьте календарь в письма
- Интегрируйте с Google Calendar

#### Аналитика:
- Отслеживайте открытия писем
- Анализируйте популярные услуги
- Ведите статистику бронирований

### 💡 Советы:
- Используйте профессиональный email (не gmail.com)
- Добавьте логотип EventX в шаблоны
- Тестируйте на разных устройствах
- Сохраняйте бэкап настроек EmailJS
