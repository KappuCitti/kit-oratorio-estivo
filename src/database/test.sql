/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */

-- DATI DI PROVA per lo sviluppo.
--
-- NON contiene `USE <database>`: si esegue sul database gia' selezionato.
-- La versione precedente forzava `USE oratorio;`, quindi girava sempre sul
-- database di produzione anche quando se ne era scelto un altro - e bastava
-- che il file fallisse a meta' per lasciare righe di prova nei dati veri.
--
--   mysql -u root <nome_database> < src/database/test.sql
--
-- Presuppone che lo schema sia gia' stato applicato:
--   cd src/server && bun run db:migrate

-- Addresses
INSERT INTO addresses (street, city, postal_code, country) VALUES
('Via Roma, 10', 'Milano', '20100', 'Italy'),
('Via Milano, 20', 'Roma', '00100', 'Italy'),
('Via Napoli, 30', 'Torino', '10100', 'Italy'),
('Via Firenze, 40', 'Firenze', '50100', 'Italy'),
('Via Venezia, 50', 'Venezia', '30100', 'Italy'),
('Via Bologna, 60', 'Bologna', '40100', 'Italy');

-- Weeks
-- registration_open_date e registration_close_date sono NOT NULL senza default:
-- la vecchia INSERT per il 2024 le ometteva e falliva con "Field ... doesn't
-- have a default value".
INSERT INTO weeks (start_date, end_date, price, max_enrollments, registration_open_date, registration_close_date) VALUES
('2024-06-10', '2024-06-16', 40, 300, '2024-01-01', '2024-12-31'),
('2024-06-17', '2024-06-23', 40, 300, '2024-01-01', '2024-12-31'),
('2024-06-24', '2024-06-30', 40, 300, '2024-01-01', '2024-12-31'),
('2025-06-09', '2025-06-13', 60, 300, '2025-01-01', '2025-12-31'),
('2025-06-16', '2025-06-20', 60, 300, '2025-01-01', '2025-12-31'),
('2025-06-23', '2025-06-27', 60, 300, '2025-01-01', '2025-12-31');

-- Teams
INSERT INTO teams (name, color) VALUES
('Rosso', '#dc3545'),
('Giallo', '#ffc107'),
('Blu', '#0d6efd'),
('Verde', '#198754');

-- T-Shirt sizes
INSERT INTO shirts (size_name, width, height, is_available) VALUES
('Small', 45.0, 65.0, TRUE),
('Medium', 50.0, 70.0, TRUE),
('Large', 55.0, 75.0, TRUE),
('Extra Large', 60.0, 80.0, FALSE);


-- ---------------------------------------------------------------------------
-- DA CONVERTIRE ALLO SCHEMA v2
--
-- Le sezioni qui sotto sono ferme allo schema v1 e referenziano tabelle che
-- non esistono piu': Parent, Child, ChildParent, Enrollment, EnrollmentWeeks,
-- Attendance, ExtraordinaryAttendance, Point. Eseguite com'erano, il file si
-- interrompeva al primo di questi INSERT.
--
-- La conversione non e' una semplice rinomina: nello schema v2 genitori e
-- ragazzi sono entrambi righe di `users` (chiave primaria = codice fiscale,
-- varchar(16)) piu' `personal_info`, e la relazione genitore-figlio vive in
-- `manages(main_id, target_id)`. Servono quindi codici fiscali finti coerenti,
-- e un ruolo per ciascun utente. Le presenze hanno perso le colonne `Present`
-- e `EatsPlain`; `extraordinary_attendances` referenzia `user_id`, non un
-- ChildID; `points` esiste ora in snake_case.
--
-- I dati originali sono conservati qui sotto per facilitare la conversione.
-- ---------------------------------------------------------------------------

