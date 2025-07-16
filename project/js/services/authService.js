// Authentication Service - Vanilla JavaScript Version
class AuthService {
    constructor() {
        this.TOKEN_KEY = 'haw_auth_token';
        this.USER_KEY = 'haw_current_user';
    }

    // JWT-ähnliche Token-Simulation für Demo-Zwecke
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 Stunden
        };
        return btoa(JSON.stringify(payload));
    }

    validateToken(token) {
        try {
            const payload = JSON.parse(atob(token));
            return payload.exp > Date.now();
        } catch {
            return false;
        }
    }

    async login(email, password) {
        try {
            // Simuliere Netzwerk-Delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const user = userDatabase.getUserByEmail(email);
            
            if (!user) {
                return { success: false, error: 'USER_NOT_FOUND' };
            }

            if (!user.isActive) {
                return { success: false, error: 'ACCOUNT_DISABLED' };
            }

            if (user.password !== password) {
                return { success: false, error: 'INVALID_PASSWORD' };
            }

            // Update last login
            userDatabase.updateUser(user.id, { lastLogin: new Date() });

            // Aktualisierte Benutzerdaten abrufen
            const updatedUser = userDatabase.getUserById(user.id) || user;

            // Generate token
            const token = this.generateToken(user);
            
            // Store in localStorage
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));

            return { success: true, user: updatedUser };
        } catch (error) {
            return { success: false, error: 'LOGIN_ERROR' };
        }
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    getCurrentUser() {
        try {
            const token = localStorage.getItem(this.TOKEN_KEY);
            const userStr = localStorage.getItem(this.USER_KEY);

            if (!token || !userStr || !this.validateToken(token)) {
                this.logout();
                return null;
            }

            const user = JSON.parse(userStr);
            // Aktuelle Daten aus der Datenbank laden
            const currentUser = userDatabase.getUserById(user.id);
            if (!currentUser) {
                this.logout();
                return null;
            }

            return JSON.parse(userStr);
        } catch {
            this.logout();
            return null;
        }
    }

    isAuthenticated() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        return token ? this.validateToken(token) : false;
    }

    async resetPassword(email) {
        try {
            // Simuliere Netzwerk-Delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const user = userDatabase.getUserByEmail(email);
            
            if (!user) {
                return { success: false, error: 'E-Mail-Adresse nicht gefunden' };
            }

            // In einer echten Anwendung würde hier eine E-Mail gesendet
            console.log(`Password reset email would be sent to ${email}`);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Fehler beim Zurücksetzen des Passworts' };
        }
    }

    async changePassword(currentPassword, newPassword) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                return { success: false, error: 'Nicht angemeldet' };
            }

            const dbUser = userDatabase.getUserById(user.id);
            if (!dbUser || dbUser.password !== currentPassword) {
                return { success: false, error: 'Aktuelles Passwort ist falsch' };
            }

            userDatabase.updateUser(user.id, { password: newPassword });
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Fehler beim Ändern des Passworts' };
        }
    }
}

// Global instance
const authService = new AuthService();