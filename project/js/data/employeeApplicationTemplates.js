// Employee Application Templates - Vanilla JavaScript Version
const employeeApplicationTemplates = [
    {
        type: 'urlaubsantrag',
        title: 'Urlaubsantrag',
        description: 'Beantragung von Erholungsurlaub oder Sonderurlaub',
        icon: '🏖️',
        color: 'blue',
        category: 'employee',
        estimatedProcessingTime: '3-5 Werktage',
        requiredDocuments: ['Urlaubsantrag', 'Vertretungsregelung'],
        fields: [
            {
                id: 'urlaubsart',
                type: 'select',
                label: 'Art des Urlaubs',
                required: true,
                options: ['Erholungsurlaub', 'Sonderurlaub', 'Bildungsurlaub', 'Unbezahlter Urlaub', 'Elternzeit']
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Urlaubsbeginn',
                required: true
            },
            {
                id: 'endDate',
                type: 'date',
                label: 'Urlaubsende',
                required: true
            },
            {
                id: 'vertretung',
                type: 'text',
                label: 'Vertretung durch',
                placeholder: 'Name der vertretenden Person',
                required: true
            },
            {
                id: 'grund',
                type: 'textarea',
                label: 'Begründung (bei Sonderurlaub)',
                placeholder: 'Grund für den Sonderurlaub...',
                required: false
            }
        ]
    },
    {
        type: 'krankenmeldung',
        title: 'Krankenmeldung',
        description: 'Meldung einer Arbeitsunfähigkeit oder längeren Krankheit',
        icon: '🏥',
        color: 'red',
        category: 'employee',
        estimatedProcessingTime: '1-2 Werktage',
        requiredDocuments: ['Arbeitsunfähigkeitsbescheinigung', 'Ärztliches Attest'],
        fields: [
            {
                id: 'krankheitsart',
                type: 'select',
                label: 'Art der Krankheit',
                options: ['Akute Erkrankung', 'Chronische Erkrankung', 'Arbeitsunfall', 'Rehabilitation', 'Sonstiges'],
                required: true
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Beginn der Arbeitsunfähigkeit',
                required: true
            },
            {
                id: 'endDate',
                type: 'date',
                label: 'Voraussichtliches Ende (falls bekannt)',
                required: false
            },
            {
                id: 'arzt',
                type: 'text',
                label: 'Behandelnder Arzt/Ärztin',
                placeholder: 'Name und Praxis',
                required: false
            },
            {
                id: 'erstmeldung',
                type: 'select',
                label: 'Erstmeldung oder Folgemeldung',
                required: true,
                options: ['Erstmeldung', 'Folgemeldung', 'Verlängerung']
            },
            {
                id: 'zusatzinformationen',
                type: 'textarea',
                label: 'Zusätzliche Informationen',
                placeholder: 'Weitere relevante Informationen zur Krankheit oder besonderen Umständen...',
                required: false
            },
            {
                id: 'vertretung',
                type: 'text',
                label: 'Vertretung organisiert durch',
                placeholder: 'Name der vertretenden Person oder Abteilung',
                required: false
            }
        ]
    },
    {
        type: 'fortbildung',
        title: 'Fortbildungsantrag',
        description: 'Beantragung einer beruflichen Weiterbildung oder Schulung',
        icon: '📚',
        color: 'purple',
        category: 'employee',
        estimatedProcessingTime: '7-10 Werktage',
        requiredDocuments: ['Fortbildungsantrag', 'Kursbeschreibung', 'Kostenaufstellung'],
        fields: [
            {
                id: 'fortbildungstitel',
                type: 'text',
                label: 'Titel der Fortbildung',
                required: true
            },
            {
                id: 'anbieter',
                type: 'text',
                label: 'Anbieter/Institution',
                required: true
            },
            {
                id: 'art',
                type: 'select',
                label: 'Art der Fortbildung',
                required: true,
                options: ['Präsenzveranstaltung', 'Online-Kurs', 'Blended Learning', 'Workshop', 'Zertifikatskurs']
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Beginn der Fortbildung',
                required: true
            },
            {
                id: 'endDate',
                type: 'date',
                label: 'Ende der Fortbildung',
                required: true
            },
            {
                id: 'kosten',
                type: 'number',
                label: 'Kosten (€)',
                required: true,
                validation: { min: 0, max: 15000 }
            },
            {
                id: 'bezugZurTaetigkeit',
                type: 'textarea',
                label: 'Bezug zur beruflichen Tätigkeit',
                placeholder: 'Wie trägt diese Fortbildung zur Verbesserung Ihrer beruflichen Qualifikation bei?',
                required: true
            },
            {
                id: 'erwarteterNutzen',
                type: 'textarea',
                label: 'Erwarteter Nutzen für die Hochschule',
                placeholder: 'Welchen Nutzen hat diese Fortbildung für die HAW Landshut?',
                required: true
            }
        ]
    },
    {
        type: 'homeoffice',
        title: 'Homeoffice-Antrag',
        description: 'Beantragung für regelmäßige Heimarbeit oder mobiles Arbeiten',
        icon: '🏠',
        color: 'teal',
        category: 'employee',
        estimatedProcessingTime: '5-7 Werktage',
        requiredDocuments: ['Homeoffice-Vereinbarung', 'Arbeitsplatz-Beschreibung'],
        fields: [
            {
                id: 'art',
                type: 'select',
                label: 'Art des Homeoffice',
                required: true,
                options: ['Regelmäßiges Homeoffice', 'Gelegentliches Homeoffice', 'Vollzeit Homeoffice', 'Mobiles Arbeiten']
            },
            {
                id: 'tageProWoche',
                type: 'number',
                label: 'Tage pro Woche im Homeoffice',
                required: true,
                validation: { min: 1, max: 5 }
            },
            {
                id: 'wochentage',
                type: 'text',
                label: 'Gewünschte Wochentage',
                placeholder: 'z.B. Montag, Mittwoch, Freitag',
                required: true
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Gewünschter Beginn',
                required: true
            },
            {
                id: 'arbeitsplatzBeschreibung',
                type: 'textarea',
                label: 'Beschreibung des Heimarbeitsplatzes',
                placeholder: 'Beschreibung der technischen Ausstattung und Arbeitsbedingungen...',
                required: true
            },
            {
                id: 'begruendung',
                type: 'textarea',
                label: 'Begründung',
                placeholder: 'Warum ist Homeoffice für Ihre Tätigkeit geeignet?',
                required: true
            },
            {
                id: 'datenschutzBestaetigung',
                type: 'checkbox',
                label: 'Ich bestätige, dass ich die Datenschutzbestimmungen für Homeoffice einhalte',
                required: true
            }
        ]
    },
    {
        type: 'sabbatical',
        title: 'Sabbatical-Antrag',
        description: 'Beantragung eines Forschungsfreisemesters oder Sabbaticals',
        icon: '🎓',
        color: 'orange',
        category: 'employee',
        estimatedProcessingTime: '14-21 Werktage',
        requiredDocuments: ['Sabbatical-Antrag', 'Forschungsplan', 'Finanzierungsnachweis'],
        fields: [
            {
                id: 'art',
                type: 'select',
                label: 'Art des Sabbaticals',
                required: true,
                options: ['Forschungsfreisemester', 'Sabbatical Jahr', 'Forschungsaufenthalt', 'Gastprofessur']
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Gewünschter Beginn',
                required: true
            },
            {
                id: 'endDate',
                type: 'date',
                label: 'Gewünschtes Ende',
                required: true
            },
            {
                id: 'gastinstitution',
                type: 'text',
                label: 'Gastinstitution (falls zutreffend)',
                placeholder: 'Name der Gastuniversität oder -institution',
                required: false
            },
            {
                id: 'forschungsthema',
                type: 'text',
                label: 'Forschungsthema',
                required: true
            },
            {
                id: 'forschungsplan',
                type: 'textarea',
                label: 'Detaillierter Forschungsplan',
                placeholder: 'Beschreibung der geplanten Forschungsaktivitäten...',
                required: true
            },
            {
                id: 'erwarteteErgebnisse',
                type: 'textarea',
                label: 'Erwartete Ergebnisse',
                placeholder: 'Welche Publikationen, Projekte oder Erkenntnisse erwarten Sie?',
                required: true
            },
            {
                id: 'finanzierung',
                type: 'select',
                label: 'Finanzierung',
                required: true,
                options: ['Vollbezahlung', 'Teilbezahlung', 'Unbezahlt', 'Stipendium', 'Drittmittel']
            }
        ]
    },
    {
        type: 'arbeitszeit',
        title: 'Arbeitszeitänderung',
        description: 'Beantragung einer Änderung der Arbeitszeit oder Teilzeit',
        icon: '⏰',
        color: 'red',
        category: 'employee',
        estimatedProcessingTime: '7-10 Werktage',
        requiredDocuments: ['Antrag auf Arbeitszeitänderung', 'Begründung'],
        fields: [
            {
                id: 'aenderungsart',
                type: 'select',
                label: 'Art der Änderung',
                required: true,
                options: ['Reduzierung der Arbeitszeit', 'Erhöhung der Arbeitszeit', 'Flexible Arbeitszeiten', 'Gleitzeit']
            },
            {
                id: 'aktuelleStunden',
                type: 'number',
                label: 'Aktuelle Wochenstunden',
                required: true,
                validation: { min: 1, max: 40 }
            },
            {
                id: 'gewuenschteStunden',
                type: 'number',
                label: 'Gewünschte Wochenstunden',
                required: true,
                validation: { min: 1, max: 40 }
            },
            {
                id: 'startDate',
                type: 'date',
                label: 'Gewünschter Beginn',
                required: true
            },
            {
                id: 'befristung',
                type: 'select',
                label: 'Befristung',
                required: true,
                options: ['Unbefristet', 'Befristet auf 1 Jahr', 'Befristet auf 2 Jahre', 'Befristet auf 3 Jahre']
            },
            {
                id: 'arbeitszeiten',
                type: 'textarea',
                label: 'Gewünschte Arbeitszeiten',
                placeholder: 'z.B. Montag-Donnerstag 8:00-16:00, Freitag 8:00-12:00',
                required: true
            },
            {
                id: 'begruendung',
                type: 'textarea',
                label: 'Begründung',
                placeholder: 'Grund für die Arbeitszeitänderung...',
                required: true
            }
        ]
    }
];

function getEmployeeApplicationTemplate(type) {
    return employeeApplicationTemplates.find(template => template.type === type);
}

function getEmployeeApplicationsByCategory() {
    return employeeApplicationTemplates;
}