// Application Detail Component - Vanilla JavaScript Version
class ApplicationDetail {
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.application = options.application;
        this.newComment = '';
        this.isAddingComment = false;
        this.showComments = false;
        this.currentUser = authService.getCurrentUser();
    }

    render() {
        if (!this.container || !this.application) return;

        this.container.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <!-- Header -->
                    <div class="modal-header">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <h2 class="text-2xl font-bold text-gray-900">${this.application.title}</h2>
                                <div class="status-badge status-${this.application.status}">
                                    ${this.getStatusIcon(this.application.status)}
                                    <span class="text-sm font-medium">
                                        ${applicationService.getStatusLabel(this.application.status)}
                                    </span>
                                </div>
                            </div>
                            <p class="text-gray-600">${this.application.description}</p>
                            <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <div class="flex items-center gap-1">
                                    <i data-lucide="calendar" class="w-4 h-4"></i>
                                    <span>Eingereicht: ${this.formatDate(this.application.submittedAt)}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <i data-lucide="user" class="w-4 h-4"></i>
                                    <span>ID: ${this.application.id}</span>
                                </div>
                            </div>
                        </div>
                        <button id="closeModal" class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center ml-4">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 overflow-y-auto">
                        <div class="modal-body space-y-6">
                            <!-- Aktionen -->
                            <div class="flex gap-3">
                                ${(this.application.isDraft || this.application.status === 'additional_info_required') ? `
                                    <button id="editApplication" class="btn btn-primary">
                                        <i data-lucide="edit" class="w-4 h-4"></i>
                                        Bearbeiten
                                    </button>
                                ` : ''}
                                <button id="exportPDF" class="btn btn-secondary">
                                    <i data-lucide="download" class="w-4 h-4"></i>
                                    Als PDF exportieren
                                </button>
                                <button id="toggleComments" class="btn btn-secondary">
                                    <i data-lucide="message-square" class="w-4 h-4"></i>
                                    Kommentare (${this.application.comments.length})
                                </button>
                            </div>

                            <!-- Antragsdetails -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-4">
                                    <h3 class="text-lg font-semibold text-gray-900">Antragsdetails</h3>
                                    
                                    <div class="space-y-3">
                                        <div>
                                            <label class="text-sm font-medium text-gray-700">Typ</label>
                                            <p class="text-gray-900">${this.application.type}</p>
                                        </div>
                                        
                                        <div>
                                            <label class="text-sm font-medium text-gray-700">Priorität</label>
                                            <p class="text-gray-900">${applicationService.getPriorityLabel(this.application.priority)}</p>
                                        </div>
                                        
                                        <div>
                                            <label class="text-sm font-medium text-gray-700">Eingereicht am</label>
                                            <p class="text-gray-900">${this.formatDate(this.application.submittedAt)}</p>
                                        </div>
                                        
                                        <div>
                                            <label class="text-sm font-medium text-gray-700">Zuletzt aktualisiert</label>
                                            <p class="text-gray-900">${this.formatDate(this.application.updatedAt)}</p>
                                        </div>
                                        
                                        ${this.application.reviewedAt ? `
                                            <div>
                                                <label class="text-sm font-medium text-gray-700">Bearbeitet am</label>
                                                <p class="text-gray-900">${this.formatDate(this.application.reviewedAt)}</p>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <h3 class="text-lg font-semibold text-gray-900">Formulardaten</h3>
                                    
                                    <div class="space-y-3">
                                        ${Object.entries(this.application.formData).map(([key, value]) => `
                                            <div>
                                                <label class="text-sm font-medium text-gray-700 capitalize">
                                                    ${key.replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                                <p class="text-gray-900">
                                                    ${typeof value === 'boolean' ? (value ? 'Ja' : 'Nein') : String(value)}
                                                </p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- Anhänge -->
                            ${this.application.attachments && this.application.attachments.length > 0 ? `
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Anhänge</h3>
                                    <div class="space-y-2">
                                        ${this.application.attachments.map(attachment => `
                                            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                <div class="flex items-center gap-3">
                                                    <i data-lucide="paperclip" class="w-4 h-4 text-gray-400"></i>
                                                    <div>
                                                        <p class="font-medium text-gray-900">${attachment.fileName}</p>
                                                        <p class="text-sm text-gray-500">
                                                            ${(attachment.fileSize / 1024 / 1024).toFixed(2)} MB • 
                                                            Hochgeladen am ${this.formatDate(new Date(attachment.uploadedAt))}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button class="p-2 text-gray-400 hover:text-blue-600 rounded">
                                                    <i data-lucide="download" class="w-4 h-4"></i>
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Kommentare -->
                            <div id="commentsSection" class="hidden">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Kommentare</h3>
                                
                                <!-- Neuen Kommentar hinzufügen -->
                                <div class="mb-6 p-4 border border-gray-200 rounded-lg">
                                    <textarea id="newComment" placeholder="Kommentar hinzufügen..." rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"></textarea>
                                    <div class="flex justify-end mt-3">
                                        <button id="addComment" class="btn btn-primary">
                                            <i data-lucide="send" class="w-4 h-4"></i>
                                            Kommentar hinzufügen
                                        </button>
                                    </div>
                                </div>

                                <!-- Kommentarliste -->
                                <div class="space-y-4">
                                    ${this.application.comments.length === 0 ? `
                                        <p class="text-gray-500 text-center py-8">Noch keine Kommentare vorhanden</p>
                                    ` : this.application.comments.map(comment => `
                                        <div class="p-4 border border-gray-200 rounded-lg">
                                            <div class="flex justify-between items-start mb-2">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                        <i data-lucide="user" class="w-4 h-4 text-red-600"></i>
                                                    </div>
                                                    <div>
                                                        <p class="font-medium text-gray-900">${comment.userName}</p>
                                                        <p class="text-sm text-gray-500">
                                                            ${this.formatDate(comment.createdAt)}
                                                            ${comment.isInternal ? `
                                                                <span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                                    Intern
                                                                </span>
                                                            ` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p class="text-gray-700">${comment.content}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
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
        return `<i data-lucide="${icons[status] || 'file-text'}" class="w-5 h-5"></i>`;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    setupEventListeners() {
        // Close modal
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                if (this.options.onClose) {
                    this.options.onClose();
                }
            });
        }

        // Edit application
        const editApplication = document.getElementById('editApplication');
        if (editApplication) {
            editApplication.addEventListener('click', () => {
                if (this.options.onEdit) {
                    this.options.onEdit(this.application);
                }
            });
        }

        // Export PDF
        const exportPDF = document.getElementById('exportPDF');
        if (exportPDF) {
            exportPDF.addEventListener('click', () => this.handleExportPDF());
        }

        // Toggle comments
        const toggleComments = document.getElementById('toggleComments');
        const commentsSection = document.getElementById('commentsSection');
        if (toggleComments && commentsSection) {
            toggleComments.addEventListener('click', () => {
                this.showComments = !this.showComments;
                commentsSection.classList.toggle('hidden', !this.showComments);
            });
        }

        // Add comment
        const addComment = document.getElementById('addComment');
        if (addComment) {
            addComment.addEventListener('click', () => this.handleAddComment());
        }
    }

    async handleAddComment() {
        const newCommentTextarea = document.getElementById('newComment');
        if (!newCommentTextarea || !this.currentUser) return;

        const content = newCommentTextarea.value.trim();
        if (!content) return;

        this.isAddingComment = true;
        const addCommentBtn = document.getElementById('addComment');
        if (addCommentBtn) {
            addCommentBtn.disabled = true;
            addCommentBtn.innerHTML = `
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Wird hinzugefügt...
            `;
        }

        try {
            const success = applicationService.addComment(
                this.application.id,
                this.currentUser.id,
                this.currentUser.fullName,
                content,
                false
            );

            if (success) {
                newCommentTextarea.value = '';
                if (this.options.onUpdate) {
                    this.options.onUpdate();
                }
                // Reload the modal with updated data
                this.application = applicationService.getApplicationById(this.application.id);
                this.render();
            }
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Kommentars:', error);
        } finally {
            this.isAddingComment = false;
            if (addCommentBtn) {
                addCommentBtn.disabled = false;
                addCommentBtn.innerHTML = `
                    <i data-lucide="send" class="w-4 h-4"></i>
                    Kommentar hinzufügen
                `;
                
                // Re-initialize icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }
    }

    handleExportPDF() {
        // Simple text-based export since we don't have jsPDF
        const content = `
HAW Landshut - Antragsdetails

Antragstitel: ${this.application.title}
Antrags-ID: ${this.application.id}
Typ: ${this.application.type}
Status: ${applicationService.getStatusLabel(this.application.status)}
Priorität: ${applicationService.getPriorityLabel(this.application.priority)}
Eingereicht am: ${this.formatDate(this.application.submittedAt)}
Zuletzt aktualisiert: ${this.formatDate(this.application.updatedAt)}
${this.application.reviewedAt ? `Bearbeitet am: ${this.formatDate(this.application.reviewedAt)}` : ''}

Beschreibung:
${this.application.description}

Formulardaten:
${Object.entries(this.application.formData).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
    const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
    let displayValue = '';
    if (typeof value === 'boolean') {
        displayValue = value ? 'Ja' : 'Nein';
    } else if (value === null || value === undefined) {
        displayValue = 'Nicht angegeben';
    } else {
        displayValue = String(value);
    }
    return `${capitalizedKey}: ${displayValue}`;
}).join('\n')}

${this.application.comments.length > 0 ? `
Kommentare:
${this.application.comments.map(comment => `
${comment.userName} (${this.formatDate(comment.createdAt)}):
${comment.content}
${comment.isInternal ? '(Interner Kommentar)' : ''}
`).join('\n')}
` : ''}

Erstellt am: ${new Date().toLocaleDateString('de-DE')}
HAW Landshut - Digitales Antragsportal
        `;

        // Create and download text file
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Antrag_${this.application.type}_${this.application.id}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}