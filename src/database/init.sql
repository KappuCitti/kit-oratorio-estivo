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

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS 
    `Address`,
    `Attendance`,
    `Child`,
    `ChildParent`,
    `Enrollment`,
    `EnrollmentWeeks`,
    `ExtraordinaryAttendance`,
    `Parent`,
    `Permission`,
    `Point`,
    `Role`,
    `RolePermission`,
    `Session`,
    `ShirtSize`,
    `Team`,
    `Trip`,
    `TripEnrollment`,
    `User`,
    `UserAction`,
    `UserRole`,
    `Week`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `Address` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `Street` varchar(255) NOT NULL,
    `City` varchar(255) NOT NULL,
    `PostalCode` varchar(20) NOT NULL,
    `Country` varchar(100) NOT NULL,
    CONSTRAINT `Address_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `Attendance` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `EnrollmentID` int NOT NULL,
    `Date` date NOT NULL,
    `Present` boolean NOT NULL DEFAULT false,
    `EatsInOratory` boolean NOT NULL DEFAULT false,
    `EatsPlain` boolean NOT NULL DEFAULT false,
    CONSTRAINT `Attendance_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `ChildParent` (
    `ChildID` int NOT NULL,
    `ParentID` int NOT NULL,
    CONSTRAINT `ChildParent_ChildID_ParentID_pk` PRIMARY KEY(`ChildID`,`ParentID`)
);

CREATE TABLE `Child` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `Name` varchar(255) NOT NULL,
    `Surname` varchar(255) NOT NULL,
    `Gender` enum('M','F','Other') NOT NULL,
    `BirthDate` varchar(255) NOT NULL,
    `BirthPlace` varchar(255) NOT NULL,
    `AddressID` int NOT NULL,
    CONSTRAINT `Child_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `Enrollment` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `ChildID` int NOT NULL,
    `TeamID` int,
    `ShirtSizeID` int,
    `DataProcessingConsent` boolean NOT NULL DEFAULT true,
    `ExitAuthorization` boolean NOT NULL,
    `SchoolType` enum('Primary','Secondary') NOT NULL,
    `Class` enum('I','II','III','IV','V') NOT NULL,
    `Section` char NOT NULL,
    `Year` int NOT NULL,
    `DateOfEnrollment` datetime NOT NULL,
    `ParentNotes` text,
    `ManagerNotes` text,
    CONSTRAINT `Enrollment_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `EnrollmentWeeks` (
    `EnrollmentID` int NOT NULL,
    `WeekID` int NOT NULL,
    `IsPaid` boolean NOT NULL DEFAULT false,
    CONSTRAINT `EnrollmentWeeks_EnrollmentID_WeekID_pk` PRIMARY KEY(`EnrollmentID`,`WeekID`)
);

CREATE TABLE `ExtraordinaryAttendance` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `ChildID` int NOT NULL,
    `Type` enum('Join','Left') NOT NULL,
    `Time` datetime NOT NULL,
    `Notes` varchar(255) NOT NULL DEFAULT '',
    CONSTRAINT `ExtraordinaryAttendance_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `Parent` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `Name` varchar(255) NOT NULL,
    `Surname` varchar(255) NOT NULL,
    `Gender` enum('M','F','Other') NOT NULL,
    `Email` varchar(255),
    `PhoneNumber` varchar(20) NOT NULL,
    CONSTRAINT `Parent_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `Permission` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `Name` varchar(100) NOT NULL,
    `Description` text,
    CONSTRAINT `Permission_ID` PRIMARY KEY(`ID`),
    CONSTRAINT `Permission_Name_unique` UNIQUE(`Name`)
);

