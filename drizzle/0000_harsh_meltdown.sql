CREATE TABLE `passwords` (
	`id` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`status` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `user_status_idx` ON `users` (`status`);