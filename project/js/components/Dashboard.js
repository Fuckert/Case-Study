// Dashboard Component - Vanilla JavaScript Version
class Dashboard {
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.currentUser = authService.getCurrentUser();
    }

    render() {
        if (!this.container || !this.currentUser) return;

        // Lade nur die Anträge des aktuellen Benutzers
        const stats = applicationService.getDashboardStats(this.currentUser.id);
        const { applications: recentApplications } = applicationService.getApplications(
            this.currentUser.id, // Nur Anträge des aktuellen Benutzers
            undefined,
            { field: 'updatedAt', direction: 'desc' },
            5
        );

        this.container.innerHTML = `
            <div class="space-y-8">
                <!-- Welcome Section -->
                <div class="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
                    <div class="flex justify-between items-start">
                        <div>
                            <h1 class="text-3xl font-bold mb-2">
                                Willkommen zurück, ${this.currentUser.fullName.split(' ')[0]}!
                            </h1>
                            <p class="text-red-100 mb-6">
                                Verwalten Sie Ihre Anträge einfach und effizient über unser digitales Portal.
                            </p>
                            <button id="welcomeCTA" class="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center gap-2">
                                <i data-lucide="plus" class="w-5 h-5"></i>
                                Neuen Antrag stellen
                            </button>
                        </div>
                        <div class="text-right">
                            <div class="text-red-100 text-sm">Heute</div>
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
                        <h3 class="stats-label">Gesamt</h3>
                        <p class="stats-description">Alle Anträge</p>
                    </div>

                    <div class="stats-card">
                        <div class="flex justify-between items-center mb-4">
                            <div class="stats-icon bg-yellow-50">
                                <i data-lucide="clock" class="w-6 h-6 text-yellow-600"></i>
                            </div>
                            <span class="stats-number">${stats.pendingApplications}</span>
                        </div>
                        <h3 class="stats-label">Ausstehend</h3>
                        <p class="stats-description">In Bearbeitung</p>
                    </div>

                    <div class="stats-card">
                        <div class="flex justify-between items-center mb-4">
                            <div class="stats-icon bg-green-50">
                                <i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>
                            </div>
                            <span class="stats-number">${stats.approvedApplications}</span>
                        </div>
                        <h3 class="stats-label">Genehmigt</h3>
                        <p class="stats-description">Erfolgreich</p>
                    </div>

                    <div class="stats-card">
                        <div class="flex justify-between items-center mb-4">
                            <div class="stats-icon bg-red-50">
                                <i data-lucide="x-circle" class="w-6 h-6 text-red-600"></i>
                            </div>
                            <span class="stats-number">${stats.rejectedApplications}</span>
                        </div>
                        <h3 class="stats-label">Abgelehnt</h3>
                        <p class="stats-description">Nicht genehmigt</p>
                    </div>
                </div>

                <!-- Hauptinhalt -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Aktuelle Anträge -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
                            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h3 class="text-xl font-bold text-gray-900">Meine aktuellen Anträge</h3>
                                <button id="viewAllApplications" class="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                                    Alle anzeigen
                                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <div class="p-6">
                                ${this.renderRecentApplications(recentApplications)}
                            </div>
                        </div>
                    </div>

                    <!-- Seitenleiste -->
                    <div class="space-y-6">
                        ${stats.averageProcessingTime > 0 ? `
                            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Durchschnittliche Bearbeitungszeit</h3>
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-red-600 mb-2">
                                        ${stats.averageProcessingTime}
                                    </div>
                                    <div class="text-sm text-gray-600">Tage</div>
                                </div>
                            </div>
                        ` : ''}

                        ${stats.draftApplications > 0 ? `
                            <div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                                <div class="flex items-center gap-3 mb-3">
                                    <i data-lucide="file-text" class="w-5 h-5 text-yellow-600"></i>
                                    <h3 class="text-lg font-semibold text-yellow-900">Entwürfe</h3>
                                </div>
                                <p class="text-yellow-800 mb-4">
                                    Sie haben ${stats.draftApplications} unvollständige Anträge.
                                </p>
                                <button id="viewDrafts" class="text-yellow-700 hover:text-yellow-800 font-medium text-sm">
                                    Entwürfe bearbeiten →
                                </button>
                            </div>
                        ` : ''}

                        <!-- Hilfreiche Tipps -->
                        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <div class="flex items-center gap-3 mb-3">
                                <i data-lucide="info" class="w-5 h-5 text-blue-600"></i>
                                <h3 class="text-lg font-semibold text-blue-900">Tipp</h3>
                            </div>
                            <p class="text-blue-800 text-sm">
                                Reichen Sie Ihre Anträge frühzeitig ein, um längere Bearbeitungszeiten zu vermeiden.
                            </p>
                        </div>
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

    renderRecentApplications(applications) {
        if (applications.length === 0) {
            return `
                <div class="text-center py-12">
                    <i data-lucide="file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                    <h4 class="text-lg font-semibold text-gray-900 mb-2">Keine Anträge vorhanden</h4>
                    <p class="text-gray-600 mb-6">Sie haben noch keine Anträge eingereicht.</p>
                    <button id="firstApplication" class="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Ersten Antrag stellen
                    </button>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                ${applications.map(application => `
                    <div class="application-item flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors" data-id="${application.id}">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="file-text" class="w-5 h-5 text-red-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">${application.title}</h4>
                                <p class="text-sm text-gray-600">${this.formatDate(application.submittedAt)}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="status-badge status-${application.status}">
                                ${this.getStatusIcon(application.status)}
                                ${applicationService.getStatusLabel(application.status)}
                            </span>
                            <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getStatusIcon(status) {
        const icons = {
            draft: 'file-text',
            submitted: 'clock',
            in_review: 'clock',
            additional_info_required: 'alert-circle',
            approved: 'check-circle',
            rejected: 'x-circle',
            cancelled: 'x-circle'
        };
        return `<i data-lucide="${icons[status] || 'file-text'}" class="w-4 h-4"></i>`;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('de-DE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    setupEventListeners() {
        // Welcome CTA
        const welcomeCTA = document.getElementById('welcomeCTA');
        if (welcomeCTA && this.options.onNewApplication) {
            welcomeCTA.addEventListener('click', this.options.onNewApplication);
        }

        // First application button
        const firstApplication = document.getElementById('firstApplication');
        if (firstApplication && this.options.onNewApplication) {
            firstApplication.addEventListener('click', this.options.onNewApplication);
        }

        // View all applications
        const viewAllApplications = document.getElementById('viewAllApplications');
        if (viewAllApplications && this.options.onViewApplications) {
            viewAllApplications.addEventListener('click', this.options.onViewApplications);
        }

        // View drafts
        const viewDrafts = document.getElementById('viewDrafts');
        if (viewDrafts && this.options.onViewApplications) {
            viewDrafts.addEventListener('click', this.options.onViewApplications);
        }

        // Application items
        const applicationItems = document.querySelectorAll('.application-item');
        applicationItems.forEach(item => {
            item.addEventListener('click', () => {
                const applicationId = item.dataset.id;
                const application = applicationService.getApplicationById(applicationId);
                if (application && this.options.onViewApplication) {
                    this.options.onViewApplication(application);
                }
            });
        });
    }
}