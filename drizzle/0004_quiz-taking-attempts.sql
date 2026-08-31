CREATE TABLE `quiz_attempt` (
	`id` varchar(36) NOT NULL,
	`quiz_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`total_questions` int NOT NULL,
	`correct_answers` int NOT NULL,
	`score` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_attempt_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `quiz_attempt` ADD CONSTRAINT `quiz_attempt_quiz_id_quiz_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_attempt` ADD CONSTRAINT `quiz_attempt_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `quiz_attempt_quiz_user_idx` ON `quiz_attempt` (`quiz_id`,`user_id`);