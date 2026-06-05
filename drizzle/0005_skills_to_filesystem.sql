-- Migration 0005: Skills architecture migration
-- Skills content moves to filesystem (SKILL.md files).
-- The `skills` table is dropped; skill_improvements FK is removed.
-- Two new governance tables are added for project instructions management.

-- 1. Drop FK constraint from skill_improvements → skills
ALTER TABLE `skill_improvements` DROP FOREIGN KEY `skill_improvements_skill_id_skills_id_fk`;

-- 2. Drop the skills table
DROP TABLE IF EXISTS `skills`;

-- 3. Create project_instructions_versions (snapshot history)
CREATE TABLE IF NOT EXISTS `project_instructions_versions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `version` varchar(20) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT (now()),
  `generated_snapshot` text NOT NULL,
  `change_note` varchar(500),
  `char_count` int,
  `budget_pct` int,
  CONSTRAINT `project_instructions_versions_id` PRIMARY KEY(`id`)
);

-- 4. Create project_instructions_audits (agent-run audit findings)
CREATE TABLE IF NOT EXISTS `project_instructions_audits` (
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
