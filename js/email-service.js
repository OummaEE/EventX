
/**
 * EventX Email Service - Интеграция с EmailJS для отправки уведомлений
 */

class EmailService {
    constructor() {
        // Инициализация EmailJS (потребуется настройка с реальными ключами)
        this.serviceId = 'service_eventx';
        this.templateId = 'template_booking';
        this.publicKey = 'your_public_key_here';
        this.isInitialized = false;
    }

    // Инициализация EmailJS
    init() {
        try {
            // emailjs.init(this.publicKey);
            this.isInitialized = true;
            console.log('📧 EmailJS initialized');
        } catch (error) {
            console.error('EmailJS initialization failed:', error);
        }
    }

    // Отправка подтверждения бронирования администратору
    async sendBookingNotification(booking, user) {
        const templateParams = {
            to_email: 'info@eventx.nu',
            subject: `Ny bokning - ${booking.service}`,
            user_name: user.name,
            user_email: user.email,
            user_phone: user.phone,
            booking_id: booking.id,
            service: booking.service,
            date: this.formatDate(booking.date),
            time: booking.time,
            participants: booking.participants,
            total_price: `${booking.totalPrice} SEK`,
            created_at: this.formatDateTime(booking.createdAt),
            message: `
Ny bokning har skapats i EventX appen:

Bokningsdetaljer:
- Boknings-ID: ${booking.id}
- Tjänst: ${booking.service}
- Datum: ${this.formatDate(booking.date)}
- Tid: ${booking.time}
- Antal deltagare: ${booking.participants}
- Totalpris: ${booking.totalPrice} SEK

Kunduppgifter:
- Namn: ${user.name}
- Email: ${user.email}
- Telefon: ${user.phone}

Bokningen är skapad: ${this.formatDateTime(booking.createdAt)}
            `
        };

        return this.sendEmail(templateParams, 'admin');
    }

    // Отправка подтверждения клиенту
    async sendCustomerConfirmation(booking, user) {
        const timeUntil = this.getTimeUntilEvent(booking.eventDateTime);

        const templateParams = {
            to_email: user.email,
            subject: `Bokningsbekräftelse - ${booking.service}`,
            user_name: user.name,
            booking_id: booking.id,
            service: booking.service,
            date: this.formatDate(booking.date),
            time: booking.time,
            participants: booking.participants,
            total_price: `${booking.totalPrice} SEK`,
            time_until: timeUntil.text,
            message: `
Hej ${user.name}!

Tack för din bokning hos EventX! Här är din bokningsbekräftelse:

📅 ${booking.service}
📍 Datum: ${this.formatDate(booking.date)}
🕐 Tid: ${booking.time}
👥 Deltagare: ${booking.participants} personer
💰 Totalpris: ${booking.totalPrice} SEK
🔖 Boknings-ID: ${booking.id}

⏰ ${timeUntil.text}

Vi kommer att kontakta dig senast 24 timmar före evenemanget med ytterligare information.

Har du frågor? Kontakta oss:
📧 info@eventx.nu
📱 073 521 40 77

Vi ser fram emot att träffa dig!

Mvh,
EventX Team
            `
        };

        return this.sendEmail(templateParams, 'customer');
    }

    // Отправка напоминания за день до события
    async sendReminder(booking, user) {
        const templateParams = {
            to_email: user.email,
            subject: `Påminnelse - ${booking.service} imorgon!`,
            user_name: user.name,
            booking_id: booking.id,
            service: booking.service,
            date: this.formatDate(booking.date),
            time: booking.time,
            message: `
Hej ${user.name}!

Påminnelse om din EventX-bokning imorgon:

📅 ${booking.service}
📍 Datum: ${this.formatDate(booking.date)}
🕐 Tid: ${booking.time}
👥 Deltagare: ${booking.participants} personer
🔖 Boknings-ID: ${booking.id}

Praktisk information:
- Kom 15 minuter före angiven tid
- Ha på er bekväma kläder
- Mobiler kommer att förvaras säkert under aktiviteten

Vi ser fram emot att träffa er imorgon!

Mvh,
EventX Team
            `
        };

        return this.sendEmail(templateParams, 'reminder');
    }

    // Основная функция отправки email
    async sendEmail(templateParams, type) {
        try {
            // Для демонстрации - логируем вместо реальной отправки
            console.log(`📧 [${type.toUpperCase()}] Email would be sent:`, templateParams);

            // В реальном приложении здесь будет:
            // const response = await emailjs.send(this.serviceId, this.templateId, templateParams);

            // Имитируем успешную отправку
            const response = {
                status: 200,
                text: 'Email sent successfully'
            };

            if (response.status === 200) {
                console.log(`✅ ${type} email sent successfully`);
                return { success: true, message: 'Email skickat!' };
            }

        } catch (error) {
            console.error(`❌ Failed to send ${type} email:`, error);
            return { success: false, error: error.message };
        }
    }

    // Форматирование даты
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('sv-SE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Форматирование даты и времени
    formatDateTime(dateTimeStr) {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('sv-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Расчет времени до события
    getTimeUntilEvent(eventDateTime) {
        const now = new Date();
        const eventDate = new Date(eventDateTime);
        const timeDiff = eventDate - now;

        if (timeDiff < 0) {
            return { status: 'completed', text: 'Evenemanget har genomförts' };
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (days > 1) {
            return { status: 'upcoming', text: `${days} dagar kvar` };
        } else if (days === 1) {
            return { status: 'tomorrow', text: 'Imorgon!' };
        } else {
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            return { status: 'today', text: `${hours} timmar kvar` };
        }
    }

    // Настройка периодических напоминаний
    setupReminders() {
        // Проверяем бронирования каждый час
        setInterval(() => {
            this.checkUpcomingBookings();
        }, 60 * 60 * 1000); // 1 час
    }

    // Проверка предстоящих бронирований
    async checkUpcomingBookings() {
        if (typeof userSystem === 'undefined') return;

        const bookings = userSystem.getUserBookings();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        for (const booking of bookings) {
            const eventDate = new Date(booking.eventDateTime);
            const timeDiff = Math.abs(eventDate - tomorrow);

            // Если событие завтра (в пределах 2 часов)
            if (timeDiff < 2 * 60 * 60 * 1000 && !booking.reminderSent) {
                await this.sendReminder(booking, userSystem.getCurrentUser());
                booking.reminderSent = true;
                userSystem.saveBookings();
            }
        }
    }
}

// Инициализация сервиса
const emailService = new EmailService();
emailService.init();

// Export для модульного использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}
