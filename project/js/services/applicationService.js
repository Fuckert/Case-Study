// Application Service - Vanilla JavaScript Version
class ApplicationService {
    constructor() {
        this.applications = [];
        this.nextId = 1;
        this.initializeSampleData();
    }

    initializeSampleData() {
        // Beispiel-Anträge für Demo-Zwecke
        const sampleApplications = [
            // Studenten-Anträge
            {
                userId: 'user_1',
                type: 'studentenausweis',
                title: 'Neuer Studentenausweis',
                description: 'Beantragung eines neuen Studentenausweises nach Verlust',
                status: 'approved',
                priority: 'medium',
                submittedAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-18'),
                reviewedBy: 'user_11',
                reviewedAt: new Date('2024-01-18'),
                formData: { reason: 'Verlust', lostDate: '2024-01-10' },
                isDraft: false,
                comments: [],
                attachments: []
            },
            {
                userId: 'user_2',
                type: 'urlaubssemester',
                title: 'Urlaubssemester WS 2024/25',
                description: 'Beurlaubung für Auslandspraktikum',
                status: 'in_review',
                priority: 'high',
                submittedAt: new Date('2024-01-20'),
                updatedAt: new Date('2024-01-20'),
                formData: { 
                    semester: 'Wintersemester 2024/25',
                    reason: 'Praktikum',
                    detailedReason: 'Auslandspraktikum bei Microsoft in Seattle',
                    startDate: '2024-10-01',
                    endDate: '2025-03-31',
                    supportingDocuments: 'Praktikumsvertrag_Microsoft.pdf'
                },
                isDraft: false,
                comments: [],
                attachments: []
            },
            // Mitarbeiter-Anträge
            {
                userId: 'user_11', // Prof. Dr. Martin Schneider
                type: 'homeoffice',
                title: 'Homeoffice-Antrag',
                description: 'Beantragung für regelmäßiges Homeoffice 2 Tage pro Woche',
                status: 'approved',
                priority: 'medium',
                submittedAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-01-12'),
                reviewedBy: 'user_16', // Sabine Koch (Verwaltung)
                reviewedAt: new Date('2024-01-12'),
                formData: { 
                    art: 'Regelmäßiges Homeoffice',
                    tageProWoche: 2,
                    wochentage: 'Montag, Mittwoch',
                    startDate: '2024-02-01',
                    arbeitsplatzBeschreibung: 'Vollständig ausgestatteter Arbeitsplatz mit Laptop, Monitor und stabiler Internetverbindung',
                    begruendung: 'Bessere Work-Life-Balance und höhere Produktivität bei Forschungsarbeiten',
                    datenschutzBestaetigung: true
                },
                isDraft: false,
                comments: [],
                attachments: []
            },
            {
                userId: 'user_12', // Dr. Petra Lang
                type: 'urlaubsantrag',
                title: 'Urlaubsantrag Januar 2025',
                description: 'Erholungsurlaub vom 15.-19. Januar 2025',
                status: 'approved',
                priority: 'medium',
                submittedAt: new Date('2024-12-15'),
                updatedAt: new Date('2024-12-16'),
                reviewedBy: 'user_16',
                reviewedAt: new Date('2024-12-16'),
                formData: {
                    urlaubsart: 'Erholungsurlaub',
                    startDate: '2025-01-15',
                    endDate: '2025-01-19',
                    vertretung: 'Prof. Dr. Martin Schneider',
                    grund: ''
                },
                isDraft: false,
                comments: [],
                attachments: []
            },
            {
                userId: 'user_13', // Thomas Groß
                type: 'fortbildung',
                title: 'Fortbildung Digitale Lehrmethoden',
                description: 'Teilnahme an Fortbildung für moderne Lehrmethoden',
                status: 'in_review',
                priority: 'high',
                submittedAt: new Date('2024-01-22'),
                updatedAt: new Date('2024-01-22'),
                formData: {
                    fortbildungstitel: 'Digitale Lehrmethoden in der Ingenieurausbildung',
                    anbieter: 'Hochschuldidaktik Bayern',
                    art: 'Präsenzveranstaltung',
                    startDate: '2024-03-15',
                    endDate: '2024-03-17',
                    kosten: 850,
                    bezugZurTaetigkeit: 'Verbesserung der Lehrmethoden im Maschinenbau-Studium',
                    erwarteterNutzen: 'Modernisierung der Lehrveranstaltungen und bessere Studentenbetreuung'
                },
                isDraft: false,
                comments: [],
                attachments: []
            },
            {
                userId: 'user_14', // Prof. Maria Huber
                type: 'sabbatical',
                title: 'Forschungsfreisemester',
                description: 'Sabbatical für Forschungsprojekt zu sozialer Arbeit',
                status: 'submitted',
                priority: 'high',
                submittedAt: new Date('2024-01-25'),
                updatedAt: new Date('2024-01-25'),
                formData: {
                    art: 'Forschungsfreisemester',
                    startDate: '2024-09-01',
                    endDate: '2025-02-28',
                    gastinstitution: 'Universität Wien',
                    forschungsthema: 'Digitalisierung in der Sozialen Arbeit',
                    forschungsplan: 'Untersuchung der Auswirkungen digitaler Tools auf die Klientenbetreuung',
                    erwarteteErgebnisse: 'Publikation und Verbesserung der Lehrinhalte',
                    finanzierung: 'Vollbezahlung'
                },
                isDraft: false,
                comments: [],
                attachments: []
            },
            {
                userId: 'user_15', // Dr. Andreas Wolf
                type: 'arbeitszeit',
                title: 'Arbeitszeitreduzierung',
                description: 'Reduzierung der Arbeitszeit auf 30 Stunden/Woche',
                status: 'submitted',
                priority: 'medium',
                submittedAt: new Date('2024-01-28'),
                updatedAt: new Date('2024-01-28'),
                formData: {
                    aenderungsart: 'Reduzierung der Arbeitszeit',
                    aktuelleStunden: 40,
                    gewuenschteStunden: 30,
                    startDate: '2024-04-01',
                    befristung: 'Befristet auf 2 Jahre',
                    arbeitszeiten: 'Montag-Donnerstag 8:00-15:30',
                    begruendung: 'Familiäre Verpflichtungen und bessere Work-Life-Balance'
                },
                isDraft: false,
                comments: [],
                attachments: []
            }
        ];

        this.applications = sampleApplications.map((app, index) => ({
            id: `app_${index + 1}`,
            ...app
        }));

        this.nextId = this.applications.length + 1;
        this.loadFromLocalStorage();
    }

