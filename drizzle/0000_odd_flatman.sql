CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`prefix` text,
	`name` text NOT NULL,
	`middle_name` text,
	`last_name` text NOT NULL,
	`suffix` text,
	`phonetic_first` text,
	`phonetic_middle` text,
	`phonetic_last` text,
	`nickname` text,
	`file_as` text,
	`company` text,
	`job_title` text,
	`department` text,
	`email` text,
	`phone` text NOT NULL,
	`country` text,
	`street` text,
	`postal_code` text,
	`district` text,
	`province` text,
	`b_day` text,
	`b_month` text,
	`b_year` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
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
	`name` text NOT NULL,
	`email` text NOT NULL,
	`status` text NOT NULL,
	`is_google_signup` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_phone_unique` ON `contacts` (`phone`);--> statement-breakpoint
CREATE INDEX `contact_status_idx` ON `contacts` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `user_status_idx` ON `users` (`status`);