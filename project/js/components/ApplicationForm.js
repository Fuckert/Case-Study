// Application Form Component - Vanilla JavaScript Version
class ApplicationForm {
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.template = options.template;
        this.existingApplication = options.existingApplication;
        this.formData = {};
        this.errors = {};
        this.isSubmitting = false;
        this.isDraft = false;
        this.autoSaveStatus = null;
        
        if (this.existingApplication) {
            this.formData = { ...this.existingApplication.formData } || {};
            this.isDraft = this.existingApplication.isDraft;
        }
    }

    render() {
        if (!this.container || !this.template) return;

        this.container.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <!-- Header -->
                    <div class="modal-header">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl bg-gradient-to-br from-${this.template.color}-600 to-${this.template.color}-700">
                                ${this.template.icon}
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">${this.template.title}</h2>
                                <p class="text-gray-600">${this.template.description}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <!-- Auto-Save Status -->
                            <div id="autoSaveStatus" class="flex items-center gap-2 text-sm hidden">
                                <i data-lucide="clock" class="w-4 h-4"></i>
                                <span>Gespeichert</span>
                            </div>
                            <button id="closeModal" class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Form -->
                    <form id="applicationForm" class="flex-1 overflow-y-auto">
                        <div class="modal-body space-y-6">
                            <!-- Antragsinfo -->
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 class="font-semibold text-blue-900 mb-2">Antragsdetails</h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span class="text-blue-700 font-medium">Bearbeitungszeit:</span>
                                        <p class="text-blue-600">${this.template.estimatedProcessingTime}</p>
                                    </div>
                                    <div>
                                        <span class="text-blue-700 font-medium">Kategorie:</span>
                                        <p class="text-blue-600">${this.template.category === 'student' ? 'Studenten' : 'Mitarbeiter'}</p>
                                    </div>
                                    <div>
                                        <span class="text-blue-700 font-medium">Erforderliche Dokumente:</span>
                                        <ul class="text-blue-600 list-disc list-inside">
                                            ${this.template.requiredDocuments.map(doc => `<li>${doc}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Titel und Beschreibung -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="form-field">
                                    <label class="form-label">
                                        Titel des Antrags
                                        <span class="text-red-500 ml-1">*</span>
                                    </label>
                                    <input type="text" 
                                           id="title" 
                                           name="title" 
                                           value="${this.formData.title || this.template.title}" 
                                           class="form-input"
                                           required>
                                </div>
                                <div class="form-field">
                                    <label class="form-label">
                                        Kurze Beschreibung
                                        <span class="text-red-500 ml-1">*</span>
                                    </label>
                                    <input type="text" 
                                           id="description" 
                                           name="description" 
                                           value="${this.formData.description || this.template.description}" 
                                           class="form-input"
                                           required>
                                </div>
                            </div>

                            <!-- Formularfelder -->
                            <div class="space-y-6">
                                ${this.template.fields.map(field => this.renderField(field)).join('')}
                            </div>

                            <!-- Priorität -->
                            <div class="form-field">
                                <label class="form-label">Priorität</label>
                                <select id="priority" name="priority" class="form-input">
                                    <option value="low" ${this.formData.priority === 'low' ? 'selected' : ''}>Niedrig</option>
                                    <option value="medium" ${this.formData.priority === 'medium' || !this.formData.priority ? 'selected' : ''}>Normal</option>
                                    <option value="high" ${this.formData.priority === 'high' ? 'selected' : ''}>Hoch</option>
                                    <option value="urgent" ${this.formData.priority === 'urgent' ? 'selected' : ''}>Dringend</option>
                                </select>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="modal-footer">
                            <div class="text-sm text-gray-600">
                                ${this.isDraft ? `
                                    <span class="flex items-center gap-2">
                                        <i data-lucide="save" class="w-4 h-4"></i>
                                        Als Entwurf gespeichert
                                    </span>
                                ` : ''}
                            </div>
                            
                            <div class="flex gap-3">
                                <button type="button" id="saveDraft" class="btn btn-secondary">
                                    <i data-lucide="save" class="w-4 h-4"></i>
                                    Als Entwurf speichern
                                </button>
                                
                                <button type="submit" id="submitApplication" class="btn btn-primary">
                                    <i data-lucide="send" class="w-4 h-4"></i>
                                    Antrag einreichen
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.setupAutoSave();
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderField(field) {
        const value = this.formData[field.id] || '';
        const hasError = !!this.errors[field.id];
        const errorClass = hasError ? 'error' : '';

        let fieldHtml = '';

        switch (field.type) {
            case 'text':
            case 'email':
                fieldHtml = `
                    <input type="${field.type}" 
                           id="${field.id}" 
                           name="${field.id}" 
                           value="${value}" 
                           placeholder="${field.placeholder || ''}" 
                           class="form-input ${errorClass}"
                           ${field.required ? 'required' : ''}>
                `;
                break;

            case 'number':
                fieldHtml = `
                    <input type="number" 
                           id="${field.id}" 
                           name="${field.id}" 
                           value="${value}" 
                           placeholder="${field.placeholder || ''}" 
                           class="form-input ${errorClass}"
                           ${field.validation?.min !== undefined ? `min="${field.validation.min}"` : ''}
                           ${field.validation?.max !== undefined ? `max="${field.validation.max}"` : ''}
                           ${field.required ? 'required' : ''}>
                `;
                break;

            case 'date':
                fieldHtml = `
                    <input type="date" 
                           id="${field.id}" 
                           name="${field.id}" 
                           value="${value}" 
                           class="form-input ${errorClass}"
                           ${field.required ? 'required' : ''}>
                `;
                break;

            case 'select':
                fieldHtml = `
                    <select id="${field.id}" 
                            name="${field.id}" 
                            class="form-input ${errorClass}"
                            ${field.required ? 'required' : ''}>
                        <option value="">Bitte wählen...</option>
                        ${field.options?.map(option => `
                            <option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>
                        `).join('') || ''}
                    </select>
                `;
                break;

            case 'textarea':
                fieldHtml = `
                    <textarea id="${field.id}" 
                              name="${field.id}" 
                              placeholder="${field.placeholder || ''}" 
                              rows="4" 
                              class="form-input ${errorClass}"
                              ${field.required ? 'required' : ''}>${value}</textarea>
                `;
                break;

            case 'checkbox':
                return `
                    <div class="form-field">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" 
                                   id="${field.id}" 
                                   name="${field.id}" 
                                   ${value ? 'checked' : ''}
                                   class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                   ${field.required ? 'required' : ''}>
                            <span class="text-gray-700">${field.label}</span>
                        </label>
                        ${hasError ? `
                            <div class="form-error">
                                <i data-lucide="alert-circle" class="w-4 h-4"></i>
                                <span>${this.errors[field.id]}</span>
                            </div>
                        ` : ''}
                    </div>
                `;

            case 'file':
                fieldHtml = `
                    <div class="space-y-2">
                        <div class="flex items-center justify-center w-full">
                            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i data-lucide="upload" class="w-8 h-8 mb-4 text-gray-500"></i>
                                    <p class="mb-2 text-sm text-gray-500">
                                        <span class="font-semibold">Klicken zum Hochladen</span> oder Datei hierher ziehen
                                    </p>
                                    <p class="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (max. 10MB)</p>
                                </div>
                                <input type="file" 
                                       id="${field.id}" 
                                       name="${field.id}" 
                                       class="hidden" 
                                       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                       ${field.required ? 'required' : ''}>
                            </label>
                        </div>
                        ${value ? `
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <i data-lucide="file-text" class="w-4 h-4"></i>
                                <span>${value}</span>
                            </div>
                        ` : ''}
                    </div>
                `;
                break;

            default:
                return '';
        }

        if (field.type === 'checkbox') {
            return fieldHtml;
        }

        return `
            <div class="form-field">
                <label class="form-label">
                    ${field.label}
                    ${field.required ? '<span class="text-red-500 ml-1">*</span>' : ''}
                </label>
                ${fieldHtml}
                ${hasError ? `
                    <div class="form-error">
                        <i data-lucide="alert-circle" class="w-4 h-4"></i>
                        <span>${this.errors[field.id]}</span>
                    </div>
                ` : ''}
            </div>
        `;
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

        // Form submission
        const applicationForm = document.getElementById('applicationForm');
        if (applicationForm) {
            applicationForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Save draft
        const saveDraft = document.getElementById('saveDraft');
        if (saveDraft) {
            saveDraft.addEventListener('click', () => this.handleSaveDraft());
        }

        // Form field changes - Verbesserte Event-Handler
        const form = document.getElementById('applicationForm');
        if (form) {
            // Input events für Text-Felder
            form.addEventListener('input', (e) => {
                if (e.target.name) {
                    this.handleFieldChange(e.target.name, this.getFieldValue(e.target));
                }
            });
            
            // Change events für Select-Felder und Checkboxen
            form.addEventListener('change', (e) => {
                if (e.target.name) {
                    this.handleFieldChange(e.target.name, this.getFieldValue(e.target));
                }
            });
        }

        // File upload handling
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (file) {
                    this.handleFieldChange(e.target.name, file.name);
                }
            });
        });
    }

    setupAutoSave() {
        if (!this.isDraft) return;

        // Auto-Save alle 30 Sekunden
        this.autoSaveInterval = setInterval(() => {
            this.handleSaveDraft(true);
        }, 30000);
    }

    getFieldValue(element) {
        if (element.type === 'checkbox') {
            return element.checked;
        } else if (element.type === 'file') {
            return element.files?.[0]?.name || '';
        } else if (element.type === 'number') {
            return element.value ? Number(element.value) : '';
        } else {
            return element.value;
        }
    }

    handleFieldChange(fieldId, value) {
        if (!fieldId) return;
        
        this.formData[fieldId] = value;
        
        // Entferne Fehler für dieses Feld
        if (this.errors[fieldId]) {
            delete this.errors[fieldId];
            this.updateFieldError(fieldId);
        }
    }

    updateFieldError(fieldId) {
        const field = document.querySelector(`[name="${fieldId}"]`);
        if (field) {
            const formField = field.closest('.form-field');
            const errorElement = formField?.querySelector('.form-error');
            
            if (this.errors[fieldId]) {
                field.classList.add('error');
                if (!errorElement) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'form-error';
                    errorDiv.innerHTML = `
                        <i data-lucide="alert-circle" class="w-4 h-4"></i>
                        <span>${this.errors[fieldId]}</span>
                    `;
                    formField?.appendChild(errorDiv);
                    
                    // Re-initialize icons
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            } else {
                field.classList.remove('error');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        }
    }

    validateField(field, value) {
        if (field.required && (!value || value.toString().trim() === '')) {
            return `${field.label} ist erforderlich`;
        }

        if (field.validation) {
            const { min, max, pattern } = field.validation;

            if (field.type === 'number' && value !== undefined && value !== '') {
                const numValue = Number(value);
                if (min !== undefined && numValue < min) {
                    return `${field.label} muss mindestens ${min} sein`;
                }
                if (max !== undefined && numValue > max) {
                    return `${field.label} darf höchstens ${max} sein`;
                }
            }

            if (pattern && value && !new RegExp(pattern).test(value)) {
                return field.validation.message || `${field.label} hat ein ungültiges Format`;
            }
        }

        return null;
    }

    validateForm() {
        this.errors = {};

        // Validiere Titel und Beschreibung
        if (!this.formData.title || this.formData.title.trim() === '') {
            this.errors.title = 'Titel ist erforderlich';
        }
        if (!this.formData.description || this.formData.description.trim() === '') {
            this.errors.description = 'Beschreibung ist erforderlich';
        }

        // Validiere Template-Felder
        this.template.fields.forEach(field => {
            const error = this.validateField(field, this.formData[field.id]);
            if (error) {
                this.errors[field.id] = error;
            }
        });

        // Update UI für alle Fehler
        Object.keys(this.errors).forEach(fieldId => {
            this.updateFieldError(fieldId);
        });

        return Object.keys(this.errors).length === 0;
    }

    async handleSaveDraft(isAutoSave = false) {
        if (!isAutoSave) this.showAutoSaveStatus('saving');

        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('Nicht angemeldet');

            // Sammle aktuelle Formulardaten
            this.collectFormData();

            const applicationData = {
                userId: user.id,
                type: this.template.type,
                title: this.formData.title || this.template.title,
                description: this.formData.description || this.template.description,
                status: 'draft',
                priority: this.formData.priority || 'medium',
                formData: { ...this.formData },
                isDraft: true
            };

            let savedApplication;

            if (this.existingApplication) {
                savedApplication = applicationService.updateApplication(this.existingApplication.id, applicationData);
            } else {
                savedApplication = applicationService.saveDraft(applicationData);
                this.existingApplication = savedApplication; // Für zukünftige Updates
            }

            this.showAutoSaveStatus('saved');
            this.isDraft = true;

            if (!isAutoSave && this.options.onSubmit) {
                this.options.onSubmit(savedApplication);
            }

            // Status nach 2 Sekunden zurücksetzen
            setTimeout(() => this.showAutoSaveStatus(null), 2000);
        } catch (error) {
            this.showAutoSaveStatus('error');
            console.error('Fehler beim Speichern des Entwurfs:', error);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Sammle Formulardaten
        this.collectFormData();
        
        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;
        this.updateSubmitButton(true);

        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('Nicht angemeldet');

            const applicationData = {
                userId: user.id,
                type: this.template.type,
                title: this.formData.title || this.template.title,
                description: this.formData.description || this.template.description,
                status: 'submitted',
                priority: this.formData.priority || 'medium',
                formData: { ...this.formData },
                isDraft: false
            };

            let submittedApplication;

            if (this.existingApplication && this.existingApplication.isDraft) {
                // Update existing draft and submit
                const updatedDraft = applicationService.updateApplication(this.existingApplication.id, applicationData);
                submittedApplication = applicationService.submitDraft(this.existingApplication.id);
            } else if (this.existingApplication) {
                submittedApplication = applicationService.updateApplication(this.existingApplication.id, applicationData);
            } else {
                submittedApplication = applicationService.createApplication(applicationData);
            }

            if (this.options.onSubmit) {
                this.options.onSubmit(submittedApplication);
            }
        } catch (error) {
            console.error('Fehler beim Einreichen des Antrags:', error);
        } finally {
            this.isSubmitting = false;
            this.updateSubmitButton(false);
        }
    }

    collectFormData() {
        const form = document.getElementById('applicationForm');
        if (!form) return;

        // Sammle alle Formularwerte
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.name) {
                this.formData[input.name] = this.getFieldValue(input);
            }
        });

        // Spezielle Behandlung für Checkboxen
        this.template.fields.forEach(field => {
            if (field.type === 'checkbox') {
                const checkbox = document.getElementById(field.id);
                if (checkbox) {
                    this.formData[field.id] = checkbox.checked;
                }
            }
        });
    }

    updateSubmitButton(isSubmitting) {
        const submitButton = document.getElementById('submitApplication');
        if (submitButton) {
            if (isSubmitting) {
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Wird eingereicht...
                `;
            } else {
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    <i data-lucide="send" class="w-4 h-4"></i>
                    Antrag einreichen
                `;
                
                // Re-initialize icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }
    }

    showAutoSaveStatus(status) {
        const autoSaveStatus = document.getElementById('autoSaveStatus');
        if (!autoSaveStatus) return;

        if (!status) {
            autoSaveStatus.classList.add('hidden');
            return;
        }

        const statusConfig = {
            saving: { icon: 'clock', text: 'Speichert...', class: 'text-yellow-600' },
            saved: { icon: 'check-circle', text: 'Gespeichert', class: 'text-green-600' },
            error: { icon: 'alert-circle', text: 'Fehler', class: 'text-red-600' }
        };

        const config = statusConfig[status];
        if (config) {
            autoSaveStatus.innerHTML = `
                <i data-lucide="${config.icon}" class="w-4 h-4"></i>
                <span>${config.text}</span>
            `;
            autoSaveStatus.className = `flex items-center gap-2 text-sm ${config.class}`;
            autoSaveStatus.classList.remove('hidden');
            
            // Re-initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }
}