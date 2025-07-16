// Application Templates - Vanilla JavaScript Version
const applicationTemplates = [
    {
        type: 'studentenausweis',
        title: 'Studentenausweis',
        description: 'Beantragung eines neuen Studentenausweises bei Verlust oder Beschädigung',
        icon: '🆔',
        color: 'blue',
        category: 'student',
        estimatedProcessingTime: '3-5 Werktage',
        requiredDocuments: ['Immatrikulationsbescheinigung', 'Passfoto', 'Personalausweis'],
        fields: [
            {
                id: 'reason',
                type: 'select',
                label: 'Grund für neuen Ausweis',
                required: true,
                options: ['Verlust', 'Beschädigung', 'Defekt', 'Namensänderung']
            },
            {
                id: 'lostDate',
                type: 'date',
                label: 'Datum des Verlusts (falls zutreffend)',
                required: false
            },
            {
                id: 'policeReport',
                type: 'checkbox',
                label: 'Polizeiliche Verlustanzeige erstattet',
                required: false
            },
            {
                id: 'additionalInfo',
                type: 'textarea',
                label: 'Zusätzliche Informationen',
                placeholder: 'Weitere Details zum Verlust oder zur Beschädigung...',
                required: false
            }
        ]
    },
    {
        type: 'urlaubssemester',
        title: 'Urlaubssemester',
        description: 'Beantragung einer Beurlaubung vom Studium für ein oder mehrere Semester',
        icon: '📅',
        color: 'green',
        category: 'student',
        estimatedProcessingTime: '7-10 Werktage',
        requiredDocuments: ['Begründung', 'Nachweise (je nach Grund)', 'Immatrikulationsbescheinigung'],
        fields: [
            {
                id: 'semester',
                type: 'select',
                label: 'Semester',
                required: true,
                options: ['Wintersemester 2024/25', 'Sommersemester 2025', 'Wintersemester 2025/26']
            },
            {
                id: 'reason',
                type: 'select',
                label: 'Grund der Beurlaubung',
                required: true,
                options: ['Krankheit', 'Schwangerschaft/Mutterschutz', 'Auslandsstudium', 'Praktikum', 'Wehrdienst', 'Sonstiges']
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Beginn der Beurlaubung',
                required: true
            },
            {
                id: 'endDate',
                type: 'date',
                label: 'Ende der Beurlaubung',
                required: true
            },
            {
                id: 'detailedReason',
                type: 'textarea',
                label: 'Detaillierte Begründung',
                placeholder: 'Bitte erläutern Sie ausführlich den Grund für die Beurlaubung...',
                required: true
            },
            {
                id: 'supportingDocuments',
                type: 'file',
                label: 'Nachweise hochladen',
                required: true
            }
        ]
    },
    {
        type: 'auslandssemester',
        title: 'Auslandssemester',
        description: 'Beantragung für ein Studium im Ausland mit Anerkennung der Studienleistungen',
        icon: '✈️',
        color: 'teal',
        category: 'student',
        estimatedProcessingTime: '14-21 Werktage',
        requiredDocuments: ['Learning Agreement', 'Transcript of Records', 'Sprachnachweis'],
        fields: [
            {
                id: 'university',
                type: 'text',
                label: 'Gasthochschule',
                placeholder: 'Name der ausländischen Hochschule',
                required: true
            },
            {
                id: 'country',
                type: 'text',
                label: 'Land',
                required: true
            },
            {
                id: 'program',
                type: 'text',
                label: 'Studienprogramm',
                placeholder: 'Name des Studienprogramms im Ausland',
                required: true
            },
            {
                id: 'duration',
                type: 'select',
                label: 'Dauer',
                required: true,
                options: ['1 Semester', '2 Semester', '1 Jahr']
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Beginn des Auslandsstudiums',
                required: true
            },
            {
                id: 'endDate',
                type: 'date',
                label: 'Ende des Auslandsstudiums',
                required: true
            },
            {
                id: 'languageLevel',
                type: 'select',
                label: 'Sprachniveau',
                required: true,
                options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Muttersprachler']
            },
            {
                id: 'motivation',
                type: 'textarea',
                label: 'Motivation',
                placeholder: 'Warum möchten Sie im Ausland studieren?',
                required: true
            }
        ]
    },
    {
        type: 'modulanerkennung',
        title: 'Modulanerkennung',
        description: 'Anerkennung von extern erbrachten Studienleistungen',
        icon: '📚',
        color: 'purple',
        category: 'student',
        estimatedProcessingTime: '10-14 Werktage',
        requiredDocuments: ['Transcript of Records', 'Modulbeschreibungen', 'Curriculum'],
        fields: [
            {
                id: 'sourceUniversity',
                type: 'text',
                label: 'Herkunftshochschule',
                placeholder: 'Name der Hochschule, an der die Leistung erbracht wurde',
                required: true
            },
            {
                id: 'moduleTitle',
                type: 'text',
                label: 'Modultitel (extern)',
                required: true
            },
            {
                id: 'targetModule',
                type: 'text',
                label: 'Anzuerkennendes Modul (HAW)',
                required: true
            },
            {
                id: 'credits',
                type: 'number',
                label: 'ECTS-Punkte',
                required: true,
                validation: { min: 1, max: 30 }
            },
            {
                id: 'grade',
                type: 'text',
                label: 'Erreichte Note',
                required: true
            },
            {
                id: 'completionDate',
                type: 'date',
                label: 'Abschlussdatum',
                required: true
            },
            {
                id: 'moduleDescription',
                type: 'file',
                label: 'Modulbeschreibung hochladen',
                required: true
            }
        ]
    },
    {
        type: 'praktikumanerkennung',
        title: 'Praktikumanerkennung',
        description: 'Anerkennung von absolvierten Praktika als Studienleistung',
        icon: '💼',
        color: 'orange',
        category: 'student',
        estimatedProcessingTime: '7-10 Werktage',
        requiredDocuments: ['Praktikumszeugnis', 'Praktikumsbericht', 'Tätigkeitsnachweis'],
        fields: [
            {
                id: 'company',
                type: 'text',
                label: 'Unternehmen',
                required: true
            },
            {
                id: 'department',
                type: 'text',
                label: 'Abteilung',
                required: true
            },
            {
                id: 'supervisor',
                type: 'text',
                label: 'Betreuer im Unternehmen',
                required: true
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Beginn des Praktikums',
                required: true
            },
            {
                id: 'endDate',
                type: 'date',
                label: 'Ende des Praktikums',
                required: true
            },
            {
                id: 'hoursPerWeek',
                type: 'number',
                label: 'Stunden pro Woche',
                required: true,
                validation: { min: 1, max: 40 }
            },
            {
                id: 'activities',
                type: 'textarea',
                label: 'Tätigkeitsbeschreibung',
                placeholder: 'Beschreiben Sie Ihre Haupttätigkeiten während des Praktikums...',
                required: true
            },
            {
                id: 'learningOutcomes',
                type: 'textarea',
                label: 'Lernergebnisse',
                placeholder: 'Was haben Sie während des Praktikums gelernt?',
                required: true
            }
        ]
    },
    {
        type: 'stipendium',
        title: 'Stipendium',
        description: 'Bewerbung um ein Stipendium oder Förderprogramm',
        icon: '🎓',
        color: 'red',
        category: 'student',
        estimatedProcessingTime: '21-30 Werktage',
        requiredDocuments: ['Lebenslauf', 'Motivationsschreiben', 'Zeugnisse', 'Empfehlungsschreiben'],
        fields: [
            {
                id: 'scholarshipType',
                type: 'select',
                label: 'Art des Stipendiums',
                required: true,
                options: ['Leistungsstipendium', 'Bedürftigkeitsstipendium', 'Auslandsstipendium', 'Forschungsstipendium']
            },
            {
                id: 'amount',
                type: 'number',
                label: 'Beantragte Fördersumme (€)',
                required: true,
                validation: { min: 100, max: 10000 }
            },
            {
                id: 'duration',
                type: 'select',
                label: 'Förderdauer',
                required: true,
                options: ['1 Semester', '2 Semester', '3 Semester', '4 Semester']
            },
            {
                id: 'gpa',
                type: 'text',
                label: 'Aktuelle Durchschnittsnote',
                required: true
            },
            {
                id: 'financialSituation',
                type: 'textarea',
                label: 'Finanzielle Situation',
                placeholder: 'Beschreiben Sie Ihre finanzielle Situation...',
                required: true
            },
            {
                id: 'motivation',
                type: 'textarea',
                label: 'Motivation',
                placeholder: 'Warum sollten Sie das Stipendium erhalten?',
                required: true
            },
            {
                id: 'cv',
                type: 'file',
                label: 'Lebenslauf hochladen',
                required: true
            },
            {
                id: 'transcripts',
                type: 'file',
                label: 'Zeugnisse hochladen',
                required: true
            }
        ]
    }
];

function getApplicationTemplate(type) {
    return applicationTemplates.find(template => template.type === type);
}

function getApplicationsByCategory(category) {
    if (category === 'student') {
        return applicationTemplates.filter(template => template.category === 'student');
    } else if (category === 'employee') {
        return applicationTemplates.filter(template => template.category === 'employee');
    } else {
        return applicationTemplates.filter(template => 
            template.category === category || template.category === 'both'
        );
    }
}