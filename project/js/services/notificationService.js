// Notification Service - Vanilla JavaScript Version
class NotificationService {
    constructor() {
        this.notifications = [];
        this.nextId = 1;
        this.initializeSampleNotifications();
    }

    initializeSampleNotifications() {
        const sampleNotifications = [
            {
                userId: 'user_11', // Mitarbeiter
                type: 'success',
                title: 'Urlaubsantrag genehmigt',
                message: 'Ihr Urlaubsantrag für den 15.-19. Januar wurde genehmigt.',
                isRead: false,
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 Stunde her
                priority: 'high',
                applicationId: 'app_emp_1'
            },
            {
                userId: 'user_11', // Mitarbeiter
                type: 'info',
                title: 'Dienstreiseantrag eingegangen',
                message: 'Ihr Dienstreiseantrag nach München wurde erfolgreich eingereicht und wird bearbeitet.',
                isRead: false,
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 Stunden her
                priority: 'medium',
                applicationId: 'app_emp_2'
            },
            {
                userId: 'user_1',
                type: 'success',
                title: 'Antrag genehmigt',
                message: 'Ihr Antrag für einen neuen Studentenausweis wurde genehmigt.',
                isRead: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 Stunden her
                priority: 'high',
                applicationId: 'app_1'
            },
            {
                userId: 'user_1',
                type: 'info',
                title: 'Neue Nachricht',
                message: 'Sie haben eine neue Nachricht zu Ihrem Urlaubssemester-Antrag erhalten.',
                isRead: false,
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 Stunden her
                priority: 'medium',
                applicationId: 'app_2'
            },
            {
                userId: 'user_1',
                type: 'warning',
                title: 'Dokumente erforderlich',
                message: 'Für Ihren BAföG-Antrag werden zusätzliche Dokumente benötigt.',
                isRead: false,
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 Stunden her
                priority: 'high'
            },
            {
                userId: 'user_1',
                type: 'info',
                title: 'System-Update',
                message: 'Das Portal wurde erfolgreich aktualisiert. Neue Features sind verfügbar.',
                isRead: true,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 Tag her
                priority: 'low'
            },
            {
                userId: 'user_1',
                type: 'success',
                title: 'Willkommen!',
                message: 'Willkommen im HAW Landshut Antragsportal. Ihr Konto wurde erfolgreich eingerichtet.',
                isRead: true,
                createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 Tage her
                priority: 'medium'
            }
        ];

        this.notifications = sampleNotifications.map((notification, index) => ({
            id: `notification_${index + 1}`,
            ...notification
        }));

        this.nextId = this.notifications.length + 1;
        this.saveToLocalStorage();
        this.loadFromLocalStorage();
    }

    // Benachrichtigungen für einen Benutzer abrufen
    getNotifications(userId, limit) {
        let userNotifications = this.notifications
            .filter(notification => notification.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        if (limit) {
            userNotifications = userNotifications.slice(0, limit);
        }

        return userNotifications;
    }

    // Ungelesene Benachrichtigungen zählen
    getUnreadCount(userId) {
        return this.notifications.filter(
            notification => notification.userId === userId && !notification.isRead
        ).length;
    }

    // Benachrichtigung als gelesen markieren
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Alle Benachrichtigungen als gelesen markieren
    markAllAsRead(userId) {
        let markedCount = 0;
        this.notifications.forEach(notification => {
            if (notification.userId === userId && !notification.isRead) {
                notification.isRead = true;
                markedCount++;
            }
        });
        
        if (markedCount > 0) {
            this.saveToLocalStorage();
        }
        
        return markedCount;
    }

    // Benachrichtigung löschen
    deleteNotification(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            this.notifications.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Neue Benachrichtigung erstellen
    createNotification(notificationData) {
        const newNotification = {
            ...notificationData,
            id: `notification_${this.nextId++}`,
            createdAt: new Date()
        };

        this.notifications.push(newNotification);
        this.saveToLocalStorage();
        return newNotification;
    }

    // Benachrichtigung für Antragsstatusänderung erstellen
    createApplicationStatusNotification(userId, applicationTitle, newStatus, applicationId) {
        let type = 'info';
        let title = 'Status geändert';
        let message = `Der Status Ihres Antrags "${applicationTitle}" wurde geändert.`;

        switch (newStatus) {
            case 'approved':
                type = 'success';
                title = 'Antrag genehmigt';
                message = `Ihr Antrag "${applicationTitle}" wurde genehmigt.`;
                break;
            case 'rejected':
                type = 'error';
                title = 'Antrag abgelehnt';
                message = `Ihr Antrag "${applicationTitle}" wurde leider abgelehnt.`;
                break;
            case 'in_review':
                type = 'info';
                title = 'Antrag in Bearbeitung';
                message = `Ihr Antrag "${applicationTitle}" wird derzeit bearbeitet.`;
                break;
            case 'additional_info_required':
                type = 'warning';
                title = 'Zusätzliche Informationen erforderlich';
                message = `Für Ihren Antrag "${applicationTitle}" werden zusätzliche Informationen benötigt.`;
                break;
        }

        return this.createNotification({
            userId,
            type,
            title,
            message,
            isRead: false,
            priority: type === 'success' || type === 'error' ? 'high' : 'medium',
            applicationId
        });
    }

    // Benachrichtigung für neue Anträge erstellen
    createNewApplicationNotification(userId, applicationTitle, applicationType, applicationId) {
        return this.createNotification({
            userId,
            type: 'info',
            title: 'Antrag eingereicht',
            message: `Ihr ${applicationType}-Antrag "${applicationTitle}" wurde erfolgreich eingereicht und wird bearbeitet.`,
            isRead: false,
            priority: 'medium',
            applicationId
        });
    }

    // Zeitformatierung für Benachrichtigungen
    formatNotificationTime(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) {
            return 'Gerade eben';
        } else if (diffInMinutes < 60) {
            return `vor ${diffInMinutes} Minute${diffInMinutes !== 1 ? 'n' : ''}`;
        } else if (diffInMinutes < 1440) { // 24 Stunden
            const hours = Math.floor(diffInMinutes / 60);
            return `vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
        } else if (diffInMinutes < 10080) { // 7 Tage
            const days = Math.floor(diffInMinutes / 1440);
            return `vor ${days} Tag${days !== 1 ? 'en' : ''}`;
        } else {
            return date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }

    // Icon für Benachrichtigungstyp
    getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return 'check-circle';
            case 'error':
                return 'x-circle';
            case 'warning':
                return 'alert-circle';
            case 'info':
            default:
                return 'info';
        }
    }

    // Farbe für Benachrichtigungstyp
    getNotificationColor(type) {
        switch (type) {
            case 'success':
                return 'border-l-green-500';
            case 'error':
                return 'border-l-red-500';
            case 'warning':
                return 'border-l-yellow-500';
            case 'info':
            default:
                return 'border-l-blue-500';
        }
    }

    // Lokale Speicherung
    saveToLocalStorage() {
        try {
            localStorage.setItem('haw_notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Fehler beim Speichern der Benachrichtigungen:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('haw_notifications');
            if (stored && stored !== 'undefined') {
                const loadedNotifications = JSON.parse(stored);
                if (Array.isArray(loadedNotifications) && loadedNotifications.length > 0) {
                    this.notifications = loadedNotifications.map(n => ({
                        ...n,
                        createdAt: new Date(n.createdAt)
                    }));
                    this.nextId = Math.max(...this.notifications.map(n => 
                        parseInt(n.id.replace('notification_', ''))
                    )) + 1;
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der Benachrichtigungen:', error);
        }
    }
}

// Global instance
const notificationService = new NotificationService();