# HAW Landshut - Digitales Antragsportal

Eine moderne, responsive Web-Anwendung für das digitale Antragsportal der Hochschule für angewandte Wissenschaften Landshut, entwickelt mit **reinem HTML, CSS und JavaScript**.

## 🚀 Features

- **Reine Web-Technologien**: HTML5, CSS3, Vanilla JavaScript
- **Responsive Design**: Optimiert für alle Geräte
- **Benutzerrollen**: Student und Mitarbeiter
- **Antragsmanagement**: Vollständiges System für Anträge
- **Lokale Datenspeicherung**: Alle Daten bleiben im Browser gespeichert
- **Benachrichtigungssystem**: Echtzeit-Benachrichtigungen
- **PDF-Export**: Anträge als Textdatei exportieren
- **Moderne UI**: Tailwind CSS für professionelles Design

## 🛠️ Technologie-Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide Icons (CDN)
- **Datenspeicherung**: LocalStorage
- **Build**: Keine Build-Tools erforderlich

## 📦 Installation & Deployment

### Lokale Entwicklung

1. Repository klonen oder Dateien herunterladen
2. Einen lokalen Webserver starten:
   ```bash
   # Mit Python
   python -m http.server 8000
   
   # Mit Node.js (http-server)
   npx http-server
   
   # Mit PHP
   php -S localhost:8000
   ```
3. Browser öffnen: `http://localhost:8000`

### GitHub Deployment

1. Repository auf GitHub erstellen
2. Alle Dateien hochladen
3. GitHub Pages aktivieren:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / root

### Vercel Deployment

1. Vercel-Account erstellen
2. Repository mit Vercel verbinden
3. Automatisches Deployment aktiviert

**Oder direkt deployen:**
```bash
npx vercel
```

## 👥 Demo-Benutzer

### Studenten
- **E-Mail**: s-maxmustermann@haw-landshut.de
- **Passwort**: pass120
- **Weitere**: s-annaschmidt@haw-landshut.de (pass121), etc.

### Mitarbeiter
- **E-Mail**: m-martinschneider@haw-landshut.de
- **Passwort**: admin120
- **Weitere**: m-petralang@haw-landshut.de (admin121), etc.

## 🎯 Funktionen

### Für Studenten
- ✅ Studentenausweis beantragen
- ✅ Urlaubssemester beantragen
- ✅ Auslandssemester planen
- ✅ Modulanerkennung
- ✅ Praktikumanerkennung
- ✅ Stipendium beantragen

### Für Mitarbeiter
- ✅ Urlaubsantrag stellen
- ✅ Homeoffice beantragen
- ✅ Fortbildung anmelden
- ✅ Sabbatical planen
- ✅ Arbeitszeit ändern
- ✅ Krankenmeldung

### Allgemeine Features
- ✅ Dashboard mit Statistiken
- ✅ Antragsübersicht und -verwaltung
- ✅ Kommentarsystem
- ✅ Benachrichtigungen
- ✅ Suchfunktion
- ✅ Filter und Sortierung
- ✅ Responsive Design
- ✅ Dunkles/Helles Design
- ✅ Mehrsprachigkeit (DE/EN vorbereitet)

## 📁 Projektstruktur

```
/
├── index.html              # Haupt-HTML-Datei
├── styles/
│   └── main.css           # Haupt-CSS-Datei
├── js/
│   ├── main.js            # Haupt-JavaScript-Datei
│   ├── data/
│   │   ├── userDatabase.js
│   │   ├── applicationTemplates.js
│   │   └── employeeApplicationTemplates.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── applicationService.js
│   │   └── notificationService.js
│   └── components/
│       ├── Dashboard.js
│       ├── EmployeeApplicationDashboard.js
│       ├── ApplicationList.js
│       ├── ApplicationForm.js
│       ├── ApplicationDetail.js
│       └── NotificationDropdown.js
├── public/
│   └── csm_032A1148_6067fe2111.jpg  # Hintergrundbild
└── docs/                   # Dokumentation
```

## 🔧 Anpassungen

### Neue Antragstypen hinzufügen

1. **Für Studenten** (`js/data/applicationTemplates.js`):
```javascript
{
    type: 'neuer_antrag',
    title: 'Neuer Antrag',
    description: 'Beschreibung des Antrags',
    icon: '📝',
    color: 'blue',
    category: 'student',
    estimatedProcessingTime: '5-7 Werktage',
    requiredDocuments: ['Dokument 1'],
    fields: [
        {
            id: 'field1',
            type: 'text',
            label: 'Feldname',
            required: true
        }
    ]
}
```

2. **Für Mitarbeiter** (`js/data/employeeApplicationTemplates.js`):
```javascript
// Ähnliche Struktur für Mitarbeiter-Anträge
```

### Styling anpassen

- **Farben**: In `styles/main.css` die CSS-Variablen ändern
- **Layout**: Tailwind-Klassen in `index.html` anpassen
- **Komponenten**: Individuelle Styles in `main.css` hinzufügen

### Neue Benutzer hinzufügen

In `js/data/userDatabase.js` neue Benutzer zum Array hinzufügen:
```javascript
{
    "Vollständiger Name": "Neuer Benutzer",
    "E-Mail": "benutzer@haw-landshut.de",
    "Passwort": "passwort123",
    "Rolle": "Student", // oder "Mitarbeiter"
    "Fachbereich": "Informatik",
    "Semester": 3
}
```

## 🌐 Browser-Unterstützung

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔒 Datenschutz & Sicherheit

- **Lokale Speicherung**: Alle Daten bleiben im Browser
- **Keine Server**: Keine Datenübertragung an externe Server
- **Demo-Modus**: Sichere Demonstration ohne echte Daten
- **DSGVO-konform**: Keine Cookies oder Tracking

## 🚀 Performance

- **Schnell**: Keine Build-Tools, direktes Laden
- **Leichtgewicht**: Minimale Abhängigkeiten
- **Offline-fähig**: Funktioniert ohne Internetverbindung
- **SEO-freundlich**: Semantisches HTML

## 📈 Erweiterungen

### Geplante Features
- [ ] PWA-Unterstützung
- [ ] Offline-Synchronisation
- [ ] Push-Benachrichtigungen
- [ ] Erweiterte PDF-Generierung
- [ ] Drag & Drop für Dateien
- [ ] Erweiterte Suchfunktionen

### Integration-Möglichkeiten
- **Backend**: Einfache Integration mit REST APIs
- **Datenbank**: Austausch von LocalStorage gegen echte DB
- **Authentifizierung**: Integration mit OAuth/LDAP
- **E-Mail**: Benachrichtigungen per E-Mail

## 🤝 Beitragen

1. Fork des Repositories
2. Feature-Branch erstellen
3. Änderungen committen
4. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt wurde für die HAW Landshut entwickelt. Alle Rechte vorbehalten.

## 📞 Support

- **E-Mail**: support@haw-landshut.de
- **Dokumentation**: `/docs` Ordner
- **Issues**: GitHub Issues

## 🎉 Demo

**Live-Demo**: [Hier wird Ihre Vercel/GitHub Pages URL stehen]

### Schnellstart
1. Seite öffnen
2. Rolle wählen (Student/Mitarbeiter)
3. Mit Demo-Daten anmelden
4. Anträge erstellen und verwalten

---

**Entwickelt mit ❤️ für die HAW Landshut**