CREATE TABLE `skill_registry_releases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposal_id` int NOT NULL,
	`registry_snapshot` text NOT NULL,
	`released_by_user_id` int NOT NULL,
	`released_at` bigint NOT NULL,
	CONSTRAINT `skill_registry_releases_id` PRIMARY KEY(`id`),
	CONSTRAINT `skill_registry_releases_proposal_id_unique` UNIQUE(`proposal_id`)
);
--> statement-breakpoint
CREATE TABLE `skill_release_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposal_id` int NOT NULL,
	`event_type` enum('submitted','approved','rejected','released') NOT NULL,
	`actor_user_id` int NOT NULL,
	`note` varchar(1000),
	`created_at` bigint NOT NULL,
	CONSTRAINT `skill_release_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skill_release_proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skill_id` varchar(64) NOT NULL,
	`proposal_type` enum('create','update') NOT NULL,
	`status` enum('submitted','approved','rejected','released') NOT NULL DEFAULT 'submitted',
	`name` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`tier` int NOT NULL,
	`category` varchar(64) NOT NULL,
	`version` varchar(16) NOT NULL,
	`read_when` text NOT NULL,
	`has_references` enum('true','false') NOT NULL,
	`proposed_content` text NOT NULL,
	`change_summary` text NOT NULL,
	`task_context` varchar(256),
	`submitted_by_user_id` int NOT NULL,
	`reviewed_by_user_id` int,
	`review_note` varchar(1000),
	`created_at` bigint NOT NULL,
	`updated_at` bigint NOT NULL,
	`reviewed_at` bigint,
	CONSTRAINT `skill_release_proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `skill_registry_releases` ADD CONSTRAINT `fk_skill_registry_proposal` FOREIGN KEY (`proposal_id`) REFERENCES `skill_release_proposals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skill_registry_releases` ADD CONSTRAINT `fk_skill_registry_releaser` FOREIGN KEY (`released_by_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skill_release_events` ADD CONSTRAINT `fk_skill_event_proposal` FOREIGN KEY (`proposal_id`) REFERENCES `skill_release_proposals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skill_release_events` ADD CONSTRAINT `fk_skill_event_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skill_release_proposals` ADD CONSTRAINT `fk_skill_proposal_submitter` FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skill_release_proposals` ADD CONSTRAINT `fk_skill_proposal_reviewer` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_skill_release_events_proposal_created` ON `skill_release_events` (`proposal_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_skill_release_proposals_status_created` ON `skill_release_proposals` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_skill_release_proposals_skill_created` ON `skill_release_proposals` (`skill_id`,`created_at`);
