CREATE TABLE `skill_evolution_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sync_run_id` varchar(36) NOT NULL,
	`logged_at` timestamp NOT NULL DEFAULT (now()),
	`trigger_source` varchar(32) NOT NULL,
	`task_name` varchar(256),
	`event_type` enum('added','updated','removed') NOT NULL,
	`skill_id` varchar(64) NOT NULL,
	`skill_name` varchar(256),
	`tier` int,
	`version_before` varchar(16),
	`version_after` varchar(16),
	`changed_fields` text,
	`summary` varchar(512) NOT NULL,
	CONSTRAINT `skill_evolution_log_id` PRIMARY KEY(`id`)
);
