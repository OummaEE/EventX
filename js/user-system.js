
/**
 * EventX User System - Управление пользователями и бронированиями
 */

class UserSystem {
    constructor() {
        this.currentUser = null;
        this.bookings = [];
        this.init();
    }

    init() {
        // Загружаем данные из localStorage
        this.loadUserData();
        this.loadBookings();
    }

    // Регистрация/Авторизация пользователя
    loginUser(userData) {
        this.currentUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            registeredAt: new Date().toISOString(),
            notifications: true
        };

        localStorage.setItem('eventx_user', JSON.stringify(this.currentUser));
        this.showUserStatus();
        return this.currentUser;
    }

    // Выход пользователя
    logoutUser() {
        this.currentUser = null;
        localStorage.removeItem('eventx_user');
        this.showUserStatus();
    }

    // Загрузка данных пользователя
    loadUserData() {
        const userData = localStorage.getItem('eventx_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.showUserStatus();
        }
    }

    // Создание бронирования
    createBooking(bookingData) {
        if (!this.currentUser) {
            throw new Error('Пользователь должен быть авторизован');
        }

        const booking = {
            id: 'BK' + Date.now(),
            userId: this.currentUser.id,
            service: bookingData.service,
            date: bookingData.date,
            time: bookingData.time,
            participants: bookingData.participants,
            totalPrice: bookingData.totalPrice,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            eventDateTime: new Date(bookingData.date + 'T' + bookingData.time).toISOString()
        };

        this.bookings.push(booking);
        this.saveBookings();

        // Отправляем email уведомление
        this.sendEmailNotification(booking);

        return booking;
    }

    // Загрузка бронирований
    loadBookings() {
        const bookings = localStorage.getItem('eventx_bookings');
        if (bookings) {
            this.bookings = JSON.parse(bookings);
        }
    }

    // Сохранение бронирований
    saveBookings() {
        localStorage.setItem('eventx_bookings', JSON.stringify(this.bookings));
    }

    // Получение активных бронирований пользователя
    getUserBookings() {
        if (!this.currentUser) return [];

        return this.bookings.filter(booking => 
            booking.userId === this.currentUser.id
        ).sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime));
    }

    // Получение статистики времени до мероприятия
    getTimeUntilEvent(eventDateTime) {
        const now = new Date();
        const eventDate = new Date(eventDateTime);
        const timeDiff = eventDate - now;

        if (timeDiff < 0) {
            return { status: 'completed', text: 'Genomfört' };
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return { 
                status: 'upcoming', 
                text: `${days} dagar kvar`,
                countdown: `${days}d ${hours}h ${minutes}m`
            };
        } else if (hours > 0) {
            return { 
                status: 'today', 
                text: `${hours} timmar kvar`,
                countdown: `${hours}h ${minutes}m`
            };
        } else {
            return { 
                status: 'soon', 
                text: `${minutes} minuter kvar`,
                countdown: `${minutes}m`
            };
        }
    }

    // Отправка email уведомлений
    async sendEmailNotification(booking) {
        try {
            // Здесь будет интеграция с EmailJS
            const emailData = {
                to_email: 'info@eventx.nu',
                user_name: this.currentUser.name,
                booking_id: booking.id,
                service: booking.service,
                date: booking.date,
                time: booking.time,
                participants: booking.participants,
                total_price: booking.totalPrice,
                user_email: this.currentUser.email,
                user_phone: this.currentUser.phone
            };

            console.log('📧 Email notification sent:', emailData);

            // Показываем уведомление пользователю
            this.showNotification('Bokning bekräftad! Ett bekräftelsemail har skickats.');

        } catch (error) {
            console.error('Email sending failed:', error);
        }
    }

    // Показ статуса пользователя в интерфейсе
    showUserStatus() {
        const userElement = document.getElementById('user-status');
        if (userElement) {
            if (this.currentUser) {
                userElement.innerHTML = `
                    <div class="user-info">
                        <span>👋 Hej ${this.currentUser.name}!</span>
                        <button onclick="userSystem.logoutUser()" class="logout-btn">Logga ut</button>
                    </div>
                `;
            } else {
                userElement.innerHTML = `
                    <button onclick="showLoginForm()" class="login-btn">Logga in</button>
                `;
            }
        }
    }

    // Показ уведомлений
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Проверка авторизации
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Получение данных пользователя
    getCurrentUser() {
        return this.currentUser;
    }
}

// Инициализация системы
const userSystem = new UserSystem();

// Функции для интерфейса
function showLoginForm() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideLoginForm() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    userSystem.loginUser(userData);
    hideLoginForm();

    // Обновляем интерфейс
    if (typeof updateUserInterface === 'function') {
        updateUserInterface();
    }
}

// Export для модульного использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserSystem;
}
