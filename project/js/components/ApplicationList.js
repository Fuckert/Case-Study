// Application List Component - Vanilla JavaScript Version
class ApplicationList {
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.currentUser = authService.getCurrentUser();
        this.applications = [];
        this.filteredApplications = [];
        this.searchTerm = '';
        this.statusFilter = 'all';
        this.typeFilter = 'all';
        this.sortField = 'submittedAt';
        this.sortDirection = 'desc';
        this.currentPage = 1;
        this.itemsPerPage = 10;
    }

    render() {
        if (!this.container || !this.currentUser) return;

        this.loadApplications();

        this.container.innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">Meine Anträge</h2>
                        <p class="text-gray-600">${this.filteredApplications.length} von ${this.applications.length} Anträgen</p>
                    </div>
                </div>

                <!-- Suchbereich -->
                <div class="bg-white rounded-lg border border-gray-200 p-4">
                    <div class="flex gap-4 items-center mb-4">
                        <div class="relative flex-1">
                            <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                            <input type="text" id="searchInput" placeholder="Anträge durchsuchen..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        </div>
                        <button id="toggleFilters" class="px-4 py-2 border rounded-lg flex items-center gap-2 border-gray-300 text-gray-700">
                            <i data-lucide="filter" class="w-4 h-4"></i>
                            Filter
                        </button>
                    </div>

                    <div id="filtersPanel" class="hidden grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select id="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                <option value="all">Alle Status</option>
                                <option value="draft">Entwurf</option>
                                <option value="submitted">Eingereicht</option>
                                <option value="in_review">In Bearbeitung</option>
                                <option value="approved">Genehmigt</option>
                                <option value="rejected">Abgelehnt</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Typ</label>
                            <select id="typeFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                <option value="all">Alle Typen</option>
                                <option value="studentenausweis">Studentenausweis</option>
                                <option value="urlaubssemester">Urlaubssemester</option>
                                <option value="auslandssemester">Auslandssemester</option>
                                <option value="modulanerkennung">Modulanerkennung</option>
                                <option value="praktikumanerkennung">Praktikumanerkennung</option>
                                <option value="stipendium">Stipendium</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sortierung</label>
                            <select id="sortSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                <option value="submittedAt_desc">Neueste zuerst</option>
                                <option value="submittedAt_asc">Älteste zuerst</option>
                                <option value="updatedAt_desc">Zuletzt aktualisiert</option>
                                <option value="status_asc">Status A-Z</option>
                                <option value="priority_desc">Priorität hoch-niedrig</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Antragsliste -->
                <div id="applicationsList">
                    ${this.renderApplicationsList()}
                </div>

                <!-- Paginierung -->
                <div id="pagination">
                    ${this.renderPagination()}
                </div>
            </div>
        `;

        this.setupEventListeners();
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadApplications() {
        const { applications: userApps } = applicationService.getApplications(this.currentUser.id);
        this.applications = userApps;
        this.applyFiltersAndSort();
    }

    applyFiltersAndSort() {
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

        // Typfilter
        if (this.typeFilter !== 'all') {
            filtered = filtered.filter(app => app.type === this.typeFilter);
        }

        // Sortierung
        filtered.sort((a, b) => {
            let aValue = a[this.sortField];
            let bValue = b[this.sortField];

            if (this.sortField === 'submittedAt' || this.sortField === 'updatedAt') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.filteredApplications = filtered;
        this.currentPage = 1;
    }

    renderApplicationsList() {
        if (this.filteredApplications.length === 0) {
            return `
                <div class="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <i data-lucide="file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Keine Anträge gefunden</h3>
                    <p class="text-gray-600">
                        ${this.searchTerm || this.statusFilter !== 'all' || this.typeFilter !== 'all'
                            ? 'Versuchen Sie andere Suchkriterien'
                            : 'Sie haben noch keine Anträge eingereicht'
                        }
                    </p>
                </div>
            `;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPageApplications = this.filteredApplications.slice(startIndex, endIndex);

        return `
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Titel</th>
                                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Typ</th>
                                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Priorität</th>
                                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Eingereicht</th>
                                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${currentPageApplications.map(application => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3">
                                        <div>
                                            <div class="font-medium text-gray-900">${application.title}</div>
                                            <div class="text-sm text-gray-500 truncate max-w-xs">
                                                ${application.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            ${application.type}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="status-badge status-${application.status}">
                                            ${this.getStatusIcon(application.status)}
                                            ${applicationService.getStatusLabel(application.status)}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="priority-${application.priority} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                                            ${applicationService.getPriorityLabel(application.priority)}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-600">
                                        <div class="flex items-center gap-1">
                                            <i data-lucide="calendar" class="w-4 h-4"></i>
                                            ${this.formatDate(application.submittedAt)}
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2">
                                            <button class="view-application p-1 text-gray-400 hover:text-blue-600 rounded" data-id="${application.id}" title="Anzeigen">
                                                <i data-lucide="eye" class="w-4 h-4"></i>
                                            </button>
                                            ${(application.isDraft || application.status === 'additional_info_required') ? `
                                                <button class="edit-application p-1 text-gray-400 hover:text-green-600 rounded" data-id="${application.id}" title="Bearbeiten">
                                                    <i data-lucide="edit" class="w-4 h-4"></i>
                                                </button>
                                            ` : ''}
                                            <button class="delete-application p-1 text-gray-400 hover:text-red-600 rounded" data-id="${application.id}" title="Löschen">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredApplications.length / this.itemsPerPage);
        
        if (totalPages <= 1) return '';

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredApplications.length);

        return `
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    Zeige ${startIndex + 1} bis ${endIndex} von ${this.filteredApplications.length} Anträgen
                </div>
                
                <div class="flex items-center gap-2">
                    <button id="prevPage" class="p-2 border border-gray-300 rounded-lg ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}" ${this.currentPage === 1 ? 'disabled' : ''}>
                        <i data-lucide="chevron-left" class="w-4 h-4"></i>
                    </button>
                    
                    <div class="flex items-center gap-1">
                        ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return `
                                <button class="page-btn px-3 py-2 rounded-lg ${
                                    this.currentPage === page
                                        ? 'bg-red-600 text-white'
                                        : 'border border-gray-300 hover:bg-gray-50'
                                }" data-page="${page}">
                                    ${page}
                                </button>
                            `;
                        }).join('')}
                    </div>
                    
                    <button id="nextPage" class="p-2 border border-gray-300 rounded-lg ${this.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}" ${this.currentPage === totalPages ? 'disabled' : ''}>
                        <i data-lucide="chevron-right" class="w-4 h-4"></i>
                    </button>
                </div>
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
                this.applyFiltersAndSort();
                this.updateList();
            });
        }

        // Toggle filters
        const toggleFilters = document.getElementById('toggleFilters');
        const filtersPanel = document.getElementById('filtersPanel');
        if (toggleFilters && filtersPanel) {
            toggleFilters.addEventListener('click', () => {
                filtersPanel.classList.toggle('hidden');
                toggleFilters.classList.toggle('bg-red-50');
                toggleFilters.classList.toggle('border-red-300');
                toggleFilters.classList.toggle('text-red-700');
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.applyFiltersAndSort();
                this.updateList();
            });
        }

        // Type filter
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.typeFilter = e.target.value;
                this.applyFiltersAndSort();
                this.updateList();
            });
        }

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const [field, direction] = e.target.value.split('_');
                this.sortField = field;
                this.sortDirection = direction;
                this.applyFiltersAndSort();
                this.updateList();
            });
        }

        // Application actions
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

            if (e.target.closest('.delete-application')) {
                const button = e.target.closest('.delete-application');
                const applicationId = button.dataset.id;
                if (confirm('Antrag löschen?')) {
                    applicationService.deleteApplication(applicationId);
                    this.loadApplications();
                    this.updateList();
                }
            }

            // Pagination
            if (e.target.closest('.page-btn')) {
                const button = e.target.closest('.page-btn');
                this.currentPage = parseInt(button.dataset.page);
                this.updateList();
            }

            if (e.target.closest('#prevPage') && this.currentPage > 1) {
                this.currentPage--;
                this.updateList();
            }

            if (e.target.closest('#nextPage')) {
                const totalPages = Math.ceil(this.filteredApplications.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.updateList();
                }
            }
        });
    }

    updateList() {
        const applicationsList = document.getElementById('applicationsList');
        const pagination = document.getElementById('pagination');
        
        if (applicationsList) {
            applicationsList.innerHTML = this.renderApplicationsList();
        }
        
        if (pagination) {
            pagination.innerHTML = this.renderPagination();
        }
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}