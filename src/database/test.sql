/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
 
-- TEST
USE oratorio;

-- Addresses
INSERT INTO Address (Street, City, PostalCode, Country) VALUES
('Via Roma, 10', 'Milano', '20100', 'Italy'),
('Via Milano, 20', 'Roma', '00100', 'Italy'),
('Via Napoli, 30', 'Torino', '10100', 'Italy'),
('Via Firenze, 40', 'Firenze', '50100', 'Italy'),
('Via Venezia, 50', 'Venezia', '30100', 'Italy'),
('Via Bologna, 60', 'Bologna', '40100', 'Italy');

-- Parents (with address references)
INSERT INTO Parent (Name, Surname, Gender, PhoneNumber, Email) VALUES
('Mario', 'Rossi', 'M', '1234567890', 'mario.rossi@example.com'),
('Lucia', 'Verdi', 'F', '0987654321', 'lucia.verdi@example.com'),
('Giovanni', 'Bianchi', 'M', '2233445566', 'giovanni.bianchi@example.com'),
('Anna', 'Neri', 'F', '3344556677', 'anna.neri@example.com'),
('Paolo', 'Gialli', 'M', '4455667788', 'paolo.gialli@example.com'),
('Laura', 'Blu', 'F', '5566778899', 'laura.blu@example.com');

-- Children (with address references)
INSERT INTO Child (Name, Surname, Gender, BirthDate, BirthPlace, AddressID) VALUES
('Luca', 'Rossi', 'M', '2010-05-15', 'Milano', 1),
('Francesca', 'Bianchi', 'F', '2011-08-20', 'Roma', 2),
('Marco', 'Gialli', 'M', '2012-12-25', 'Torino', 3);

-- Child_Parent relationships
INSERT INTO Child_Parent (ChildID, ParentID) VALUES
(1, 1),  -- Luca Rossi (ChildID 1) has Mario Rossi as parent
(1, 2),  -- Luca Rossi (ChildID 1) also has Lucia Verdi as parent
(2, 3),  -- Francesca Bianchi (ChildID 2) has Giovanni Bianchi as parent
(2, 4),  -- Francesca Bianchi (ChildID 2) also has Anna Neri as parent
(3, 5),  -- Marco Gialli (ChildID 3) has Paolo Gialli as parent
(3, 6);  -- Marco Gialli (ChildID 3) also has Laura Blu as parent

-- Weeks
INSERT INTO Week (StartDate, EndDate, Price) VALUES
('2024-06-10', '2024-06-16', 40),  -- Week 1
('2024-06-17', '2024-06-23', 40),  -- Week 2
('2024-06-24', '2024-06-30', 40);  -- Week 3
INSERT INTO Week (StartDate, EndDate, Price) VALUES 
('2025-06-09', '2025-06-13', 60),  -- Seconda settimana di giugno
('2025-06-16', '2025-06-20', 60),  -- Terza settimana di giugno
('2025-06-23', '2025-06-27', 60);  -- Quarta settimana di giugno

-- Enrollments (with Year)
INSERT INTO Enrollment (ChildID, DataProcessingConsent, ExitAuthorization, SchoolType, Class, Section, Year, ParentNotes, ManagerNotes, ShirtSizeID, TimeStamp, TeamID) VALUES
(1, TRUE, TRUE, 'Primary', 'V', 'A', 2024, 'Lorem Ipsum', 'Lorem Ipsum', 1, '2024-01-01 00:00:00', 1),  -- Luca Rossi
(2, TRUE, TRUE, 'Primary', 'IV', 'B', 2024, NULL, NULL, NULL, '2024-01-01 00:00:00', 2),  -- Francesca Bianchi
(3, TRUE, TRUE, 'Secondary', 'II', 'C', 2024, 'Lorem Ipsum', 'Lorem Ipsum', 2, '2024-01-01 00:00:00', NULL),  -- Marco Gialli
-- Anno dopo
(1, TRUE, TRUE, 'Secondary', 'I', 'D', 2025, NULL, 'Lorem Ipsum', 1, '2025-01-01 00:00:00', 1),  -- Luca Rossi
(2, TRUE, TRUE, 'Primary', 'V', 'B', 2025, 'Lorem Ipsum', NULL, 2, '2025-01-01 00:00:00', NULL),  -- Marco Bianchi
(3, FALSE, TRUE, 'Secondary', 'III', 'C', 2025, 'Allergie alimentari', 'Attenzione per uscita anticipata, a volte scappa', 3, '2025-01-01 00:00:00', 4);  -- Giulia Verdi


-- Enrollment-Week (with IsPaid status)
INSERT INTO EnrollmentWeeks (EnrollmentID, WeekID, IsPaid) VALUES
(1, 1, TRUE),  -- Luca enrolled in Week 1 (paid)
(1, 2, TRUE),  -- Luca enrolled in Week 2 (paid)
(2, 3, FALSE),  -- Francesca enrolled in Week 3 (not paid)
(3, 2, FALSE),  -- Marco enrolled in Week 2 (not paid)
(3, 3, TRUE),  -- Marco enrolled in Week 3 (paid)
-- Anno dopo
(1, 4, 1),  -- Luca Rossi per la settimana 4, pagamento effettuato
(2, 4, 0),  -- Marco Bianchi per la settimana 4, pagamento non effettuato
(3, 4, 1);  -- Giulia Verdi per la settimana 4, pagamento effettuato

INSERT INTO Attendance (EnrollmentID, Date, Present, EatsAtOratory, EatsInBianco)
VALUES
(1, '2025-06-09', 1, 1, 0),  -- Luca Rossi presente il 9 giugno
(1, '2025-06-10', 1, 1, 1),  -- Luca Rossi presente il 10 giugno, mangia in bianco
(2, '2025-06-09', 0, 1, 0),  -- Marco Bianchi assente il 9 giugno
(2, '2025-06-10', 1, 1, 0),  -- Marco Bianchi presente il 10 giugno
(3, '2025-06-09', 1, 1, 0),  -- Giulia Verdi presente il 9 giugno
(3, '2025-06-10', 1, 0, 0);  -- Giulia Verdi presente il 10 giugno, non mangia in oratorio


INSERT INTO Attendance_Details (ChildID, Type, Time, Notes)
VALUES
(1, 'Join', '2025-06-09 09:00:00', 'Ingresso puntuale'),
(1, 'Left', '2025-06-09 15:00:00', 'Uscita anticipata per appuntamento medico'),
(3, 'Join', '2025-06-09 08:50:00', 'Ingresso in anticipo'),
(3, 'Left', '2025-06-09 16:00:00', 'Uscita regolare');

-- Inserimento dei dati nella tabella Ranking
INSERT INTO Ranking (TeamID, Date, Points, Reason, UserID) 
VALUES 
(1, '2024-10-01', 10, NULL, 1),
(2, '2024-10-01', 15, 'Vittoria nella competizione settimanale', 1),
(1, '2024-10-02', -5, 'Comportamento scorretto in gioco', NULL),
(3, '2024-10-03', 20, 'Performance eccellente in allenamento', 1),
(2, '2024-10-04', 10, 'Contributo straordinario alla comunità', 1),
(4, '2024-10-05', -10, 'Ritardo nella presentazione', 1),
(3, '2024-10-06', 25, 'Vittoria in gara finale', 1);