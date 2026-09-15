CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`place` varchar(255),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_appointments` (
	`activity_id` int NOT NULL,
	`week_id` int NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	CONSTRAINT `activity_appointments_activity_id_week_id_pk` PRIMARY KEY(`activity_id`,`week_id`)
);
--> statement-breakpoint
CREATE TABLE `activity_classes` (
	`activity_id` int NOT NULL,
	`class_id` int NOT NULL,
	CONSTRAINT `activity_classes_activity_id_class_id_pk` PRIMARY KEY(`activity_id`,`class_id`)
);
--> statement-breakpoint
CREATE TABLE `activity_subscriptions` (
	`activity_id` int NOT NULL,
	`week_id` int NOT NULL,
	`enrollment_id` int NOT NULL,
	CONSTRAINT `activity_subscriptions_activity_id_week_id_enrollment_id_pk` PRIMARY KEY(`activity_id`,`week_id`,`enrollment_id`)
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`postal_code` varchar(20) NOT NULL,
	`country` varchar(100) NOT NULL,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollment_id` int NOT NULL,
	`date` date NOT NULL,
	`eats_in_oratory` boolean NOT NULL DEFAULT false,
	CONSTRAINT `attendances_id` PRIMARY KEY(`id`),
	CONSTRAINT `attendances_enrollment_id_date_unique` UNIQUE(`enrollment_id`,`date`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`school_id` int NOT NULL,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(16) NOT NULL,
	`team_id` int,
	`shirt_size_id` int,
	`data_processing_consent` boolean NOT NULL DEFAULT true,
	`image_processing_consent` boolean NOT NULL DEFAULT false,
	`exit_authorization` boolean NOT NULL DEFAULT true,
	`class_id` int NOT NULL,
	`section` char NOT NULL,
	`year` int NOT NULL,
	`date_of_enrollment` datetime NOT NULL,
	`parent_notes` text,
	`manager_notes` text,
	`special_diet` text,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollment_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(16) NOT NULL,
	`shirt_size_id` int,
	`data_processing_consent` boolean NOT NULL DEFAULT true,
	`image_processing_consent` boolean NOT NULL DEFAULT false,
	`exit_authorization` boolean,
	`class_id` int NOT NULL,
	`section` char NOT NULL,
	`year` int NOT NULL,
	`date_of_enrollment` datetime NOT NULL,
	`parent_notes` text,
	`special_diet` text,
	CONSTRAINT `enrollment_queue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollment_queue_weeks` (
	`enrollment_id` int NOT NULL,
	`week_id` int NOT NULL,
	CONSTRAINT `enrollment_queue_weeks_enrollment_id_week_id_pk` PRIMARY KEY(`enrollment_id`,`week_id`)
);
--> statement-breakpoint
CREATE TABLE `enrollment_weeks` (
	`enrollment_id` int NOT NULL,
	`week_id` int NOT NULL,
	`is_paid` boolean NOT NULL DEFAULT false,
	CONSTRAINT `enrollment_weeks_enrollment_id_week_id_pk` PRIMARY KEY(`enrollment_id`,`week_id`)
);
--> statement-breakpoint
CREATE TABLE `event_classes` (
	`event_id` int NOT NULL,
	`class_id` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`place` varchar(255) NOT NULL,
	`url` text,
	`date` date NOT NULL,
	`price` decimal(10,2) NOT NULL DEFAULT '0',
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `extraordinary_attendances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(16) NOT NULL,
	`type` enum('Join','Left') NOT NULL,
	`time` datetime NOT NULL,
	`notes` varchar(255) NOT NULL DEFAULT '',
	CONSTRAINT `extraordinary_attendances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `manages` (
	`main_id` varchar(16) NOT NULL,
	`target_id` varchar(16) NOT NULL,
	CONSTRAINT `manages_main_id_target_id_pk` PRIMARY KEY(`main_id`,`target_id`)
);
--> statement-breakpoint
CREATE TABLE `personal_info` (
	`id` varchar(16) NOT NULL,
	`name` varchar(100) NOT NULL,
	`surname` varchar(100) NOT NULL,
	`gender` enum('M','F'),
	`birth_date` date,
	`birth_place` varchar(255),
	`address_id` int,
	CONSTRAINT `personal_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `points` (
	`id` int AUTO_INCREMENT NOT NULL,
	`team_id` int NOT NULL,
	`date` date NOT NULL,
	`quantity` int NOT NULL,
	`reason` varchar(255),
	`user_id` varchar(16),
	CONSTRAINT `points_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`display_name` varchar(50) NOT NULL,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` int NOT NULL,
	`permission` enum('be_enrolled','be_managed','be_selected','give_exit_authorization','login','manage_activities','manage_attendances','manage_classes','manage_enrollments','manage_events','manage_personal_info','manage_roles','manage_self_child_users','manage_teams','manage_users','manage_weeks','register','register_child_users','see_activities','see_classes','see_personal_info','see_stats','see_users') NOT NULL,
	CONSTRAINT `role_permissions_role_id_permission_pk` PRIMARY KEY(`role_id`,`permission`)
);
--> statement-breakpoint
CREATE TABLE `schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`can_choose_activities` boolean NOT NULL,
	CONSTRAINT `schools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` varchar(36) NOT NULL,
	`expires` datetime NOT NULL,
	`user_id` varchar(16) NOT NULL,
	CONSTRAINT `sessions_token` PRIMARY KEY(`token`)
);
--> statement-breakpoint
CREATE TABLE `shirts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`size_name` varchar(50) NOT NULL,
	`width` decimal(5,2) NOT NULL,
	`height` decimal(5,2) NOT NULL,
	`is_available` boolean NOT NULL DEFAULT true,
	CONSTRAINT `shirts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(40) NOT NULL,
	`color` varchar(7) NOT NULL,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(16) NOT NULL,
	`email` varchar(255),
	`password` varchar(255) NOT NULL,
	`theme` enum('Dark','Light','System') NOT NULL DEFAULT 'System',
	`phone` varchar(15),
	`role_id` int NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_events` (
	`user_id` varchar(16) NOT NULL,
	`event_id` int NOT NULL,
	`is_paid` boolean NOT NULL DEFAULT false,
	CONSTRAINT `user_events_user_id_event_id_pk` PRIMARY KEY(`user_id`,`event_id`)
);
--> statement-breakpoint
CREATE TABLE `weeks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`max_enrollments` int unsigned NOT NULL,
	`registration_open_date` date NOT NULL,
	`registration_close_date` date NOT NULL,
	CONSTRAINT `weeks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `activity_appointments` ADD CONSTRAINT `activity_appointments_activity_id_activities_id_fk` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_appointments` ADD CONSTRAINT `activity_appointments_week_id_weeks_id_fk` FOREIGN KEY (`week_id`) REFERENCES `weeks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_classes` ADD CONSTRAINT `activity_classes_activity_id_activities_id_fk` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_classes` ADD CONSTRAINT `activity_classes_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_subscriptions` ADD CONSTRAINT `activity_subscriptions_activity_id_activities_id_fk` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_subscriptions` ADD CONSTRAINT `activity_subscriptions_week_id_weeks_id_fk` FOREIGN KEY (`week_id`) REFERENCES `weeks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_subscriptions` ADD CONSTRAINT `activity_subscriptions_enrollment_id_enrollments_id_fk` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_enrollment_id_enrollments_id_fk` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_shirt_size_id_shirts_id_fk` FOREIGN KEY (`shirt_size_id`) REFERENCES `shirts`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollment_queue` ADD CONSTRAINT `enrollment_queue_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollment_queue` ADD CONSTRAINT `enrollment_queue_shirt_size_id_shirts_id_fk` FOREIGN KEY (`shirt_size_id`) REFERENCES `shirts`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollment_queue` ADD CONSTRAINT `enrollment_queue_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollment_queue_weeks` ADD CONSTRAINT `enrollment_queue_weeks_enrollment_id_enrollment_queue_id_fk` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment_queue`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollment_queue_weeks` ADD CONSTRAINT `enrollment_queue_weeks_week_id_weeks_id_fk` FOREIGN KEY (`week_id`) REFERENCES `weeks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollment_weeks` ADD CONSTRAINT `enrollment_weeks_enrollment_id_enrollments_id_fk` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollment_weeks` ADD CONSTRAINT `enrollment_weeks_week_id_weeks_id_fk` FOREIGN KEY (`week_id`) REFERENCES `weeks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_classes` ADD CONSTRAINT `event_classes_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_classes` ADD CONSTRAINT `event_classes_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `extraordinary_attendances` ADD CONSTRAINT `extraordinary_attendances_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `manages` ADD CONSTRAINT `manages_main_id_users_id_fk` FOREIGN KEY (`main_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `manages` ADD CONSTRAINT `manages_target_id_users_id_fk` FOREIGN KEY (`target_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personal_info` ADD CONSTRAINT `personal_info_id_users_id_fk` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personal_info` ADD CONSTRAINT `personal_info_address_id_addresses_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `points` ADD CONSTRAINT `points_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `points` ADD CONSTRAINT `points_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_events` ADD CONSTRAINT `user_events_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_events` ADD CONSTRAINT `user_events_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `points_team_date_idx` ON `points` (`team_id`,`date`);--> statement-breakpoint
CREATE INDEX `points_date_idx` ON `points` (`date`);--> statement-breakpoint
CREATE INDEX `sessions_expires_idx` ON `sessions` (`expires`);