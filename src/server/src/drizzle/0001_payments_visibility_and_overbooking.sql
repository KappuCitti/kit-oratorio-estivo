ALTER TABLE `users` ADD `show_payments` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `weeks` ADD `allow_overbooking` boolean DEFAULT false NOT NULL;