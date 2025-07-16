// Main Application - Vanilla JavaScript Version
class HAWPortalApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.selectedRole = 'Student';
        this.refreshTrigger = 0;
        
        this.init();
    }

    init() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Check if user is already logged in
        this.currentUser = authService.getCurrentUser();
        
        if (this.currentUser) {
            this.showMainApp();
        } else {
            this.showLoginScreen();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Role selection buttons
        const studentRole = document.getElementById('studentRole');
        const employeeRole = document.getElementById('employeeRole');
        
        if (studentRole) {
            studentRole.addEventListener('click', () => this.selectRole('Student'));
        }
        if (employeeRole) {
            employeeRole.addEventListener('click', () => this.selectRole('Mitarbeiter'));
        }

        // Header buttons
        const helpButton = document.getElementById('helpButton');
        const logoutButton = document.getElementById('logoutButton');
        const profileButton = document.getElementById('profileButton');
        const notificationButton = document.getElementById('notificationButton');

        if (helpButton) {
            helpButton.addEventListener('click', () => this.showHelpModal());
        }
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.logout());
        }
        if (profileButton) {
            profileButton.addEventListener('click', () => this.setCurrentView('settings'));
        }
        if (notificationButton) {
            notificationButton.addEventListener('click', () => this.toggleNotifications());
        }

        // Modal close buttons
        const closeHelpModal = document.getElementById('closeHelpModal');
        const closePasswordResetModal = document.getElementById('closePasswordResetModal');
        
        if (closeHelpModal) {
            closeHelpModal.addEventListener('click', () => this.hideHelpModal());
        }
        if (closePasswordResetModal) {
            closePasswordResetModal.addEventListener('click', () => this.hidePasswordResetModal());
        }

        // Password reset
        const forgotPasswordButton = document.getElementById('forgotPasswordButton');
        const backToLogin = document.getElementById('backToLogin');
        const passwordResetForm = document.getElementById('passwordResetForm');

        if (forgotPasswordButton) {
            forgotPasswordButton.addEventListener('click', () => this.showPasswordResetModal());
        }
        if (backToLogin) {
            backToLogin.addEventListener('click', () => this.hidePasswordResetModal());
        }
        if (passwordResetForm) {
            passwordResetForm.addEventListener('submit', (e) => this.handlePasswordReset(e));
        }

        // Help functionality
        this.setupHelpFunctionality();

        // Close modals on outside click
        this.setupModalOutsideClick();
    }

    setupHelpFunctionality() {
        const helpSearch = document.getElementById('helpSearch');
        const helpCategories = document.getElementById('helpCategories');

        if (helpSearch) {
            helpSearch.addEventListener('input', (e) => this.filterHelpContent(e.target.value));
        }

        if (helpCategories) {
            helpCategories.addEventListener('click', (e) => {
                if (e.target.classList.contains('help-category-btn')) {
                    this.setHelpCategory(e.target.dataset.category);
                }
            });
        }
    }

    setupModalOutsideClick() {
        const modals = ['helpModal', 'passwordResetModal', 'applicationFormModal', 'applicationDetailModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideModal(modalId);
                    }
                });
            }
        });
    }

    selectRole(role) {
        this.selectedRole = role;
        
        // Update UI
        const studentBtn = document.getElementById('studentRole');
        const employeeBtn = document.getElementById('employeeRole');
        const emailInput = document.getElementById('email');
        
        if (studentBtn && employeeBtn) {
            studentBtn.classList.toggle('active', role === 'Student');
            employeeBtn.classList.toggle('active', role === 'Mitarbeiter');
        }
        
        if (emailInput) {
            emailInput.placeholder = role === 'Student' 
                ? 's-maxmustermann@haw-landshut.de' 
                : 'm-martinschneider@haw-landshut.de';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        this.showLoading(true);
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const { success, user, error } = await authService.login(email, password);
            
            if (success && user) {
                this.currentUser = {
                    ...user,
                    email: user.email,
                    fullName: user.fullName,
                    department: user.department,
                    role: user.role,
                    phone: user.phone,
                    address: user.address,
                    name: user.fullName
                };
                this.showMessage('Erfolgreich angemeldet!');
                this.showMainApp();
            } else {
                // Übersetze Fehlercodes
                let errorMessage = 'Anmeldefehler';
                switch (error) {
                    case 'USER_NOT_FOUND':
                        errorMessage = 'Benutzer nicht gefunden';
                        break;
                    case 'INVALID_PASSWORD':
                        errorMessage = 'Ungültiges Passwort';
                        break;
                    case 'ACCOUNT_DISABLED':
                        errorMessage = 'Benutzerkonto ist deaktiviert';
                        break;
                    default:
                        errorMessage = 'Anmeldefehler';
                }
                this.showMessage(errorMessage, 'error');
            }
        } catch (error) {
            this.showMessage('Anmeldefehler', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handlePasswordReset(e) {
        e.preventDefault();
        this.showLoading(true);
        
        const formData = new FormData(e.target);
        const email = formData.get('resetEmail') || document.getElementById('resetEmail').value;
        const newPassword = formData.get('newPassword') || document.getElementById('newPassword').value;
        const confirmPassword = formData.get('confirmPassword') || document.getElementById('confirmPassword').value;

        if (!email || !email.trim()) {
            this.showMessage('E-Mail-Adresse ist erforderlich', 'error');
            this.showLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showMessage('Passwörter stimmen nicht überein', 'error');
            this.showLoading(false);
            return;
        }

        this.showMessage('Passwort erfolgreich zurückgesetzt!');
        this.hidePasswordResetModal();
        this.showLoading(false);
    }

    logout() {
        authService.logout();
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.showMessage('Erfolgreich abgemeldet!');
        this.showLoginScreen();
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        
        // Reset form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        
        // Set default role
        this.selectRole('Student');
    }

    showMainApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        // Update user info
        const userName = document.getElementById('userName');
        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.fullName;
        }
        
        // Setup navigation
        this.setupNavigation();
        
        // Load dashboard
        this.setCurrentView('dashboard');
        
        // Update notifications
        this.updateNotificationCount();
        
        // Initialize notification service
        if (typeof notificationService !== 'undefined') {
            setInterval(() => this.updateNotificationCount(), 30000);
        }
    }

    setupNavigation() {
        const navigation = document.getElementById('navigation');
        if (!navigation || !this.currentUser) return;

        const navItems = [
            { id: 'dashboard', icon: 'file-text', label: 'Dashboard' },
            { id: 'newApplication', icon: 'plus', label: 'Neuen Antrag stellen' },
            { id: 'applications', icon: 'file-text', label: 'Meine Anträge' },
            { id: 'settings', icon: 'settings', label: 'Einstellungen' }
        ];

        navigation.innerHTML = navItems.map(item => `
            <button class="nav-item w-full" data-view="${item.id}">
                <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                <span class="font-medium">${item.label}</span>
            </button>
        `).join('');

        // Add event listeners
        navigation.addEventListener('click', (e) => {
            const button = e.target.closest('.nav-item');
            if (button) {
                this.setCurrentView(button.dataset.view);
            }
        });

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setCurrentView(view) {
        this.currentView = view;
        
        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });
        
        // Load view content
        this.loadViewContent(view);
    }

    loadViewContent(view) {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        switch (view) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'newApplication':
                this.loadNewApplication();
                break;
            case 'applications':
                this.loadApplications();
                break;
            case 'settings':
                this.loadSettings();
                break;
            default:
                this.loadDashboard();
        }
    }

    loadDashboard() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent || !this.currentUser) return;

        if (this.currentUser.role === 'Mitarbeiter') {
            // Load employee dashboard
            if (typeof EmployeeApplicationDashboard !== 'undefined') {
                const dashboard = new EmployeeApplicationDashboard(mainContent, {
                    onNewApplication: () => this.setCurrentView('newApplication'),
                    onViewApplications: () => this.setCurrentView('applications'),
                    onViewApplication: (app) => this.showApplicationDetail(app),
                    onEditApplication: (app) => this.editApplication(app)
                });
                dashboard.render();
            }
        } else {
            // Load student dashboard
            if (typeof Dashboard !== 'undefined') {
                const dashboard = new Dashboard(mainContent, {
                    onNewApplication: () => this.setCurrentView('newApplication'),
                    onViewApplications: () => this.setCurrentView('applications'),
                    onViewApplication: (app) => this.showApplicationDetail(app)
                });
                dashboard.render();
            }
        }
    }

    loadNewApplication() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent || !this.currentUser) return;

        const isEmployee = this.currentUser.role === 'Mitarbeiter';
        const templates = isEmployee ? employeeApplicationTemplates : applicationTemplates.filter(t => t.category === 'student');

        mainContent.innerHTML = `
            <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-8">
                    ${isEmployee ? 'Neuen Mitarbeiter-Antrag stellen' : 'Neuen Studenten-Antrag stellen'}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${templates.map(template => `
                        <div class="application-card" data-type="${template.type}">
                            <div class="icon bg-gradient-to-br from-${template.color}-600 to-${template.color}-700">
                                ${template.icon}
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-2">${template.title}</h3>
                            <p class="text-gray-600 mb-4">${template.description}</p>
                            <div class="flex justify-between items-center">
                                <span class="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                                    ${template.estimatedProcessingTime}
                                </span>
                                <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listeners
        mainContent.addEventListener('click', (e) => {
            const card = e.target.closest('.application-card');
            if (card) {
                const template = templates.find(t => t.type === card.dataset.type);
                if (template) {
                    this.showApplicationForm(template);
                }
            }
        });

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadApplications() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        if (typeof ApplicationList !== 'undefined') {
            const applicationList = new ApplicationList(mainContent, {
                onViewApplication: (app) => this.showApplicationDetail(app),
                onEditApplication: (app) => this.editApplication(app),
                refreshTrigger: this.refreshTrigger
            });
            applicationList.render();
        }
    }

    loadSettings() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent || !this.currentUser) return;

        mainContent.innerHTML = `
            <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-8">Profil-Einstellungen</h2>
                <div class="bg-white rounded-2xl shadow-sm p-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-6">Profil-Einstellungen</h3>
                    <form id="settingsForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input type="text" name="fullName" value="${this.currentUser.fullName || ''}" class="form-input">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">E-Mail-Adresse</label>
                                <input type="email" name="email" value="${this.currentUser.email || ''}" class="form-input">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Telefonnummer</label>
                                <input type="tel" name="phone" value="${this.currentUser.phone || ''}" placeholder="+49 871 123456" class="form-input">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Abteilung</label>
                                <input type="text" value="${this.currentUser.department || ''}" disabled class="form-input bg-gray-50 text-gray-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                            <textarea name="address" placeholder="Straße, PLZ Ort" rows="3" class="form-input">${this.currentUser.address || ''}</textarea>
                        </div>
                        ${this.currentUser.role === 'Student' && this.currentUser.semester ? `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                                    <input type="text" value="${this.currentUser.semester}. Semester" disabled class="form-input bg-gray-50 text-gray-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Rolle</label>
                                    <input type="text" value="${this.currentUser.role}" disabled class="form-input bg-gray-50 text-gray-500">
                                </div>
                            </div>
                        ` : ''}
                        <div class="flex justify-end">
                            <button type="submit" class="btn btn-primary">
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add form submit handler
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSaveSettings(e));
        }
    }

    handleSaveSettings(e) {
        e.preventDefault();
        
        if (!this.currentUser) {
            this.showMessage('Nicht angemeldet', 'error');
            return;
        }
        
        const formData = new FormData(e.target);
        const updates = {
            fullName: formData.get('fullName'),
            name: formData.get('fullName'), // Für Kompatibilität
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
        };

        const success = userDatabase.updateUser(this.currentUser.id, updates);
        if (success) {
            const updatedUser = { ...this.currentUser, ...updates };
            this.currentUser = updatedUser;
            
            // Auch im localStorage aktualisieren
            localStorage.setItem('haw_current_user', JSON.stringify(updatedUser));
            
            // Update UI
            const userName = document.getElementById('userName');
            if (userName) {
                userName.textContent = updatedUser.fullName;
            }
            
            this.showMessage('Einstellungen erfolgreich gespeichert!');
        } else {
            this.showMessage('Fehler beim Speichern der Einstellungen', 'error');
        }
    }

    showApplicationForm(template, existingApplication = null) {
        if (typeof ApplicationForm !== 'undefined') {
            const modal = document.getElementById('applicationFormModal');
            if (modal) {
                const applicationForm = new ApplicationForm(modal, {
                    template,
                    existingApplication,
                    onClose: () => this.hideModal('applicationFormModal'),
                    onSubmit: (application) => {
                        this.hideModal('applicationFormModal');
                        this.refreshTrigger++;
                        this.showMessage('Antrag erfolgreich eingereicht!');
                        
                        // Zurück zur Antragsübersicht nach erfolgreichem Einreichen
                        setTimeout(() => {
                            this.setCurrentView('applications');
                        }, 1000);
                    }
                });
                applicationForm.render();
                modal.classList.remove('hidden');
            }
        }
    }

    editApplication(application) {
        const isEmployee = this.currentUser?.role === 'Mitarbeiter';
        const templates = isEmployee ? employeeApplicationTemplates : applicationTemplates;
        const template = templates.find(t => t.type === application.type);
        
        if (template) {
            this.showApplicationForm(template, application);
        }
    }

    showApplicationDetail(application) {
        if (typeof ApplicationDetail !== 'undefined') {
            const modal = document.getElementById('applicationDetailModal');
            if (modal) {
                const applicationDetail = new ApplicationDetail(modal, {
                    application,
                    onClose: () => this.hideModal('applicationDetailModal'),
                    onEdit: (app) => {
                        this.hideModal('applicationDetailModal');
                        this.editApplication(app);
                    },
                    onUpdate: () => {
                        this.refreshTrigger++;
                    }
                });
                applicationDetail.render();
                modal.classList.remove('hidden');
            }
        }
    }

    showHelpModal() {
        const modal = document.getElementById('helpModal');
        if (modal) {
            modal.classList.remove('hidden');
            this.loadHelpContent();
        }
    }

    hideHelpModal() {
        this.hideModal('helpModal');
    }

    showPasswordResetModal() {
        const modal = document.getElementById('passwordResetModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hidePasswordResetModal() {
        this.hideModal('passwordResetModal');
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    loadHelpContent() {
        const helpContent = document.getElementById('helpContent');
        if (!helpContent) return;

        const helpItems = [
            {
                category: 'general',
                question: 'Wie melde ich mich im Portal an?',
                answer: 'Verwenden Sie Ihre HAW-E-Mail-Adresse und Ihr Passwort. Wählen Sie zunächst Ihre Rolle (Student oder Mitarbeiter) aus.'
            },
            {
                category: 'general',
                question: 'Was mache ich, wenn ich mein Passwort vergessen habe?',
                answer: 'Klicken Sie auf "Passwort vergessen?" und folgen Sie den Anweisungen.'
            },
            {
                category: 'applications',
                question: 'Wie stelle ich einen neuen Antrag?',
                answer: 'Klicken Sie auf "Neuen Antrag stellen" und wählen Sie den gewünschten Antragstyp aus der Liste aus.'
            },
            {
                category: 'applications',
                question: 'Wie lange dauert die Bearbeitung meines Antrags?',
                answer: 'Die Bearbeitungszeit variiert je nach Antragstyp. In der Regel erhalten Sie innerhalb von 5-10 Werktagen eine Rückmeldung.'
            },
            {
                category: 'account',
                question: 'Wie kann ich meine Kontodaten ändern?',
                answer: 'Gehen Sie zu "Einstellungen" und bearbeiten Sie Ihre Profil-Informationen dort.'
            }
        ];

        helpContent.innerHTML = helpItems.map((item, index) => `
            <div class="border border-gray-200 rounded-lg overflow-hidden">
                <button class="help-item-toggle w-full p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center text-left font-medium" data-index="${index}">
                    <span>${item.question}</span>
                    <i data-lucide="chevron-down" class="w-5 h-5 transition-transform"></i>
                </button>
                <div class="help-item-content p-4 border-t border-gray-200 text-gray-600 hidden">
                    ${item.answer}
                </div>
            </div>
        `).join('');

        // Add toggle functionality
        helpContent.addEventListener('click', (e) => {
            const toggle = e.target.closest('.help-item-toggle');
            if (toggle) {
                const content = toggle.nextElementSibling;
                const icon = toggle.querySelector('[data-lucide="chevron-down"]');
                
                content.classList.toggle('hidden');
                if (icon) {
                    icon.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
                }
            }
        });

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    filterHelpContent(searchTerm) {
        // Implementation for help search
        console.log('Filtering help content:', searchTerm);
    }

    setHelpCategory(category) {
        // Update active category button
        const categoryButtons = document.querySelectorAll('.help-category-btn');
        categoryButtons.forEach(btn => {
            btn.classList.toggle('bg-red-600', btn.dataset.category === category);
            btn.classList.toggle('text-white', btn.dataset.category === category);
            btn.classList.toggle('border', btn.dataset.category !== category);
            btn.classList.toggle('border-gray-300', btn.dataset.category !== category);
            btn.classList.toggle('hover:bg-gray-50', btn.dataset.category !== category);
        });
        
        console.log('Setting help category:', category);
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            
            if (!dropdown.classList.contains('hidden')) {
                this.loadNotifications();
            }
        }
    }

    loadNotifications() {
        if (typeof NotificationDropdown !== 'undefined' && this.currentUser) {
            const dropdown = document.getElementById('notificationDropdown');
            if (dropdown) {
                const notificationDropdown = new NotificationDropdown(dropdown, {
                    isOpen: true,
                    onClose: () => {
                        dropdown.classList.add('hidden');
                        this.updateNotificationCount();
                    },
                    onNotificationClick: (notification) => {
                        console.log('Notification clicked:', notification);
                        dropdown.classList.add('hidden');
                    }
                });
                notificationDropdown.render();
            }
        }
    }

    updateNotificationCount() {
        if (typeof notificationService !== 'undefined' && this.currentUser) {
            const count = notificationService.getUnreadCount(this.currentUser.id);
            const badge = document.getElementById('notificationBadge');
            
            if (badge) {
                if (count > 0) {
                    badge.textContent = count > 99 ? '99+' : count.toString();
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        }
    }

    showMessage(message, type = 'success') {
        const toast = document.getElementById('messageToast');
        const messageText = document.getElementById('messageText');
        
        if (toast && messageText) {
            messageText.textContent = message;
            
            // Set color based on type
            toast.className = `fixed top-5 right-5 px-6 py-3 rounded-lg z-50 shadow-lg ${
                type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`;
            
            toast.classList.remove('hidden');
            
            // Auto hide after 3 seconds
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !show);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hawPortalApp = new HAWPortalApp();
});