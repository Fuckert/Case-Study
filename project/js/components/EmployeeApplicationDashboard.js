// Employee Application Dashboard Component - Vanilla JavaScript Version
class EmployeeApplicationDashboard {
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.currentUser = authService.getCurrentUser();
        this.applications = [];
        this.filteredApplications = [];
        this.searchTerm = '';
        this.statusFilter = 'all';
        this.priorityFilter = 'all';
    }

    render() {
        if (!this.container || !this.currentUser) return;

        this.loadData();
        
        const stats = this.calculateStats();

        this.container.innerHTML = `
            <div class="space-y-8">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                    <div class="flex justify-between items-start">
                        <div>
                            <h1 class="text-3xl font-bold mb-2">Mitarbeiter-Dashboard</h1>
                            <p class="text-blue-100 mb-6">
                                Verwalten Sie Ihre Mitarbeiter-Anträge und bearbeiten Sie Studenten-Anträge
                            </p>
                        </div>
                        <div class="text-right">
                            <div class="text-blue-100 text-sm">Heute</div>
                            <div class="text-2xl font-bold">
                                ${new Date().toLocaleDateString('de-DE', { 
                                    day: 'numeric', 
                                    month: 'short' 
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistik-Karten -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="stats-card">
                        <div class="flex justify-between items-center mb-4">
                            <div class="stats-icon bg-blue-50">
                                <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <span class="stats-number">${stats.totalApplications}</span>
                        </div>
                        <h3 class="stats-label">Meine Anträge</h3>
                        <p class="stats-description">Alle eigenen Anträge</p>
                    </div>

                    <div class="stats-card">
                        <div class="flex justify-between items-center mb-4">
                            <div class="stats-icon bg-yellow-50">
                                <i data-lucide="clock" class="w-6 h-6 text-yellow-600"></i>
                            </div>
                            <span class="stats-number">${stats.pendingApplications}</span>
                        </div>
                        <h3 class="stats-label">In Bearbeitung</h3>
                        <p class="stats-description">Warten auf Genehmigung</p>
                    </div>

                    <div class="stats-card">
                        <div class="flex justify-between items-center mb-4">
                            <div class="stats-icon bg-green-50">
                                <i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>
                            </div>
                            <span class="stats-number">${stats.approvedApplications}</span>
                        </div>
                        <h3 class="stats-label">Genehmigt</h3>
                        <p class="stats-description">Erfolgreich bearbeitet</p>
                    </div>

                    <div class="stats-card">
                        <div class="flex justify-between items-center mb-4">
                            <div class="stats-icon bg-purple-50">
                                <i data-lucide="home" class="w-6 h-6 text-purple-600"></i>
                            </div>
                            <span class="stats-number">${stats.homeofficeApplications}</span>
                        </div>
                        <h3 class="stats-label">Homeoffice</h3>
                        <p class="stats-description">Homeoffice-Anträge</p>
                    </div>
                </div>

                <!-- Filter und Aktionen -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
                        <div class="flex-1 max-w-md">
                            <div class="relative">
                                <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                                <input type="text" id="searchInput" placeholder="Anträge durchsuchen..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <select id="statusFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="all">Alle Status</option>
                                <option value="submitted">Eingereicht</option>
                                <option value="in_review">In Bearbeitung</option>
                                <option value="approved">Genehmigt</option>
                                <option value="rejected">Abgelehnt</option>
                            </select>

                            <select id="priorityFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="all">Alle Prioritäten</option>
                                <option value="urgent">Dringend</option>
                                <option value="high">Hoch</option>
                                <option value="medium">Normal</option>
                                <option value="low">Niedrig</option>
                            </select>
                        </div>
                    </div>

                    <!-- Antragsliste -->
                    <div id="applicationsList" class="space-y-4">
                        ${this.renderApplicationsList()}
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadData() {
        // Lade nur die Anträge des aktuellen Mitarbeiters
        const { applications: userApps } = applicationService.getApplications(this.currentUser.id);
        this.applications = userApps;
        this.applyFilters();
    }

    calculateStats() {
        return {
            totalApplications: this.applications.length,
            pendingApplications: this.applications.filter(app => 
                ['submitted', 'in_review'].includes(app.status)
            ).length,
            approvedApplications: this.applications.filter(app => app.status === 'approved').length,
            homeofficeApplications: this.applications.filter(app => app.type === 'homeoffice').length
        };
    }

    applyFilters() {
        let filtered = [...this.applications];

        // Suchfilter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.title.toLowerCase().includes(term) ||
                app.description.toLowerCase().includes(term) ||
                app.type.toLowerCase().includes(term)
            );
        }

        // Statusfilter
        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === this.statusFilter);
        }

        // Prioritätsfilter
        if (this.priorityFilter !== 'all') {
            filtered = filtered.filter(app => app.priority === this.priorityFilter);
        }

        // Sortiere nach Priorität und Datum
        filtered.sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority];
            const bPriority = priorityOrder[b.priority];
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            
            return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        });

        this.filteredApplications = filtered;
    }

    renderApplicationsList() {
        if (this.filteredApplications.length === 0) {
            return `
                <div class="text-center py-12">
                    <i data-lucide="file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Keine Anträge gefunden</h3>
                    <p class="text-gray-600 mb-6">
                        ${this.searchTerm || this.statusFilter !== 'all' || this.priorityFilter !== 'all'
                            ? 'Versuchen Sie andere Suchkriterien'
                            : 'Sie haben noch keine Anträge eingereicht'
                        }
                    </p>
                    <button id="newApplicationBtn" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Neuen Antrag stellen
                    </button>
                </div>
            `;
        }

        return this.filteredApplications.map(application => `
            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between">
                    <div class="flex items-start gap-4 flex-1">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${this.getApplicationIcon(application.type)}">
                            ${this.getApplicationEmoji(application.type)}
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <h3 class="font-semibold text-gray-900">${application.title}</h3>
                                <span class="priority-${application.priority} px-2 py-1 rounded-full border text-xs font-medium">
                                    ${applicationService.getPriorityLabel(application.priority)}
                                </span>
                                <span class="status-badge status-${application.status}">
                                    ${this.getStatusIcon(application.status)}
                                    ${applicationService.getStatusLabel(application.status)}
                                </span>
                            </div>

                            <p class="text-gray-600 text-sm mb-3">${application.description}</p>

                            <div class="flex items-center gap-6 text-sm text-gray-500">
                                <div class="flex items-center gap-1">
                                    <i data-lucide="calendar" class="w-4 h-4"></i>
                                    <span>${this.formatDate(application.submittedAt)}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <i data-lucide="file-text" class="w-4 h-4"></i>
                                    <span>${this.getApplicationTypeLabel(application.type)}</span>
                                </div>
                                ${application.comments.length > 0 ? `
                                    <div class="flex items-center gap-1">
                                        <i data-lucide="message-square" class="w-4 h-4"></i>
                                        <span>${application.comments.length} Kommentare</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 ml-4">
                        <button class="view-application p-2 text-gray-400 hover:text-blue-600 rounded" data-id="${application.id}" title="Anzeigen">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                        ${(application.isDraft || application.status === 'additional_info_required') ? `
                            <button class="edit-application p-2 text-gray-400 hover:text-green-600 rounded" data-id="${application.id}" title="Bearbeiten">
                                <i data-lucide="edit" class="w-4 h-4"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getApplicationIcon(type) {
        const colors = {
            homeoffice: 'bg-gradient-to-br from-teal-600 to-teal-700',
            urlaubsantrag: 'bg-gradient-to-br from-blue-600 to-blue-700',
            krankenmeldung: 'bg-gradient-to-br from-red-600 to-red-700',
            fortbildung: 'bg-gradient-to-br from-purple-600 to-purple-700',
            sabbatical: 'bg-gradient-to-br from-orange-600 to-orange-700',
            arbeitszeit: 'bg-gradient-to-br from-green-600 to-green-700'
        };
        return colors[type] || 'bg-gradient-to-br from-gray-600 to-gray-700';
    }

    getApplicationEmoji(type) {
        const emojis = {
            homeoffice: '🏠',
            urlaubsantrag: '🏖️',
            krankenmeldung: '🏥',
            fortbildung: '📚',
            sabbatical: '🎓',
            arbeitszeit: '⏰'
        };
        return emojis[type] || '📄';
    }

    getApplicationTypeLabel(type) {
        const labels = {
            homeoffice: 'Homeoffice-Antrag',
            urlaubsantrag: 'Urlaubsantrag',
            krankenmeldung: 'Krankenmeldung',
            fortbildung: 'Fortbildungsantrag',
            sabbatical: 'Sabbatical-Antrag',
            arbeitszeit: 'Arbeitszeitänderung'
        };
        return labels[type] || type;
    }

    getStatusIcon(status) {
        const icons = {
            submitted: 'clock',
            in_review: 'clock',
            additional_info_required: 'alert-circle',
            approved: 'check-circle',
            rejected: 'x-circle'
        };
        return `<i data-lucide="${icons[status] || 'file-text'}" class="w-4 h-4"></i>`;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.applyFilters();
                this.updateApplicationsList();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.applyFilters();
                this.updateApplicationsList();
            });
        }

        // Priority filter
        const priorityFilter = document.getElementById('priorityFilter');
        if (priorityFilter) {
            priorityFilter.addEventListener('change', (e) => {
                this.priorityFilter = e.target.value;
                this.applyFilters();
                this.updateApplicationsList();
            });
        }

        // New application button
        const newApplicationBtn = document.getElementById('newApplicationBtn');
        if (newApplicationBtn && this.options.onNewApplication) {
            newApplicationBtn.addEventListener('click', this.options.onNewApplication);
        }

        // View application buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-application')) {
                const button = e.target.closest('.view-application');
                const applicationId = button.dataset.id;
                const application = applicationService.getApplicationById(applicationId);
                if (application && this.options.onViewApplication) {
                    this.options.onViewApplication(application);
                }
            }

            if (e.target.closest('.edit-application')) {
                const button = e.target.closest('.edit-application');
                const applicationId = button.dataset.id;
                const application = applicationService.getApplicationById(applicationId);
                if (application && this.options.onEditApplication) {
                    this.options.onEditApplication(application);
                }
            }
        });
    }

    updateApplicationsList() {
        const applicationsList = document.getElementById('applicationsList');
        if (applicationsList) {
            applicationsList.innerHTML = this.renderApplicationsList();
            
            // Re-initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}