    // CRUD Operationen
    createApplication(applicationData) {
        const newApplication = {
            ...applicationData,
            id: `app_${this.nextId++}`,
            title: applicationData.title || 'Neuer Antrag',
            description: applicationData.description || 'Antragsbeschreibung',
            submittedAt: new Date(),
            updatedAt: new Date(),
            comments: [],
            attachments: []
        };

        this.applications.push(newApplication);
        this.saveToLocalStorage();
        
        // Benachrichtigung für neuen Antrag erstellen
        if (typeof notificationService !== 'undefined') {
            notificationService.createNewApplicationNotification(
                applicationData.userId, 
                newApplication.title, 
                newApplication.type, 
                newApplication.id
            );
        }
        
        return newApplication;
    }

    getApplicationById(id) {
        return this.applications.find(app => app.id === id);
    }

    updateApplication(id, updates) {
        const index = this.applications.findIndex(app => app.id === id);
        if (index === -1) return null;

        this.applications[index] = {
            ...this.applications[index],
            ...updates,
            updatedAt: new Date()
        };

        this.saveToLocalStorage();
        return this.applications[index];
    }

    deleteApplication(id) {
        const index = this.applications.findIndex(app => app.id === id);
        if (index === -1) return false;

        this.applications.splice(index, 1);
        this.saveToLocalStorage();
        return true;
    }

