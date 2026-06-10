CREATE TABLE `current_instructions_sync` (
	`id` int NOT NULL DEFAULT 1,
	`instructions_text` text NOT NULL,
	`synced_at` timestamp NOT NULL DEFAULT (now()),
	`agent_note` varchar(500),
	CONSTRAINT `current_instructions_sync_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_instructions_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`audited_at` timestamp NOT NULL DEFAULT (now()),
	`char_count` int,
	`budget_pct` int,
	`sections_json` text NOT NULL,
	`discrepancies_json` text,
	`summary` text,
	`agent_note` varchar(500),
	CONSTRAINT `project_instructions_audits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_instructions_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`version` varchar(20) NOT NULL,
	`applied_at` timestamp NOT NULL DEFAULT (now()),
	`generated_snapshot` text NOT NULL,
	`change_note` varchar(500),
	`char_count` int,
	`budget_pct` int,
	`published_at` timestamp,
	CONSTRAINT `project_instructions_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skill_usage_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logged_at` timestamp NOT NULL DEFAULT (now()),
	`task_description` varchar(500),
	`skills_read_json` text NOT NULL,
	`agent_note` varchar(500),
	CONSTRAINT `skill_usage_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `skills`;--> statement-breakpoint
ALTER TABLE `skill_improvements` DROP FOREIGN KEY `skill_improvements_skill_id_skills_id_fk`;
