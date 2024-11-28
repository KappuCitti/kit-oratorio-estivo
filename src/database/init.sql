/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */

DROP DATABASE IF EXISTS oratorio;
CREATE DATABASE IF NOT EXISTS oratorio;
USE oratorio;

-- Drop the tables in the correct order, starting from the most dependent tables
DROP TABLE IF EXISTS EnrollmentWeeks;
DROP TABLE IF EXISTS Membership;
DROP TABLE IF EXISTS Ranking;
DROP TABLE IF EXISTS Session;
DROP TABLE IF EXISTS Attendance_Details;
DROP TABLE IF EXISTS Attendance;
DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS Week;
DROP TABLE IF EXISTS Team;
DROP TABLE IF EXISTS Child_Parent;
DROP TABLE IF EXISTS Child;
DROP TABLE IF EXISTS Parent;
DROP TABLE IF EXISTS Address;
DROP TABLE IF EXISTS UserRole;
DROP TABLE IF EXISTS RolePermission;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS Permission;


-- Creazione della tabella User (Utenti)
CREATE TABLE User (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,  -- Nome
    Surname VARCHAR(100) NOT NULL,    -- Cognome
    Email VARCHAR(255),
    Theme ENUM('Dark', 'Light', 'System') DEFAULT 'System',
    Password VARCHAR(255) NOT NULL  
);

-- Creazione della tabella Permission (Permessi)
CREATE TABLE Role (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL UNIQUE,
    Description TEXT
);

CREATE TABLE Permission (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT
);

CREATE TABLE RolePermission (
    RoleID INT NOT NULL,
    PermissionID INT NOT NULL,
    PRIMARY KEY (RoleID, PermissionID),
    FOREIGN KEY (RoleID) REFERENCES Role(ID) ON DELETE CASCADE,
    FOREIGN KEY (PermissionID) REFERENCES Permission(ID) ON DELETE CASCADE
);

CREATE TABLE UserRole (
    UserID INT NOT NULL,
    RoleID INT NOT NULL,
    PRIMARY KEY (UserID, RoleID),
    FOREIGN KEY (UserID) REFERENCES User(ID) ON DELETE CASCADE,
    FOREIGN KEY (RoleID) REFERENCES Role(ID) ON DELETE CASCADE
);

-- Creazione della tabella Session (Sessioni)
CREATE TABLE Session (
    Token VARCHAR(36) PRIMARY KEY,  -- Cookie
    Expires DATETIME NOT NULL,
    UserID INT,                       -- UserID
    FOREIGN KEY (UserID) REFERENCES User(ID) ON DELETE CASCADE
);

CREATE TABLE Address (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Street VARCHAR(255),
  City VARCHAR(255),
  PostalCode VARCHAR(20),
  Country VARCHAR(100)
);

-- Creazione della tabella Parent (Genitori)
CREATE TABLE Parent (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Name VARCHAR(255) NOT NULL,
	Surname VARCHAR(255) NOT NULL,
    Gender ENUM('M', 'F', 'Other') NOT NULL,
	Email VARCHAR(255),
	PhoneNumber VARCHAR(20)
);

-- Creazione della tabella Child (Ragazzi)
CREATE TABLE Child (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Name VARCHAR(255) NOT NULL,
	Surname VARCHAR(255) NOT NULL,
    Gender ENUM('M', 'F', 'Other') NOT NULL,
	BirthDate DATE,
	BirthPlace VARCHAR(255),
	AddressID INT NOT NULL, -- Optional address specific to the child
	FOREIGN KEY (AddressID) REFERENCES Address(ID) -- Linking Address table
);

CREATE TABLE Child_Parent (
  ChildID INT,
  ParentID INT,
  PRIMARY KEY (ChildID, ParentID),
  FOREIGN KEY (ChildID) REFERENCES Child(ID) ON DELETE CASCADE,
  FOREIGN KEY (ParentID) REFERENCES Parent(ID) ON DELETE CASCADE
);