    // Anträge abrufen mit Filterung und Sortierung
    getApplications(userId, filters, sort, limit, offset) {
        let filteredApps = [...this.applications];

        // Nach Benutzer filtern
        if (userId) {
            filteredApps = filteredApps.filter(app => app.userId === userId);
        }

        // Filter anwenden
        if (filters) {
            if (filters.status && filters.status.length > 0) {
                filteredApps = filteredApps.filter(app => filters.status.includes(app.status));
            }

            if (filters.type && filters.type.length > 0) {
                filteredApps = filteredApps.filter(app => filters.type.includes(app.type));
            }

            if (filters.priority && filters.priority.length > 0) {
                filteredApps = filteredApps.filter(app => filters.priority.includes(app.priority));
            }

            if (filters.dateRange) {
                filteredApps = filteredApps.filter(app => 
                    app.submittedAt >= filters.dateRange.start && 
                    app.submittedAt <= filters.dateRange.end
                );
            }

            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                filteredApps = filteredApps.filter(app =>
                    app.title.toLowerCase().includes(term) ||
                    app.description.toLowerCase().includes(term) ||
                    app.type.toLowerCase().includes(term)
                );
            }
        }

        // Sortierung anwenden
        if (sort) {
            filteredApps.sort((a, b) => {
                const aValue = a[sort.field];
                const bValue = b[sort.field];
                
                if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const total = filteredApps.length;

        // Paginierung
        if (limit !== undefined && offset !== undefined) {
            filteredApps = filteredApps.slice(offset, offset + limit);
        }

        return { applications: filteredApps, total };
    }

    // Dashboard-Statistiken
    getDashboardStats(userId) {
        const userApps = userId 
            ? this.applications.filter(app => app.userId === userId)
            : this.applications;

        const stats = {
            totalApplications: userApps.length,
            pendingApplications: userApps.filter(app => 
                ['submitted', 'in_review', 'additional_info_required'].includes(app.status)
            ).length,
            approvedApplications: userApps.filter(app => app.status === 'approved').length,
            rejectedApplications: userApps.filter(app => app.status === 'rejected').length,
            draftApplications: userApps.filter(app => app.isDraft).length,
            averageProcessingTime: this.calculateAverageProcessingTime(userApps),
            recentActivity: this.getRecentActivity(userId)
        };

        return stats;
    }

    calculateAverageProcessingTime(applications) {
        const processedApps = applications.filter(app => 
            app.reviewedAt && ['approved', 'rejected'].includes(app.status)
        );

        if (processedApps.length === 0) return 0;

        const totalTime = processedApps.reduce((sum, app) => {
            const processingTime = app.reviewedAt.getTime() - app.submittedAt.getTime();
            return sum + processingTime;
        }, 0);

        return Math.round(totalTime / processedApps.length / (1000 * 60 * 60 * 24)); // Tage
    }

    getRecentActivity(userId) {
        // Simuliere kürzliche Aktivitäten
        const activities = [];
        
        const recentApps = this.applications
            .filter(app => userId ? app.userId === userId : true)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 5);

        recentApps.forEach(app => {
            activities.push({
                id: `activity_${app.id}`,
                type: 'application_submitted',
                title: `Antrag eingereicht: ${app.title}`,
                description: `Status: ${this.getStatusLabel(app.status)}`,
                timestamp: app.submittedAt,
                userId: app.userId,
                applicationId: app.id
            });
        });

        return activities;
    }

    // Status-Management
    updateApplicationStatus(id, status, reviewerId, comment) {
        const application = this.getApplicationById(id);
        if (!application) return null;

        const oldStatus = application.status;
        const updates = {
            status,
            updatedAt: new Date()
        };

        if (['approved', 'rejected'].includes(status) && reviewerId) {
            updates.reviewedBy = reviewerId;
            updates.reviewedAt = new Date();
        }

        if (comment) {
            const newComment = {
                id: `comment_${Date.now()}`,
                applicationId: id,
                userId: reviewerId || 'system',
                userName: 'System',
                content: comment,
                isInternal: true,
                createdAt: new Date()
            };
            updates.comments = [...application.comments, newComment];
        }

        const updatedApplication = this.updateApplication(id, updates);
        
        // Benachrichtigung erstellen wenn Status sich geändert hat
        if (updatedApplication && oldStatus !== status && typeof notificationService !== 'undefined') {
            notificationService.createApplicationStatusNotification(
                application.userId,
                application.title,
                status,
                application.id
            );
        }
        
        return updatedApplication;
    }

    // Batch-Operationen
    batchUpdateStatus(applicationIds, status, reviewerId) {
        let updatedCount = 0;
        
        applicationIds.forEach(id => {
            const result = this.updateApplicationStatus(id, status, reviewerId);
            if (result) updatedCount++;
        });

        return updatedCount;
    }

    // Kommentare
    addComment(applicationId, userId, userName, content, isInternal = false) {
        const application = this.getApplicationById(applicationId);
        if (!application) return false;

        const newComment = {
            id: `comment_${Date.now()}`,
            applicationId,
            userId,
            userName,
            content,
            isInternal,
            createdAt: new Date()
        };

        application.comments.push(newComment);
        this.updateApplication(applicationId, { comments: application.comments });
        return true;
    }

    // Entwürfe
    saveDraft(applicationData) {
        if (applicationData.id) {
            // Bestehenden Entwurf aktualisieren
            return this.updateApplication(applicationData.id, { 
                ...applicationData, 
                formData: { ...applicationData.formData },
                isDraft: true 
            });
        } else {
            // Neuen Entwurf erstellen
            return this.createApplication({
                ...applicationData,
                formData: { ...applicationData.formData },
                isDraft: true,
                status: 'draft',
                priority: 'medium'
            });
        }
    }

    submitDraft(id) {
        return this.updateApplication(id, {
            isDraft: false,
            status: 'submitted',
            submittedAt: new Date()
        });
    }

    // Hilfsmethoden
    getStatusLabel(status) {
        const statusLabels = {
            draft: 'Entwurf',
            submitted: 'Eingereicht',
            in_review: 'In Bearbeitung',
            additional_info_required: 'Zusätzliche Informationen erforderlich',
            approved: 'Genehmigt',
            rejected: 'Abgelehnt',
            cancelled: 'Storniert'
        };
        return statusLabels[status];
    }

    getPriorityLabel(priority) {
        const priorityLabels = {
            low: 'Niedrig',
            medium: 'Normal',
            high: 'Hoch',
            urgent: 'Dringend'
        };
        return priorityLabels[priority] || priority;
    }

    // Lokale Speicherung
    saveToLocalStorage() {
        try {
            localStorage.setItem('haw_applications', JSON.stringify(this.applications));
        } catch (error) {
            console.error('Fehler beim Speichern der Anträge:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('haw_applications');
            if (stored && stored !== 'undefined') {
                const loadedApplications = JSON.parse(stored);
                if (Array.isArray(loadedApplications) && loadedApplications.length > 0) {
                    // Convert date strings back to Date objects
                    this.applications = loadedApplications.map(app => ({
                        ...app,
                        submittedAt: new Date(app.submittedAt),
                        updatedAt: new Date(app.updatedAt),
                        reviewedAt: app.reviewedAt ? new Date(app.reviewedAt) : undefined,
                        comments: app.comments?.map((comment) => ({
                            ...comment,
                            createdAt: new Date(comment.createdAt)
                        })) || [],
                        attachments: app.attachments?.map((attachment) => ({
                            ...attachment,
                            uploadedAt: attachment.uploadedAt ? new Date(attachment.uploadedAt) : undefined
                        })) || []
                    }));
                    this.nextId = Math.max(...this.applications.map(app => 
                        parseInt(app.id.replace('app_', ''))
                    )) + 1;
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der Anträge:', error);
        }
    }

    // Export/Import für Backup
    exportApplications() {
        return JSON.stringify(this.applications, null, 2);
    }

    importApplications(data) {
        try {
            const imported = JSON.parse(data);
            if (Array.isArray(imported)) {
                this.applications = imported;
                this.saveToLocalStorage();
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }
}

// Global instance
const applicationService = new ApplicationService();