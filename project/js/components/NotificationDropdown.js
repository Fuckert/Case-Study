// Notification Dropdown Component - Vanilla JavaScript Version
class NotificationDropdown {
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.currentUser = authService.getCurrentUser();
        this.notifications = [];
    }

    render() {
        if (!this.container || !this.currentUser) return;

        this.loadNotifications();

        this.container.innerHTML = `
            <div class="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-80 z-50">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="font-semibold text-gray-900">Benachrichtigungen</h3>
                    <div class="flex items-center gap-2">
                        ${this.getUnreadCount() > 0 ? `
                            <button id="markAllRead" class="text-sm text-blue-600 hover:text-blue-700">
                                Alle als gelesen markieren
                            </button>
                        ` : ''}
                        <button id="closeDropdown" class="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                
                <div class="max-h-96 overflow-y-auto">
                    ${this.renderNotifications()}
                </div>
                
                ${this.notifications.length > 5 ? `
                    <div class="p-3 border-t border-gray-200 text-center">
                        <button class="text-sm text-blue-600 hover:text-blue-700">
                            Alle Benachrichtigungen anzeigen
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        this.setupEventListeners();
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadNotifications() {
        if (typeof notificationService !== 'undefined' && this.currentUser) {
            this.notifications = notificationService.getNotifications(this.currentUser.id, 10);
        }
    }

    renderNotifications() {
        if (this.notifications.length === 0) {
            return `
                <div class="p-8 text-center">
                    <i data-lucide="bell" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
                    <p class="text-gray-500">Keine Benachrichtigungen</p>
                </div>
            `;
        }

        return this.notifications.map(notification => `
            <div class="notification-item ${notification.isRead ? '' : 'unread'} notification-${notification.type}" data-id="${notification.id}">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 mt-1">
                        <i data-lucide="${this.getNotificationIcon(notification.type)}" class="w-4 h-4"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <p class="font-medium text-gray-900 text-sm">${notification.title}</p>
                            ${!notification.isRead ? `
                                <div class="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                            ` : ''}
                        </div>
                        <p class="text-gray-600 text-sm mt-1">${notification.message}</p>
                        <p class="text-gray-400 text-xs mt-2">${this.formatNotificationTime(notification.createdAt)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-circle',
            info: 'info'
        };
        return icons[type] || 'info';
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.isRead).length;
    }

    formatNotificationTime(date) {
        if (typeof notificationService !== 'undefined') {
            return notificationService.formatNotificationTime(date);
        }
        
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) {
            return 'Gerade eben';
        } else if (diffInMinutes < 60) {
            return `vor ${diffInMinutes} Minute${diffInMinutes !== 1 ? 'n' : ''}`;
        } else if (diffInMinutes < 1440) { // 24 Stunden
            const hours = Math.floor(diffInMinutes / 60);
            return `vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
        } else {
            return date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }

    setupEventListeners() {
        // Close dropdown
        const closeDropdown = document.getElementById('closeDropdown');
        if (closeDropdown) {
            closeDropdown.addEventListener('click', () => {
                if (this.options.onClose) {
                    this.options.onClose();
                }
            });
        }

        // Mark all as read
        const markAllRead = document.getElementById('markAllRead');
        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                if (typeof notificationService !== 'undefined' && this.currentUser) {
                    notificationService.markAllAsRead(this.currentUser.id);
                    this.render(); // Re-render to update UI
                    if (this.options.onClose) {
                        this.options.onClose();
                    }
                }
            });
        }

        // Notification click
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                const notificationId = item.dataset.id;
                const notification = this.notifications.find(n => n.id === notificationId);
                
                if (notification) {
                    // Mark as read
                    if (!notification.isRead && typeof notificationService !== 'undefined') {
                        notificationService.markAsRead(notificationId);
                    }
                    
                    if (this.options.onNotificationClick) {
                        this.options.onNotificationClick(notification);
                    }
                }
            });
        });
    }
}