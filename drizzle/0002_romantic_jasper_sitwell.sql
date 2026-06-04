CREATE TABLE `project_instructions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` varchar(128) NOT NULL,
	`preamble` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_instructions_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_instructions_project_id_unique` UNIQUE(`project_id`)
);
