// User Database - Vanilla JavaScript Version
class UserDatabase {
    constructor() {
        this.users = [];
        this.initializeUsers();
    }

    initializeUsers() {
        // Beispiel-Benutzer aus der JSON-Datei
        const userModelData = [
            {
                "Vollständiger Name": "Max Mustermann",
                "Fachbereich": "Informatik",
                "Semester": 3.0,
                "E-Mail": "s-maxmustermann@haw-landshut.de",
                "Passwort": "pass120",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Anna Schmidt",
                "Fachbereich": "Betriebswirtschaft",
                "Semester": 5.0,
                "E-Mail": "s-annaschmidt@haw-landshut.de",
                "Passwort": "pass121",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Tom Weber",
                "Fachbereich": "Maschinenbau",
                "Semester": 1.0,
                "E-Mail": "s-tomweber@haw-landshut.de",
                "Passwort": "pass122",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Lisa Müller",
                "Fachbereich": "Soziale Arbeit",
                "Semester": 7.0,
                "E-Mail": "s-lisamueller@haw-landshut.de",
                "Passwort": "pass123",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "David Fischer",
                "Fachbereich": "Elektrotechnik",
                "Semester": 2.0,
                "E-Mail": "s-davidfischer@haw-landshut.de",
                "Passwort": "pass124",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Sarah Wagner",
                "Fachbereich": "Architektur",
                "Semester": 4.0,
                "E-Mail": "s-sarahwagner@haw-landshut.de",
                "Passwort": "pass125",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Michael Bauer",
                "Fachbereich": "Wirtschaftsingenieurwesen",
                "Semester": 6.0,
                "E-Mail": "s-michaelbauer@haw-landshut.de",
                "Passwort": "pass126",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Julia Hoffmann",
                "Fachbereich": "Medieninformatik",
                "Semester": 3.0,
                "E-Mail": "s-juliahoffmann@haw-landshut.de",
                "Passwort": "pass127",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Felix Richter",
                "Fachbereich": "Umwelttechnik",
                "Semester": 1.0,
                "E-Mail": "s-felixrichter@haw-landshut.de",
                "Passwort": "pass128",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Nina Klein",
                "Fachbereich": "International Business",
                "Semester": 5.0,
                "E-Mail": "s-ninaklein@haw-landshut.de",
                "Passwort": "pass129",
                "Rolle": "Student"
            },
            {
                "Vollständiger Name": "Prof. Dr. Martin Schneider",
                "Fachbereich": "Informatik",
                "Semester": null,
                "E-Mail": "m-martinschneider@haw-landshut.de",
                "Passwort": "admin120",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Dr. Petra Lang",
                "Fachbereich": "Betriebswirtschaft",
                "Semester": null,
                "E-Mail": "m-petralang@haw-landshut.de",
                "Passwort": "admin121",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Thomas Groß",
                "Fachbereich": "Maschinenbau",
                "Semester": null,
                "E-Mail": "m-thomasgross@haw-landshut.de",
                "Passwort": "admin122",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Prof. Maria Huber",
                "Fachbereich": "Soziale Arbeit",
                "Semester": null,
                "E-Mail": "m-mariahuber@haw-landshut.de",
                "Passwort": "admin123",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Dr. Andreas Wolf",
                "Fachbereich": "Elektrotechnik",
                "Semester": null,
                "E-Mail": "m-andreaswolf@haw-landshut.de",
                "Passwort": "admin124",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Sabine Koch",
                "Fachbereich": "Verwaltung",
                "Semester": null,
                "E-Mail": "m-sabinekoch@haw-landshut.de",
                "Passwort": "admin125",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Prof. Dr. Robert Mayer",
                "Fachbereich": "Architektur",
                "Semester": null,
                "E-Mail": "m-robertmayer@haw-landshut.de",
                "Passwort": "admin126",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Claudia Zimmermann",
                "Fachbereich": "Bibliothek",
                "Semester": null,
                "E-Mail": "m-claudiazimmermann@haw-landshut.de",
                "Passwort": "admin127",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Dr. Frank Schulz",
                "Fachbereich": "Forschung",
                "Semester": null,
                "E-Mail": "m-frankschulz@haw-landshut.de",
                "Passwort": "admin128",
                "Rolle": "Mitarbeiter"
            },
            {
                "Vollständiger Name": "Monika Braun",
                "Fachbereich": "Studierendensekretariat",
                "Semester": null,
                "E-Mail": "m-monikabraun@haw-landshut.de",
                "Passwort": "admin129",
                "Rolle": "Mitarbeiter"
            }
        ];

        // Konvertiere JSON-Daten in User-Objekte
        this.users = userModelData.map((userData, index) => ({
            id: `user_${index + 1}`,
            email: userData['E-Mail'],
            password: userData.Passwort,
            fullName: userData['Vollständiger Name'],
            name: userData['Vollständiger Name'], // Für Kompatibilität
            department: userData.Fachbereich,
            semester: userData.Semester || undefined,
            role: userData.Rolle,
            isActive: true,
            createdAt: new Date('2024-01-01'),
            lastLogin: undefined,
            phone: undefined,
            address: undefined
        }));
    }

    getAllUsers() {
        return [...this.users];
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    getUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    getUsersByRole(role) {
        return this.users.filter(user => user.role === role);
    }

    getUsersByDepartment(department) {
        return this.users.filter(user => user.department === department);
    }

    updateUser(id, updates) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) return false;

        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        return true;
    }

    createUser(userData) {
        const newUser = {
            ...userData,
            id: `user_${Date.now()}`,
            createdAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) return false;

        this.users.splice(userIndex, 1);
        return true;
    }

    searchUsers(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.users.filter(user =>
            user.fullName.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.department.toLowerCase().includes(term)
        );
    }

    getActiveUsers() {
        return this.users.filter(user => user.isActive);
    }

    getDepartments() {
        const departments = new Set(this.users.map(user => user.department));
        return Array.from(departments).sort();
    }

    getUserStats() {
        const stats = {
            total: this.users.length,
            students: this.users.filter(u => u.role === 'Student').length,
            employees: this.users.filter(u => u.role === 'Mitarbeiter').length,
            active: this.users.filter(u => u.isActive).length,
            inactive: this.users.filter(u => !u.isActive).length,
            byDepartment: {}
        };

        // Count by department
        this.users.forEach(user => {
            stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1;
        });

        return stats;
    }
}

// Global instance
const userDatabase = new UserDatabase();