/*
INSERT INTO Parent (Name, Surname, Gender, PhoneNumber, Email) VALUES
('Mario', 'Rossi', 'M', '1234567890', 'mario.rossi@example.com'),
('Lucia', 'Verdi', 'F', '0987654321', 'lucia.verdi@example.com'),
('Giovanni', 'Bianchi', 'M', '2233445566', 'giovanni.bianchi@example.com'),
('Anna', 'Neri', 'F', '3344556677', 'anna.neri@example.com'),
('Paolo', 'Gialli', 'M', '4455667788', 'paolo.gialli@example.com'),
('Laura', 'Blu', 'F', '5566778899', 'laura.blu@example.com');

INSERT INTO Child (Name, Surname, Gender, BirthDate, BirthPlace, AddressID) VALUES
('Luca', 'Rossi', 'M', '2010-05-15', 'Milano', 1),
('Francesca', 'Bianchi', 'F', '2011-08-20', 'Roma', 2),
('Marco', 'Gialli', 'M', '2012-12-25', 'Torino', 3);

INSERT INTO ChildParent (ChildID, ParentID) VALUES
(1, 1), (1, 2), (2, 3), (2, 4), (3, 5), (3, 6);

INSERT INTO Enrollment (ChildID, DataProcessingConsent, ExitAuthorization, SchoolType, Class, Section, Year, ParentNotes, ManagerNotes, ShirtSizeID, DateOfEnrollment, TeamID) VALUES
(1, TRUE, TRUE, 'Primary', 'V', 'A', 2024, 'Lorem Ipsum', 'Lorem Ipsum', 1, '2024-01-01 00:00:00', 1),
(2, TRUE, TRUE, 'Primary', 'IV', 'B', 2024, NULL, NULL, NULL, '2024-01-01 00:00:00', 2),
(3, TRUE, TRUE, 'Secondary', 'II', 'C', 2024, 'Lorem Ipsum', 'Lorem Ipsum', 2, '2024-01-01 00:00:00', NULL),
(1, TRUE, TRUE, 'Secondary', 'I', 'D', 2025, NULL, 'Lorem Ipsum', 1, '2025-01-01 00:00:00', 1),
(2, TRUE, TRUE, 'Primary', 'V', 'B', 2025, 'Lorem Ipsum', NULL, 2, '2025-01-01 00:00:00', NULL),
(3, FALSE, TRUE, 'Secondary', 'III', 'C', 2025, 'Allergie alimentari', 'Attenzione per uscita anticipata, a volte scappa', 3, '2025-01-01 00:00:00', 4);

INSERT INTO EnrollmentWeeks (EnrollmentID, WeekID, IsPaid) VALUES
(1, 1, TRUE), (1, 2, TRUE), (2, 3, FALSE), (3, 2, FALSE), (3, 3, TRUE),
(4, 4, 1), (5, 4, 0), (6, 4, 1);

INSERT INTO Attendance (EnrollmentID, Date, Present, EatsInOratory, EatsPlain) VALUES
(1, '2025-06-09', 1, 1, 0),
(1, '2025-06-10', 1, 1, 1),
(2, '2025-06-09', 0, 1, 0),
(2, '2025-06-10', 1, 1, 0),
(3, '2025-06-09', 1, 1, 0),
(3, '2025-06-10', 1, 0, 0);

INSERT INTO ExtraordinaryAttendance (ChildID, Type, Time, Notes) VALUES
(1, 'Join', '2025-06-09 09:00:00', 'Ingresso puntuale'),
(1, 'Left', '2025-06-09 15:00:00', 'Uscita anticipata per appuntamento medico'),
(3, 'Join', '2025-06-09 08:50:00', 'Ingresso in anticipo'),
(3, 'Left', '2025-06-09 16:00:00', 'Uscita regolare');

INSERT INTO Point (TeamID, Date, Quantity, Reason, UserID) VALUES
(1, '2024-10-01', 10, NULL, 1),
(2, '2024-10-01', 15, 'Vittoria nella competizione settimanale', 1),
(1, '2024-10-02', -5, 'Comportamento scorretto in gioco', NULL),
(3, '2024-10-03', 20, 'Performance eccellente in allenamento', 1),
(2, '2024-10-04', 10, 'Contributo straordinario alla comunita', 1),
(4, '2024-10-05', -10, 'Ritardo nella presentazione', 1),
(3, '2024-10-06', 25, 'Vittoria in gara finale', 1);
*/
