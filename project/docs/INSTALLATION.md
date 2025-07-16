# HAW Landshut - Digitales Antragsmanagement-System
## Installations- und Betriebsanleitung

### 📋 Systemanforderungen

#### Mindestanforderungen
- **Node.js**: Version 18.0 oder höher
- **npm**: Version 8.0 oder höher
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Arbeitsspeicher**: 4 GB RAM
- **Festplatte**: 500 MB freier Speicherplatz

#### Empfohlene Systemkonfiguration
- **Node.js**: Version 20.0 LTS
- **npm**: Version 10.0 oder höher
- **Browser**: Aktuelle Versionen
- **Arbeitsspeicher**: 8 GB RAM
- **Festplatte**: 2 GB freier Speicherplatz

### 🚀 Installation

#### 1. Abhängigkeiten installieren
```bash
npm install
```

#### 2. Umgebungsvariablen konfigurieren
```bash
cp .env.example .env
```

Bearbeiten Sie die `.env` Datei:
```env
# Supabase Konfiguration (optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Für lokale Entwicklung können diese Werte leer bleiben
# Die Anwendung läuft dann im Demo-Modus
```

#### 3. Entwicklungsserver starten
```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:5173` verfügbar.

### 🗄️ Datenbank-Setup

#### Option 1: Demo-Modus (Empfohlen für Tests)
Ohne Supabase-Konfiguration läuft die Anwendung automatisch im Demo-Modus mit:
- 20 Beispielbenutzern (10 Studenten, 10 Mitarbeiter)
- Lokaler Datenspeicherung im Browser
- Vollständige Funktionalität ohne externe Abhängigkeiten

#### Option 2: Supabase (Produktionsumgebung)

