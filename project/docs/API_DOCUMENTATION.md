# API-Dokumentation - HAW Landshut Antragsmanagement-System

## Übersicht

Das HAW Landshut Antragsmanagement-System verwendet eine modulare Service-Architektur mit TypeScript-Interfaces und lokaler Datenverwaltung. Diese Dokumentation beschreibt alle verfügbaren Services, Methoden und Datenstrukturen.

## Inhaltsverzeichnis

1. [Authentifizierung](#authentifizierung)
2. [Antragsverwaltung](#antragsverwaltung)
3. [Benutzerverwaltung](#benutzerverwaltung)
4. [Datentypen](#datentypen)
5. [Fehlerbehandlung](#fehlerbehandlung)
6. [Beispiele](#beispiele)

---

## Authentifizierung

### AuthService

Der `AuthService` verwaltet Benutzeranmeldung, Session-Management und Passwort-Funktionen.

#### Methoden

##### `login(email: string, password: string)`
Meldet einen Benutzer an und erstellt eine Session.

**Parameter:**
- `email` (string): E-Mail-Adresse des Benutzers
- `password` (string): Passwort des Benutzers

**Rückgabe:**
```typescript
Promise<{
  success: boolean;
  user?: User;
  error?: string;
}>
```

**Beispiel:**
```typescript
const { success, user, error } = await AuthService.login(
  's-maxmustermann@haw-landshut.de',
  'pass120'
);

if (success) {
  console.log('Anmeldung erfolgreich:', user);
} else {
  console.error('Anmeldefehler:', error);
}
```

##### `logout()`
Meldet den aktuellen Benutzer ab und löscht die Session.

**Beispiel:**
```typescript
AuthService.logout();
```

##### `getCurrentUser()`
Gibt den aktuell angemeldeten Benutzer zurück.

**Rückgabe:**
```typescript
User | null
```

**Beispiel:**
```typescript
const currentUser = AuthService.getCurrentUser();
if (currentUser) {
  console.log('Aktueller Benutzer:', currentUser.fullName);
}
```

##### `isAuthenticated()`
Prüft, ob ein Benutzer angemeldet ist.

**Rückgabe:**
```typescript
boolean
```

##### `resetPassword(email: string)`
Initiiert einen Passwort-Reset für die angegebene E-Mail-Adresse.

**Parameter:**
- `email` (string): E-Mail-Adresse für den Reset

**Rückgabe:**
```typescript
Promise<{
  success: boolean;
  error?: string;
}>
```

##### `changePassword(currentPassword: string, newPassword: string)`
Ändert das Passwort des aktuell angemeldeten Benutzers.

**Parameter:**
- `currentPassword` (string): Aktuelles Passwort
- `newPassword` (string): Neues Passwort

**Rückgabe:**
```typescript
Promise<{
  success: boolean;
  error?: string;
}>
```

---

## Antragsverwaltung

### ApplicationService

Der `ApplicationService` verwaltet alle Antrags-bezogenen Operationen.

#### Methoden

##### `createApplication(applicationData)`
Erstellt einen neuen Antrag.

**Parameter:**
```typescript
applicationData: Omit<Application, 'id' | 'submittedAt' | 'updatedAt' | 'comments' | 'attachments'>
```

**Rückgabe:**
```typescript
Application
```

**Beispiel:**
```typescript
const newApplication = applicationService.createApplication({
  userId: 'user_1',
  type: 'studentenausweis',
  title: 'Neuer Studentenausweis',
  description: 'Verlust des alten Ausweises',
  status: 'submitted',
  priority: 'medium',
  formData: {
    reason: 'Verlust',
    lostDate: '2024-01-15'
  },
  isDraft: false
});
```

##### `getApplicationById(id: string)`
Ruft einen Antrag anhand seiner ID ab.

**Parameter:**
- `id` (string): Eindeutige Antrags-ID

**Rückgabe:**
```typescript
Application | undefined
```

##### `updateApplication(id: string, updates: Partial<Application>)`
Aktualisiert einen bestehenden Antrag.

**Parameter:**
- `id` (string): Antrags-ID
- `updates` (Partial<Application>): Zu aktualisierende Felder

**Rückgabe:**
```typescript
Application | null
```

##### `deleteApplication(id: string)`
Löscht einen Antrag.

**Parameter:**
- `id` (string): Antrags-ID

**Rückgabe:**
```typescript
boolean
```

##### `getApplications(userId?, filters?, sort?, limit?, offset?)`
Ruft Anträge mit optionaler Filterung und Sortierung ab.

**Parameter:**
- `userId` (string, optional): Benutzer-ID für Filterung
- `filters` (FilterOptions, optional): Filterkriterien
- `sort` (SortOptions, optional): Sortierkriterien
- `limit` (number, optional): Maximale Anzahl Ergebnisse
- `offset` (number, optional): Offset für Paginierung

**Rückgabe:**
```typescript
{
  applications: Application[];
  total: number;
}
```

**Beispiel:**
```typescript
const { applications, total } = applicationService.getApplications(
  'user_1',
  {
    status: ['submitted', 'in_review'],
    type: ['studentenausweis'],
    searchTerm: 'ausweis'
  },
  {
    field: 'submittedAt',
    direction: 'desc'
  },
  10,
  0
);
```

##### `getDashboardStats(userId?: string)`
Ruft Dashboard-Statistiken ab.

**Parameter:**
- `userId` (string, optional): Benutzer-ID für benutzerspezifische Statistiken

**Rückgabe:**
```typescript
DashboardStats
```

##### `updateApplicationStatus(id, status, reviewerId?, comment?)`
Aktualisiert den Status eines Antrags.

**Parameter:**
- `id` (string): Antrags-ID
- `status` (ApplicationStatus): Neuer Status
- `reviewerId` (string, optional): ID des Bearbeiters
- `comment` (string, optional): Kommentar zur Statusänderung

**Rückgabe:**
```typescript
Application | null
```

##### `batchUpdateStatus(applicationIds, status, reviewerId?)`
Aktualisiert den Status mehrerer Anträge gleichzeitig.

**Parameter:**
- `applicationIds` (string[]): Array von Antrags-IDs
- `status` (ApplicationStatus): Neuer Status
- `reviewerId` (string, optional): ID des Bearbeiters

**Rückgabe:**
```typescript
number // Anzahl erfolgreich aktualisierter Anträge
```

##### `addComment(applicationId, userId, userName, content, isInternal?)`
Fügt einen Kommentar zu einem Antrag hinzu.

**Parameter:**
- `applicationId` (string): Antrags-ID
- `userId` (string): Benutzer-ID des Kommentators
- `userName` (string): Name des Kommentators
- `content` (string): Kommentarinhalt
- `isInternal` (boolean, optional): Ob der Kommentar intern ist

**Rückgabe:**
```typescript
boolean
```

##### `saveDraft(applicationData)`
Speichert einen Antrag als Entwurf.

**Parameter:**
```typescript
applicationData: Partial<Application>
```

**Rückgabe:**
```typescript
Application
```

##### `submitDraft(id: string)`
Reicht einen Entwurf als finalen Antrag ein.

**Parameter:**
- `id` (string): Entwurfs-ID

**Rückgabe:**
```typescript
Application | null
```

---

## Benutzerverwaltung

### UserDatabase

Die `UserDatabase` Klasse verwaltet alle Benutzer-bezogenen Datenoperationen.

#### Methoden

##### `getAllUsers()`
Ruft alle Benutzer ab.

**Rückgabe:**
```typescript
User[]
```

##### `getUserById(id: string)`
Ruft einen Benutzer anhand seiner ID ab.

**Parameter:**
- `id` (string): Benutzer-ID

**Rückgabe:**
```typescript
User | undefined
```

##### `getUserByEmail(email: string)`
Ruft einen Benutzer anhand seiner E-Mail-Adresse ab.

**Parameter:**
- `email` (string): E-Mail-Adresse

**Rückgabe:**
```typescript
User | undefined
```

##### `getUsersByRole(role: 'Student' | 'Mitarbeiter')`
Ruft alle Benutzer einer bestimmten Rolle ab.

**Parameter:**
- `role` ('Student' | 'Mitarbeiter'): Benutzerrolle

**Rückgabe:**
```typescript
User[]
```

##### `updateUser(id: string, updates: Partial<User>)`
Aktualisiert einen Benutzer.

**Parameter:**
- `id` (string): Benutzer-ID
- `updates` (Partial<User>): Zu aktualisierende Felder

**Rückgabe:**
```typescript
boolean
```

##### `createUser(userData)`
Erstellt einen neuen Benutzer.

**Parameter:**
```typescript
userData: Omit<User, 'id' | 'createdAt'>
```

**Rückgabe:**
```typescript
User
```

##### `searchUsers(searchTerm: string)`
Sucht Benutzer anhand eines Suchbegriffs.

**Parameter:**
- `searchTerm` (string): Suchbegriff

**Rückgabe:**
```typescript
User[]
```

##### `getUserStats()`
Ruft Benutzerstatistiken ab.

**Rückgabe:**
```typescript
{
  total: number;
  students: number;
  employees: number;
  active: number;
  inactive: number;
  byDepartment: Record<string, number>;
}
```

---

## Datentypen

### User
```typescript
interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  department: string;
  semester?: number;
  role: 'Student' | 'Mitarbeiter';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}
```

### Application
```typescript
interface Application {
  id: string;
  userId: string;
  type: ApplicationType;
  title: string;
  description: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  submittedAt: Date;
  updatedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  comments: ApplicationComment[];
  attachments: ApplicationAttachment[];
  formData: Record<string, any>;
  isDraft: boolean;
}
```

### ApplicationStatus
```typescript
type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'additional_info_required'
  | 'approved'
  | 'rejected'
  | 'cancelled';
```

### ApplicationType
```typescript
type ApplicationType = 
  | 'studentenausweis'
  | 'urlaubssemester'
  | 'auslandssemester'
  | 'modulanerkennung'
  | 'praktikumanerkennung'
  | 'stipendium';
```

### ApplicationPriority
```typescript
type ApplicationPriority = 'low' | 'medium' | 'high' | 'urgent';
```

### ApplicationComment
```typescript
interface ApplicationComment {
  id: string;
  applicationId: string;
  userId: string;
  userName: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
}
```

### FilterOptions
```typescript
interface FilterOptions {
  status?: ApplicationStatus[];
  type?: ApplicationType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: ApplicationPriority[];
  department?: string[];
  searchTerm?: string;
}
```

### SortOptions
```typescript
interface SortOptions {
  field: 'submittedAt' | 'updatedAt' | 'status' | 'priority' | 'type';
  direction: 'asc' | 'desc';
}
```

### DashboardStats
```typescript
interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  draftApplications: number;
  averageProcessingTime: number;
  recentActivity: ActivityItem[];
}
```

---

## Fehlerbehandlung

### Allgemeine Fehlerbehandlung

Alle Service-Methoden verwenden ein konsistentes Fehlerbehandlungsschema:

```typescript
// Erfolgreiche Operationen
{
  success: true,
  data?: any,
  user?: User
}

// Fehlgeschlagene Operationen
{
  success: false,
  error: string
}
```

### Häufige Fehlercodes

| Fehlercode | Beschreibung | Lösung |
|------------|--------------|---------|
| `USER_NOT_FOUND` | Benutzer nicht gefunden | E-Mail-Adresse prüfen |
| `INVALID_PASSWORD` | Ungültiges Passwort | Passwort prüfen |
| `NOT_AUTHENTICATED` | Nicht angemeldet | Erneut anmelden |
| `APPLICATION_NOT_FOUND` | Antrag nicht gefunden | Antrags-ID prüfen |
| `PERMISSION_DENIED` | Keine Berechtigung | Benutzerrolle prüfen |
| `VALIDATION_ERROR` | Validierungsfehler | Eingabedaten prüfen |

### Beispiel Fehlerbehandlung

```typescript
try {
  const { success, user, error } = await AuthService.login(email, password);
  
  if (!success) {
    switch (error) {
      case 'USER_NOT_FOUND':
        showMessage('Benutzer nicht gefunden', 'error');
        break;
      case 'INVALID_PASSWORD':
        showMessage('Ungültiges Passwort', 'error');
        break;
      default:
        showMessage('Anmeldefehler', 'error');
    }
    return;
  }
  
  // Erfolgreiche Anmeldung
  setCurrentUser(user);
} catch (error) {
  console.error('Unerwarteter Fehler:', error);
  showMessage('Ein unerwarteter Fehler ist aufgetreten', 'error');
}
```

---

## Beispiele

### Vollständiger Antragsworkflow

```typescript
// 1. Benutzer anmelden
const { success, user } = await AuthService.login(
  's-maxmustermann@haw-landshut.de',
  'pass120'
);

if (!success) return;

// 2. Neuen Antrag erstellen
const application = applicationService.createApplication({
  userId: user.id,
  type: 'studentenausweis',
  title: 'Neuer Studentenausweis',
  description: 'Verlust des alten Ausweises',
  status: 'submitted',
  priority: 'medium',
  formData: {
    reason: 'Verlust',
    lostDate: '2024-01-15',
    policeReport: true
  },
  isDraft: false
});

// 3. Kommentar hinzufügen
applicationService.addComment(
  application.id,
  user.id,
  user.fullName,
  'Polizeiliche Verlustanzeige wurde erstattet',
  false
);

// 4. Status aktualisieren (als Mitarbeiter)
applicationService.updateApplicationStatus(
  application.id,
  'approved',
  'employee_id',
  'Antrag genehmigt - neuer Ausweis wird erstellt'
);
```

### Dashboard-Daten laden

```typescript
// Benutzer-spezifische Statistiken
const userStats = applicationService.getDashboardStats(user.id);

// Aktuelle Anträge abrufen
const { applications } = applicationService.getApplications(
  user.id,
  {
    status: ['submitted', 'in_review']
  },
  {
    field: 'submittedAt',
    direction: 'desc'
  },
  5
);

console.log('Statistiken:', userStats);
console.log('Aktuelle Anträge:', applications);
```

### Erweiterte Suche und Filterung

```typescript
// Komplexe Filterung für Mitarbeiter-Dashboard
const { applications, total } = applicationService.getApplications(
  undefined, // Alle Benutzer
  {
    status: ['submitted', 'in_review'],
    priority: ['high', 'urgent'],
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-12-31')
    },
    searchTerm: 'studentenausweis'
  },
  {
    field: 'priority',
    direction: 'desc'
  },
  20,
  0
);

console.log(`${applications.length} von ${total} Anträgen gefunden`);
```

### Batch-Operationen

```typescript
// Mehrere Anträge gleichzeitig genehmigen
const applicationIds = ['app_1', 'app_2', 'app_3'];
const updatedCount =  applicationService.batchUpdateStatus(
  applicationIds,
  'approved',
  'employee_id'
);

console.log(`${updatedCount} Anträge genehmigt`);
```

---

## Performance-Optimierung

### Caching
```typescript
// Benutzer-Cache für bessere Performance
const userCache = new Map<string, User>();

const getCachedUser = (id: string): User | undefined => {
  if (userCache.has(id)) {
    return userCache.get(id);
  }
  
  const user = userDatabase.getUserById(id);
  if (user) {
    userCache.set(id, user);
  }
  
  return user;
};
```

### Paginierung
```typescript
// Effiziente Paginierung für große Datenmengen
const pageSize = 20;
const currentPage = 1;

const { applications, total } = applicationService.getApplications(
  undefined,
  filters,
  sort,
  pageSize,
  (currentPage - 1) * pageSize
);

const totalPages = Math.ceil(total / pageSize);
```

### Debouncing für Suche
```typescript
// Verzögerte Suche für bessere Performance
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const debouncedSearch = debounce((searchTerm: string) => {
  const results = applicationService.getApplications(
    undefined,
    { searchTerm },
    undefined,
    10
  );
  setSearchResults(results.applications);
}, 300);
```

Diese API-Dokumentation bietet eine vollständige Übersicht über alle verfügbaren Services und Methoden des HAW Landshut Antragsmanagement-Systems.