ALTER TABLE `quiz` ADD `review_status` enum('not_requested','pending','approved','rejected') DEFAULT 'not_requested' NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz` ADD `reviewed_at` timestamp;--> statement-breakpoint
ALTER TABLE `quiz` ADD `review_note` varchar(500);--> statement-breakpoint
CREATE INDEX `quiz_public_discovery_idx` ON `quiz` (`visibility`,`review_status`,`created_at`);