1. **Supabase-Projekt erstellen**
   - Besuchen Sie [supabase.com](https://supabase.com)
   - Erstellen Sie ein neues Projekt
   - Notieren Sie sich URL und anon key

2. **Datenbank-Schema einrichten**
   ```sql
   -- Führen Sie das SQL aus supabase/migrations/20250704093418_pink_hall.sql aus
   -- Dies erstellt alle notwendigen Tabellen und Beispieldaten
   ```

3. **Umgebungsvariablen setzen**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 👥 Benutzerkonten

#### Demo-Benutzer (Studenten)
| E-Mail | Passwort | Studiengang | Semester |
|--------|----------|-------------|----------|
| s-maxmustermann@haw-landshut.de | pass120 | Informatik | 3 |
| s-annaschmidt@haw-landshut.de | pass121 | Betriebswirtschaft | 5 |
| s-tomweber@haw-landshut.de | pass122 | Maschinenbau | 1 |
| s-lisamueller@haw-landshut.de | pass123 | Soziale Arbeit | 7 |
| s-davidfischer@haw-landshut.de | pass124 | Elektrotechnik | 2 |

#### Demo-Benutzer (Mitarbeiter)
| E-Mail | Passwort | Abteilung |
|--------|----------|-----------|
| m-martinschneider@haw-landshut.de | admin120 | Informatik |
| m-petralang@haw-landshut.de | admin121 | Betriebswirtschaft |
| m-thomasgross@haw-landshut.de | admin122 | Maschinenbau |
| m-mariahuber@haw-landshut.de | admin123 | Soziale Arbeit |
| m-andreaswolf@haw-landshut.de | admin124 | Elektrotechnik |

### 🏗️ Build und Deployment

#### Entwicklung
```bash
npm run dev          # Entwicklungsserver starten
npm run lint         # Code-Qualität prüfen
npm test            # Tests ausführen
```

#### Produktion
```bash
npm run build       # Produktions-Build erstellen
npm run preview     # Build-Vorschau anzeigen
```

#### Deployment-Optionen

**1. Netlify (Empfohlen)**
```bash
# Build-Ordner: dist
# Build-Befehl: npm run build
# Node-Version: 18
```

**2. Vercel**
```bash
vercel --prod
```

**3. Traditioneller Webserver**
```bash
npm run build
# Kopieren Sie den 'dist' Ordner auf Ihren Webserver
```

### 🔧 Konfiguration

#### Anwendungseinstellungen
Die Hauptkonfiguration erfolgt über:
- `src/types/index.ts` - TypeScript-Interfaces
- `src/data/applicationTemplates.ts` - Antragstypen
- `src/data/userDatabase.ts` - Benutzerdatenbank
- `src/services/` - Business-Logic

#### Antragstypen anpassen
```typescript
// src/data/applicationTemplates.ts
export const applicationTemplates: ApplicationTemplate[] = [
  {
    type: 'custom_application',
    title: 'Benutzerdefinierter Antrag',
    description: 'Beschreibung des Antrags',
    icon: '📝',
    color: 'blue',
    category: 'student',
    estimatedProcessingTime: '5-7 Werktage',
    requiredDocuments: ['Dokument 1', 'Dokument 2'],
    fields: [
      {
        id: 'field1',
        type: 'text',
        label: 'Feldname',
        required: true
      }
    ]
  }
];
```

### 🔐 Sicherheit

#### Authentifizierung
- JWT-basierte Session-Verwaltung
- Sichere Passwort-Hashing (in Produktionsumgebung)
- Automatische Session-Ablauf

#### Autorisierung
- Rollenbasierte Zugriffskontrolle
- Route-Guards für geschützte Bereiche
- Datenfilterung nach Benutzerrolle

#### Datenschutz
- DSGVO-konforme Datenverarbeitung
- Sichere Datenübertragung (HTTPS)
- Minimale Datensammlung

### 📊 Monitoring und Wartung

#### Logs
```bash
# Entwicklung
npm run dev -- --debug

# Produktion
# Logs werden in der Browser-Konsole angezeigt
```

#### Performance-Monitoring
- Lighthouse-Scores regelmäßig prüfen
- Bundle-Größe überwachen
- Ladezeiten messen

#### Backup
```bash
# Datenbank-Export (Demo-Modus)
# Daten werden im localStorage gespeichert

# Supabase-Backup
# Automatische Backups über Supabase-Dashboard
```

### 🐛 Fehlerbehebung

#### Häufige Probleme

**1. Anwendung startet nicht**
```bash
# Node.js-Version prüfen
node --version  # Sollte >= 18.0 sein

# Cache leeren
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**2. Build-Fehler**
```bash
# TypeScript-Fehler beheben
npm run lint
npm run build -- --mode development
```

**3. Supabase-Verbindungsprobleme**
```bash
# Umgebungsvariablen prüfen
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Fallback auf Demo-Modus
# Entfernen Sie die Supabase-Variablen aus .env
```

**4. Performance-Probleme**
```bash
# Bundle-Analyse
npm run build -- --analyze

# Lighthouse-Audit
npx lighthouse http://localhost:5173
```

#### Debug-Modus
```bash
# Entwicklung mit Debug-Informationen
npm run dev -- --debug

# Browser-Konsole öffnen (F12)
# Network-Tab für API-Calls prüfen
```

### 📱 Browser-Kompatibilität

#### Unterstützte Browser
| Browser | Mindestversion | Empfohlene Version |
|---------|----------------|-------------------|
| Chrome | 90 | Aktuell |
| Firefox | 88 | Aktuell |
| Safari | 14 | Aktuell |
| Edge | 90 | Aktuell |

#### Mobile Browser
| Plattform | Browser | Version |
|-----------|---------|---------|
| iOS | Safari | 14+ |
| Android | Chrome | 90+ |

### 🔄 Updates und Wartung

#### Regelmäßige Wartung
```bash
# Abhängigkeiten aktualisieren
npm update

# Sicherheitsupdates
npm audit fix

# Node.js aktualisieren
# Verwenden Sie nvm oder ähnliche Tools
```

#### Version-Updates
```bash
# Abhängigkeiten aktualisieren
npm install
npm run build
# Deploy auf Produktionsserver
```

### 📞 Support und Hilfe

#### Technischer Support
- **E-Mail**: support@haw-landshut.de
- **Dokumentation**: `/docs` Ordner
- **Issue-Tracker**: Interne Ticketsystem

#### Entwickler-Ressourcen
- **API-Dokumentation**: `src/services/`
- **Komponenten-Guide**: `src/components/`
- **Test-Dokumentation**: `test-plan/`

#### Community
- **Interne Entwickler-Gruppe**: HAW Landshut IT-Team
- **Code-Reviews**: Interne Review-Prozesse
- **Schulungen**: Auf Anfrage verfügbar

### 📋 Checkliste für Produktionsdeployment

#### Vor dem Deployment
- [ ] Alle Tests erfolgreich
- [ ] Code-Review abgeschlossen
- [ ] Sicherheitsaudit durchgeführt
- [ ] Performance-Tests bestanden
- [ ] Backup erstellt

#### Deployment
- [ ] Umgebungsvariablen konfiguriert
- [ ] HTTPS aktiviert
- [ ] CDN konfiguriert (optional)
- [ ] Monitoring eingerichtet
- [ ] Fehlerbehandlung getestet

#### Nach dem Deployment
- [ ] Funktionalität getestet
- [ ] Performance überwacht
- [ ] Logs überprüft
- [ ] Benutzer-Feedback gesammelt
- [ ] Dokumentation aktualisiert

Diese Anleitung bietet eine vollständige Übersicht über Installation, Konfiguration und Betrieb des HAW Landshut Digitalen Antragsmanagement-Systems.