CREATE TABLE `Point` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `TeamID` int NOT NULL,
    `Date` date NOT NULL,
    `Quantity` int NOT NULL,
    `Reason` varchar(255),
    `UserID` int,
    CONSTRAINT `Point_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `RolePermission` (
    `RoleID` int NOT NULL,
    `PermissionID` int NOT NULL,
    CONSTRAINT `RolePermission_RoleID_PermissionID_pk` PRIMARY KEY(`RoleID`,`PermissionID`)
);

CREATE TABLE `Role` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `Name` varchar(50) NOT NULL,
    `Description` text,
    CONSTRAINT `Role_ID` PRIMARY KEY(`ID`),
    CONSTRAINT `Role_Name_unique` UNIQUE(`Name`)
);

CREATE TABLE `Session` (
    `Token` varchar(36) NOT NULL,
    `Expires` varchar(255) NOT NULL,
    `UserID` int NOT NULL,
    CONSTRAINT `Session_Token` PRIMARY KEY(`Token`)
);

CREATE TABLE `ShirtSize` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `SizeName` varchar(50) NOT NULL,
    `Width` decimal(5,2) NOT NULL,
    `Height` decimal(5,2) NOT NULL,
    `IsAvailable` boolean NOT NULL DEFAULT true,
    CONSTRAINT `ShirtSize_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `Team` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `Name` varchar(40) NOT NULL,
    `Color` varchar(7) NOT NULL,
    CONSTRAINT `Team_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `TripEnrollment` (
    `EnrollmentID` int NOT NULL,
    `TripID` int NOT NULL,
    `IsPaid` boolean NOT NULL DEFAULT false,
    CONSTRAINT `TripEnrollment_EnrollmentID_TripID_pk` PRIMARY KEY(`EnrollmentID`,`TripID`)
);

CREATE TABLE `Trip` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `Title` varchar(255) NOT NULL,
    `Description` text,
    `Place` varchar(255) NOT NULL,
    `Url` text,
    `Date` date NOT NULL,
    `Price` decimal(10,2) NOT NULL DEFAULT '0',
    CONSTRAINT `Trip_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `UserAction` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `UserID` int,
    `Description` varchar(255) NOT NULL,
    `Type` enum('CREATE','UPDATE','DELETE') NOT NULL,
    `Date` date NOT NULL,
    CONSTRAINT `UserAction_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `UserRole` (
    `UserID` int NOT NULL,
    `RoleID` int NOT NULL,
    CONSTRAINT `UserRole_UserID_RoleID_pk` PRIMARY KEY(`UserID`,`RoleID`)
);

CREATE TABLE `User` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `Name` varchar(100) NOT NULL,
    `Surname` varchar(100) NOT NULL,
    `Email` varchar(255),
    `Theme` enum('Dark','Light','System') NOT NULL DEFAULT 'System',
    `Password` varchar(255) NOT NULL,
    CONSTRAINT `User_ID` PRIMARY KEY(`ID`)
);

CREATE TABLE `Week` (
    `ID` int AUTO_INCREMENT NOT NULL,
    `StartDate` date NOT NULL,
    `EndDate` date NOT NULL,
    `Price` decimal(10,2) NOT NULL,
    CONSTRAINT `Week_ID` PRIMARY KEY(`ID`)
);

ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_EnrollmentID_Enrollment_ID_fk` FOREIGN KEY (`EnrollmentID`) REFERENCES `Enrollment`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `ChildParent` ADD CONSTRAINT `ChildParent_ChildID_Child_ID_fk` FOREIGN KEY (`ChildID`) REFERENCES `Child`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `ChildParent` ADD CONSTRAINT `ChildParent_ParentID_Parent_ID_fk` FOREIGN KEY (`ParentID`) REFERENCES `Parent`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Child` ADD CONSTRAINT `Child_AddressID_Address_ID_fk` FOREIGN KEY (`AddressID`) REFERENCES `Address`(`ID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_ChildID_Child_ID_fk` FOREIGN KEY (`ChildID`) REFERENCES `Child`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_TeamID_Team_ID_fk` FOREIGN KEY (`TeamID`) REFERENCES `Team`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_ShirtSizeID_ShirtSize_ID_fk` FOREIGN KEY (`ShirtSizeID`) REFERENCES `ShirtSize`(`ID`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `EnrollmentWeeks` ADD CONSTRAINT `EnrollmentWeeks_EnrollmentID_Enrollment_ID_fk` FOREIGN KEY (`EnrollmentID`) REFERENCES `Enrollment`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `EnrollmentWeeks` ADD CONSTRAINT `EnrollmentWeeks_WeekID_Week_ID_fk` FOREIGN KEY (`WeekID`) REFERENCES `Week`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `ExtraordinaryAttendance` ADD CONSTRAINT `ExtraordinaryAttendance_ChildID_Child_ID_fk` FOREIGN KEY (`ChildID`) REFERENCES `Child`(`ID`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `Point` ADD CONSTRAINT `Point_TeamID_Team_ID_fk` FOREIGN KEY (`TeamID`) REFERENCES `Team`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Point` ADD CONSTRAINT `Point_UserID_User_ID_fk` FOREIGN KEY (`UserID`) REFERENCES `User`(`ID`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_RoleID_Role_ID_fk` FOREIGN KEY (`RoleID`) REFERENCES `Role`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_PermissionID_Permission_ID_fk` FOREIGN KEY (`PermissionID`) REFERENCES `Permission`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `Session` ADD CONSTRAINT `Session_UserID_User_ID_fk` FOREIGN KEY (`UserID`) REFERENCES `User`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `TripEnrollment` ADD CONSTRAINT `TripEnrollment_EnrollmentID_Enrollment_ID_fk` FOREIGN KEY (`EnrollmentID`) REFERENCES `Enrollment`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `TripEnrollment` ADD CONSTRAINT `TripEnrollment_TripID_Trip_ID_fk` FOREIGN KEY (`TripID`) REFERENCES `Trip`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `UserAction` ADD CONSTRAINT `UserAction_UserID_User_ID_fk` FOREIGN KEY (`UserID`) REFERENCES `User`(`ID`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_UserID_User_ID_fk` FOREIGN KEY (`UserID`) REFERENCES `User`(`ID`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_RoleID_Role_ID_fk` FOREIGN KEY (`RoleID`) REFERENCES `Role`(`ID`) ON DELETE cascade ON UPDATE no action;-- Crea un evento per cancellare le sessioni scadute
CREATE EVENT IF NOT EXISTS delete_expired_tokens
ON SCHEDULE EVERY 1 MONTH
STARTS (CURRENT_DATE + INTERVAL 1 DAY - INTERVAL DAYOFMONTH(CURRENT_DATE) - 1 DAY + INTERVAL '02:00' HOUR_MINUTE)
DO
  DELETE FROM Session
  WHERE Expires < NOW();

SET GLOBAL event_scheduler = ON;

-- Popola la tabella Team con i valori predefiniti (Rosso, Giallo, Blu, Verde)
INSERT INTO
    Team (Name, Color)
VALUES ('Rosso', '#dc3545'), -- Rosso
    ('Giallo', '#ffc107'), -- Giallo
    ('Blu', '#0d6efd'), -- Blu
    ('Verde', '#198754');
-- Verde

-- Crea un utente admin con username "admin" e password "admin1234" (in chiaro per il momento)
INSERT INTO
    User (Name, Surname, Password)
VALUES (
        'admin',
        'user',
        '$argon2id$v=19$m=1024,t=4,p=1$NHE+0PfYcMNtJa7gMKXIyS1vtU0i+g9Zv2ICoFyWYyw$GC8ONNZNnzSAHf76CxwQlj9zrYocoEQ0ww0HmiYoDaI'
    );
-- admin1234

-- T-Shirt Sizes
INSERT INTO
    ShirtSize (
        SizeName,
        Width,
        Height,
        IsAvailable
    )
VALUES ('Small', 45.0, 65.0, TRUE),
    ('Medium', 50.0, 70.0, TRUE),
    ('Large', 55.0, 75.0, TRUE),
    (
        'Extra Large',
        60.0,
        80.0,
        FALSE
    );
-- Taglia non disponibile

INSERT INTO
    Permission (Name, Description)
VALUES (
        'tree_add',
        'Aggiungere simultaneamente un ragazzo collegato a due genitori'
    ),
    (
        'contact_add',
        'Aggiungere un singolo ragazzo o genitore'
    ),
    (
        'contact_get',
        'Cercare un ragazzo o genitore'
    ),
    (
        'contact_update',
        'Modificare un ragazzo o genitore e le loro relazioni'
    ),
    (
        'contact_delete',
        'Rimuovere un ragazzo o genitore'
    ),
    (
        'contact_bulk',
        'Eseguire funzioni bulk sui contatti'
    ),
    (
        'enrollment_add',
        'Aggiungere un\'iscrizione'
    ),
    (
        'enrollment_get',
        'Cercare un\'iscrizione'
    ),
    (
        'enrollment_update',
        'Modificare un\'iscrizione'
    ),
    (
        'enrollment_delete',
        'Rimuovere un\'iscrizione'
    ),
    (
        'enrollment_bulk',
        'Eseguire funzioni bulk sulle iscrizioni'
    ),
    (
        'week_get',
        'Cercare informazioni di una settimana'
    ),
    (
        'week_add',
        'Aggiungere informazioni di una settimana'
    ),
    (
        'week_update',
        'Modificare informazioni di una settimana'
    ),
    (
        'week_delete',
        'Rimuovere informazioni di una settimana'
    ),
    (
        'attendance_update',
        'Segnare la presenza o assenza di un ragazzo'
    ),
    (
        'attendance_get',
        'Cercare una presenza'
    ),
    (
        'movement_add',
        'Segnare un\'uscita anticipata o un ingresso in ritardo'
    ),
    (
        'movement_get',
        'Ottenere informazioni sulle uscite anticipate e ingressi in ritardo'
    ),
    (
        'movement_update',
        'Modificare informazioni su un\'uscita anticipata o ingresso in ritardo'
    ),
    (
        'movement_delete',
        'Eliminare un\'uscita anticipata o ingresso in ritardo'
    ),
    (
        'attendance_update_today',
        'Modificare le presenze del giorno corrente'
    ),
    (
        'attendance_update_week',
        'Modificare le presenze della settimana corrente'
    ),
    (
        'attendance_update_year',
        'Modificare le presenze per l\'anno corrente'
    ),
    (
        'attendance_bulk',
        'Eseguire funzioni bulk sulle presenze'
    ),
    (
        'staff_self',
        'Visualizzare informazioni personali come staff'
    ),
    (
        'staff_add',
        'Aggiungere un membro dello staff'
    ),
    (
        'staff_get',
        'Cercare un membro dello staff'
    ),
    (
        'staff_update',
        'Modificare un membro dello staff'
    ),
    (
        'staff_delete',
        'Rimuovere un membro dello staff'
    ),
    (
        'staff_bulk',
        'Eseguire funzioni bulk sullo staff'
    ),
    (
        'team_add',
        'Aggiungere una squadra'
    ),
    (
        'team_get',
        'Cercare una squadra'
    ),
    (
        'team_update',
        'Modificare una squadra'
    ),
    (
        'team_delete',
        'Rimuovere una squadra'
    ),
    (
        'ranking_add',
        'Aggiungere un punteggio'
    ),
    (
        'ranking_update',
        'Modificare un punteggio'
    ),
    (
        'ranking_get_all',
        'Visualizzare i punteggi di tutte le squadre'
    ),
    (
        'ranking_get_team',
        'Visualizzare i punteggi di una squadra'
    ),
    (
        'ranking_delete_own',
        'Eliminare un proprio punteggio'
    ),
    (
        'ranking_delete_other',
        'Eliminare un punteggio inserito da altri'
    ),
    ('game_add', 'Creare un gioco'),
    (
        'game_update',
        'Modificare un gioco'
    ),
    (
        'game_get',
        'Visualizzare un gioco'
    ),
    (
        'game_spectator',
        'Visualizzare un gioco come spettatore'
    ),
    (
        'game_delete',
        'Eliminare un gioco'
    ),
    (
        'music_add',
        'Aggiungere una traccia musicale'
    ),
    (
        'music_delete',
        'Eliminare una traccia musicale'
    ),
    (
        'music_get',
        'Visualizzare una traccia musicale'
    ),
    (
        'shirt_add',
        'Aggiungere una taglia di maglietta'
    ),
    (
        'shirt_get',
        'Cercare una taglia di maglietta'
    ),
    (
        'shirt_update',
        'Modificare una taglia di maglietta'
    ),
    (
        'shirt_delete',
        'Eliminare una taglia di maglietta'
    ),
    (
        'settings_access',
        'Accedere alle impostazioni'
    );

INSERT INTO
    Role (Name, Description)
VALUES (
        'Amministratore',
        'Accesso completo a tutti i permessi'
    ),
    (
        'Vice amministratore',
        'Accesso completo escluso la gestione delle impostazioni'
    ),
    (
        'Addetto alle iscrizioni',
        'Gestisce la rubrica e le iscrizioni'
    ),
    (
        'Segreteria',
        'Gestisce tutte le presenze'
    ),
    (
        'Addetto alle presenze',
        'Aggiunge e rimuove presenze'
    ),
    (
        'Capo arbitro',
        'Gestisce completamente la classifica'
    ),
    (
        'Arbitro',
        'Inserisce, modifica e rimuove solo i propri punteggi'
    ),
    (
        'Capo squadra',
        'Visualizza i punteggi della propria squadra'
    ),
    (
        'Animatore',
        'Ruolo con solo accesso in lettura, se necessario'
    ),
    (
        'Addetto al teatro',
        'Gestisce giochi e musica'
    ),
    (
        'Addetto ai giochi',
        'Gestisce i giochi'
    ),
    (
        'Addetto alle casse',
        'Gestisce la musica'
    ),
    (
        'Esterno',
        'Nessun permesso associato'
    );

INSERT INTO
    RolePermission (RoleID, PermissionID)
SELECT r.ID AS RoleID, p.ID AS PermissionID
FROM Role r
    CROSS JOIN Permission p
WHERE
    r.Name = 'Amministratore';

INSERT INTO UserRole (UserID, RoleID) VALUES (1, 1);