CREATE TABLE `skill_improvements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skill_id` varchar(64) NOT NULL,
	`version` varchar(16) NOT NULL,
	`summary` text NOT NULL,
	`task_context` text,
	`logged_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skill_improvements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text NOT NULL,
	`tier` int NOT NULL,
	`version` varchar(16) NOT NULL,
	`read_when` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `skill_improvements` ADD CONSTRAINT `skill_improvements_skill_id_skills_id_fk` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE cascade ON UPDATE no action;