-- Creazione della tabella Team (Squadre)
CREATE TABLE Team (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(40)  NOT NULL,  -- Nome squadra
    Color VARCHAR(7) NOT NULL  -- Colore in formato HEX (ad es. #FF0000 per Rosso)
);

CREATE TABLE ShirtSize (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    SizeName VARCHAR(50) NOT NULL, -- Nome della taglia (es: Small, Medium, Large)
    Width DECIMAL(5, 2) NOT NULL,  -- Larghezza della maglietta in cm
    Height DECIMAL(5, 2) NOT NULL, -- Altezza della maglietta in cm
    IsAvailable BOOLEAN NOT NULL DEFAULT TRUE -- Disponibilità della taglia
);

-- Creazione della tabella Enrollment (Iscrizione)
CREATE TABLE Enrollment (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ChildID INT,    -- Ragazzo
    
    TeamID INT,
    ShirtSizeID INT, -- Taglia della maglietta
    
    DataProcessingConsent BOOLEAN NOT NULL, -- Autorizzazione al trattamento dei dati
    ExitAuthorization BOOLEAN NOT NULL,     -- Autorizzazione alle uscite
    
    SchoolType ENUM('Primary', 'Secondary') NOT NULL, -- Tipo scuola effettuata (Primario di primo, secondario di secondo)
    Class ENUM('I', 'II', 'III', 'IV', 'V') NOT NULL, -- Classe (I, II, III, IV, V)
    Section CHAR(1) NOT NULL,   -- Sezione
    
	Year INT NOT NULL,
    Timestamp DATETIME NOT NULL,
    
	ParentNotes TEXT,    -- Note inserite dal genitore
    ManagerNotes TEXT,   -- Note inserite dal gestore
    
    FOREIGN KEY (ChildID) REFERENCES Child(ID) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES Team(ID) ON DELETE SET NULL,
    FOREIGN KEY (ShirtSizeID) REFERENCES ShirtSize(ID)
);

CREATE TABLE Week (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Price DECIMAL(10, 2) NOT NULL 
);

CREATE TABLE EnrollmentWeeks (
    EnrollmentID INT NOT NULL,
    WeekID INT NOT NULL,
    IsPaid BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (EnrollmentID, WeekID),
    FOREIGN KEY (EnrollmentID) REFERENCES Enrollment(ID) ON DELETE CASCADE,
    FOREIGN KEY (WeekID) REFERENCES Week(ID) ON DELETE CASCADE
);

CREATE TABLE Attendance (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    EnrollmentID INT NOT NULL, -- Riferimento all'iscrizione
    Date DATE NOT NULL, -- Data della presenza
    Present BOOLEAN DEFAULT FALSE, -- Se il ragazzo è 
    EatsAtOratory BOOLEAN DEFAULT TRUE, -- Se mangia in oratorio (default True)
    EatsInBianco BOOLEAN, -- Se mangia "in bianco"
    FOREIGN KEY (EnrollmentID) REFERENCES Enrollment(ID)
);

CREATE TABLE Attendance_Details (
    ID INT AUTO_INCREMENT PRIMARY KEY, -- ID univoco per i dettagli della presenza
    ChildID INT NOT NULL,
    Type ENUM('Join', 'Left') NOT NULL,
    Time DATETIME NOT NULL,
    Notes VARCHAR(255) DEFAULT NULL, -- Eventuali note riguardanti la presenza
    FOREIGN KEY (ChildID) REFERENCES Child(ID)
);

-- Creazione della tabella Ranking (Classifica)
CREATE TABLE Ranking (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    TeamID INT NOT NULL,             -- ID della squadra
    Date DATE NOT NULL,              -- Data della classifica
    Points INT NOT NULL,              -- Punteggio della squadra
    Reason TEXT,    -- Motivo del punteggio
    UserID INT DEFAULT NULL,         -- ID dello staff, permette NULL per ON DELETE SET NULL
    FOREIGN KEY (TeamID) REFERENCES Team(ID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES User(ID) ON DELETE SET NULL
);


-- Crea un evento per cancellare le sessioni scadute
CREATE EVENT IF NOT EXISTS delete_expired_tokens
ON SCHEDULE EVERY 1 MONTH
STARTS (CURRENT_DATE + INTERVAL 1 DAY - INTERVAL DAYOFMONTH(CURRENT_DATE) - 1 DAY + INTERVAL '02:00' HOUR_MINUTE)
DO
  DELETE FROM Session
  WHERE Expires < NOW();
  
SET GLOBAL event_scheduler = ON;




-- Popola la tabella Team con i valori predefiniti (Rosso, Giallo, Blu, Verde)
INSERT INTO Team (Name, Color)
VALUES
    ('Rosso', '#dc3545'),   -- Rosso
    ('Giallo', '#ffc107'),  -- Giallo
    ('Blu', '#0d6efd'),     -- Blu
    ('Verde', '#198754');   -- Verde

-- Crea un utente admin con username "admin" e password "admin" (in chiaro per il momento)
INSERT INTO User (Name, Surname, Password)
VALUES ('Admin', 'User', 'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270'); -- admin

-- T-Shirt Sizes
INSERT INTO ShirtSize (SizeName, Width, Height, IsAvailable)
VALUES 
('Small', 45.0, 65.0, TRUE),
('Medium', 50.0, 70.0, TRUE),
('Large', 55.0, 75.0, TRUE),
('Extra Large', 60.0, 80.0, FALSE); -- Taglia non disponibile

INSERT INTO Permission (Name, Description) VALUES
    ('tree_add', 'Aggiungere simultaneamente un ragazzo collegato a due genitori'),
    ('contact_add', 'Aggiungere un singolo ragazzo o genitore'),
    ('contact_get', 'Cercare un ragazzo o genitore'),
    ('contact_update', 'Modificare un ragazzo o genitore e le loro relazioni'),
    ('contact_delete', 'Rimuovere un ragazzo o genitore'),
    ('contact_bulk', 'Eseguire funzioni bulk sui contatti'),
    ('enrollment_add', 'Aggiungere un\'iscrizione'),
    ('enrollment_get', 'Cercare un\'iscrizione'),
    ('enrollment_update', 'Modificare un\'iscrizione'),
    ('enrollment_delete', 'Rimuovere un\'iscrizione'),
    ('enrollment_bulk', 'Eseguire funzioni bulk sulle iscrizioni'),
    ('week_get', 'Cercare informazioni di una settimana'),
    ('week_add', 'Aggiungere informazioni di una settimana'),
    ('week_update', 'Modificare informazioni di una settimana'),
    ('week_delete', 'Rimuovere informazioni di una settimana'),
    ('attendance_update', 'Segnare la presenza o assenza di un ragazzo'),
    ('attendance_get', 'Cercare una presenza'),
    ('movement_add', 'Segnare un\'uscita anticipata o un ingresso in ritardo'),
    ('movement_get', 'Ottenere informazioni sulle uscite anticipate e ingressi in ritardo'),
    ('movement_update', 'Modificare informazioni su un\'uscita anticipata o ingresso in ritardo'),
    ('movement_delete', 'Eliminare un\'uscita anticipata o ingresso in ritardo'),
    ('attendance_update_today', 'Modificare le presenze del giorno corrente'),
    ('attendance_update_week', 'Modificare le presenze della settimana corrente'),
    ('attendance_update_year', 'Modificare le presenze per l\'anno corrente'),
    ('attendance_bulk', 'Eseguire funzioni bulk sulle presenze'),
    ('staff_self', 'Visualizzare informazioni personali come staff'),
    ('staff_add', 'Aggiungere un membro dello staff'),
    ('staff_get', 'Cercare un membro dello staff'),
    ('staff_update', 'Modificare un membro dello staff'),
    ('staff_delete', 'Rimuovere un membro dello staff'),
    ('staff_bulk', 'Eseguire funzioni bulk sullo staff'),
    ('team_add', 'Aggiungere una squadra'),
    ('team_get', 'Cercare una squadra'),
    ('team_update', 'Modificare una squadra'),
    ('team_delete', 'Rimuovere una squadra'),
    ('ranking_add', 'Aggiungere un punteggio'),
    ('ranking_update', 'Modificare un punteggio'),
    ('ranking_get_all', 'Visualizzare i punteggi di tutte le squadre'),
    ('ranking_get_team', 'Visualizzare i punteggi di una squadra'),
    ('ranking_delete_own', 'Eliminare un proprio punteggio'),
    ('ranking_delete_other', 'Eliminare un punteggio inserito da altri'),
    ('game_add', 'Creare un gioco'),
    ('game_update', 'Modificare un gioco'),
    ('game_get', 'Visualizzare un gioco'),
    ('game_spectator', 'Visualizzare un gioco come spettatore'),
    ('game_delete', 'Eliminare un gioco'),
    ('music_add', 'Aggiungere una traccia musicale'),
    ('music_delete', 'Eliminare una traccia musicale'),
    ('music_get', 'Visualizzare una traccia musicale'),
    ('shirt_add', 'Aggiungere una taglia di maglietta'),
    ('shirt_get', 'Cercare una taglia di maglietta'),
    ('shirt_update', 'Modificare una taglia di maglietta'),
    ('shirt_delete', 'Eliminare una taglia di maglietta'),
    ('settings_access', 'Accedere alle impostazioni');

INSERT INTO Role (Name, Description) VALUES
    ('Amministratore', 'Accesso completo a tutti i permessi'),
    ('Vice amministratore', 'Accesso completo escluso la gestione delle impostazioni'),
    ('Addetto alle iscrizioni', 'Gestisce la rubrica e le iscrizioni'),
    ('Segreteria', 'Gestisce tutte le presenze'),
    ('Addetto alle presenze', 'Aggiunge e rimuove presenze'),
    ('Capo arbitro', 'Gestisce completamente la classifica'),
    ('Arbitro', 'Inserisce, modifica e rimuove solo i propri punteggi'),
    ('Capo squadra', 'Visualizza i punteggi della propria squadra'),
    ('Animatore', 'Ruolo con solo accesso in lettura, se necessario'),
    ('Addetto al teatro', 'Gestisce giochi e musica'),
    ('Addetto ai giochi', 'Gestisce i giochi'),
    ('Addetto alle casse', 'Gestisce la musica'),
    ('Esterno', 'Nessun permesso associato');
    
INSERT INTO RolePermission (RoleID, PermissionID)
SELECT r.ID AS RoleID, p.ID AS PermissionID
FROM Role r
CROSS JOIN Permission p
WHERE r.Name = 'Amministratore';

INSERT INTO UserRole (UserID, RoleID) VALUES (1, 1);