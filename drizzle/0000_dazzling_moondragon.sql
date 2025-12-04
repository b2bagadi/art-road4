CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_en` text NOT NULL,
	`title_fr` text NOT NULL,
	`title_ar` text NOT NULL,
	`category` text NOT NULL,
	`before_image` text NOT NULL,
	`after_image` text NOT NULL,
	`featured` integer DEFAULT false,
	`order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`message` text NOT NULL,
	`service` text,
	`status` text DEFAULT 'new' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `service` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_en` text NOT NULL,
	`title_fr` text NOT NULL,
	`title_ar` text NOT NULL,
	`description_en` text NOT NULL,
	`description_fr` text NOT NULL,
	`description_ar` text NOT NULL,
	`icon` text,
	`image` text,
	`featured` integer DEFAULT false,
	`order` integer DEFAULT 0,
	`active` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_setting` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`type` text DEFAULT 'text' NOT NULL,
	`category` text DEFAULT 'general' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_setting_key_unique` ON `site_setting` (`key`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);