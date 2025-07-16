/*
  # HAW Landshut Portal - Benutzer Datenbank

  1. Neue Tabellen
    - `haw_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text: 'student' oder 'employee')
      - `student_id` (text, optional für Studenten)
      - `employee_id` (text, optional für Mitarbeiter)
      - `department` (text, optional)
      - `semester` (integer, optional für Studenten)
      - `study_program` (text, optional für Studenten)
      - `phone` (text, optional)
      - `address` (text, optional)
      - `is_active` (boolean, default true)
      - `last_login` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sicherheit
    - Enable RLS auf `haw_users` Tabelle
    - Add policy für authentifizierte Benutzer um ihre eigenen Daten zu lesen
    - Add policy für Administratoren um alle Daten zu verwalten

  3. Beispieldaten
    - 10 Studenten mit realistischen Daten
    - 10 Mitarbeiter mit verschiedenen Abteilungen
*/

-- Erstelle die Haupttabelle für HAW Benutzer
CREATE TABLE IF NOT EXISTS haw_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'employee')),
  student_id text,
  employee_id text,
  department text,
  semester integer,
  study_program text,
  phone text,
  address text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE haw_users ENABLE ROW LEVEL SECURITY;

-- Policy: Benutzer können ihre eigenen Daten lesen und bearbeiten
CREATE POLICY "Users can read own data"
  ON haw_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON haw_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Administratoren können alle Daten verwalten (später implementieren)
CREATE POLICY "Admins can manage all users"
  ON haw_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM haw_users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Erstelle Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_haw_users_email ON haw_users(email);
CREATE INDEX IF NOT EXISTS idx_haw_users_role ON haw_users(role);
CREATE INDEX IF NOT EXISTS idx_haw_users_student_id ON haw_users(student_id);
CREATE INDEX IF NOT EXISTS idx_haw_users_employee_id ON haw_users(employee_id);

-- Trigger für updated_at Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_haw_users_updated_at 
  BEFORE UPDATE ON haw_users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Beispieldaten: 10 Studenten
INSERT INTO haw_users (
  email, password_hash, first_name, last_name, role, student_id, 
  semester, study_program, phone, address
) VALUES
  ('max.mustermann@student.haw-landshut.de', '$2b$10$example_hash_1', 'Max', 'Mustermann', 'student', 'S2024001', 3, 'Informatik', '+49 871 123456', 'Musterstraße 1, 84028 Landshut'),
  ('anna.schmidt@student.haw-landshut.de', '$2b$10$example_hash_2', 'Anna', 'Schmidt', 'student', 'S2024002', 5, 'Betriebswirtschaft', '+49 871 234567', 'Hauptstraße 15, 84028 Landshut'),
  ('tom.weber@student.haw-landshut.de', '$2b$10$example_hash_3', 'Tom', 'Weber', 'student', 'S2024003', 1, 'Maschinenbau', '+49 871 345678', 'Bahnhofstraße 22, 84028 Landshut'),
  ('lisa.mueller@student.haw-landshut.de', '$2b$10$example_hash_4', 'Lisa', 'Müller', 'student', 'S2024004', 7, 'Soziale Arbeit', '+49 871 456789', 'Ringstraße 8, 84028 Landshut'),
  ('david.fischer@student.haw-landshut.de', '$2b$10$example_hash_5', 'David', 'Fischer', 'student', 'S2024005', 2, 'Elektrotechnik', '+49 871 567890', 'Parkstraße 33, 84028 Landshut'),
  ('sarah.wagner@student.haw-landshut.de', '$2b$10$example_hash_6', 'Sarah', 'Wagner', 'student', 'S2024006', 4, 'Architektur', '+49 871 678901', 'Gartenstraße 12, 84028 Landshut'),
  ('michael.bauer@student.haw-landshut.de', '$2b$10$example_hash_7', 'Michael', 'Bauer', 'student', 'S2024007', 6, 'Wirtschaftsingenieurwesen', '+49 871 789012', 'Schulstraße 7, 84028 Landshut'),
  ('julia.hoffmann@student.haw-landshut.de', '$2b$10$example_hash_8', 'Julia', 'Hoffmann', 'student', 'S2024008', 3, 'Medieninformatik', '+49 871 890123', 'Kirchenstraße 19, 84028 Landshut'),
  ('felix.richter@student.haw-landshut.de', '$2b$10$example_hash_9', 'Felix', 'Richter', 'student', 'S2024009', 1, 'Umwelttechnik', '+49 871 901234', 'Waldstraße 25, 84028 Landshut'),
  ('nina.klein@student.haw-landshut.de', '$2b$10$example_hash_10', 'Nina', 'Klein', 'student', 'S2024010', 5, 'International Business', '+49 871 012345', 'Seestraße 14, 84028 Landshut');

-- Beispieldaten: 10 Mitarbeiter
INSERT INTO haw_users (
  email, password_hash, first_name, last_name, role, employee_id, 
  department, phone, address
) VALUES
  ('prof.dr.martin@haw-landshut.de', '$2b$10$example_hash_11', 'Prof. Dr. Martin', 'Schneider', 'employee', 'E2024001', 'Informatik', '+49 871 506-101', 'Professorenweg 5, 84028 Landshut'),
  ('dr.petra.lang@haw-landshut.de', '$2b$10$example_hash_12', 'Dr. Petra', 'Lang', 'employee', 'E2024002', 'Betriebswirtschaft', '+49 871 506-102', 'Universitätsstraße 12, 84028 Landshut'),
  ('thomas.gross@haw-landshut.de', '$2b$10$example_hash_13', 'Thomas', 'Groß', 'employee', 'E2024003', 'Maschinenbau', '+49 871 506-103', 'Technikstraße 8, 84028 Landshut'),
  ('prof.maria.huber@haw-landshut.de', '$2b$10$example_hash_14', 'Prof. Maria', 'Huber', 'employee', 'E2024004', 'Soziale Arbeit', '+49 871 506-104', 'Sozialstraße 20, 84028 Landshut'),
  ('dr.andreas.wolf@haw-landshut.de', '$2b$10$example_hash_15', 'Dr. Andreas', 'Wolf', 'employee', 'E2024005', 'Elektrotechnik', '+49 871 506-105', 'Elektronikweg 3, 84028 Landshut'),
  ('sabine.koch@haw-landshut.de', '$2b$10$example_hash_16', 'Sabine', 'Koch', 'employee', 'E2024006', 'Verwaltung', '+49 871 506-106', 'Verwaltungsstraße 1, 84028 Landshut'),
  ('prof.dr.robert.mayer@haw-landshut.de', '$2b$10$example_hash_17', 'Prof. Dr. Robert', 'Mayer', 'employee', 'E2024007', 'Architektur', '+49 871 506-107', 'Baumeisterstraße 16, 84028 Landshut'),
  ('claudia.zimmermann@haw-landshut.de', '$2b$10$example_hash_18', 'Claudia', 'Zimmermann', 'employee', 'E2024008', 'Bibliothek', '+49 871 506-108', 'Bibliotheksplatz 2, 84028 Landshut'),
  ('dr.frank.schulz@haw-landshut.de', '$2b$10$example_hash_19', 'Dr. Frank', 'Schulz', 'employee', 'E2024009', 'Forschung', '+49 871 506-109', 'Forschungsallee 9, 84028 Landshut'),
  ('monika.braun@haw-landshut.de', '$2b$10$example_hash_20', 'Monika', 'Braun', 'employee', 'E2024010', 'Studierendensekretariat', '+49 871 506-110', 'Sekretariatsweg 4, 84028 Landshut');