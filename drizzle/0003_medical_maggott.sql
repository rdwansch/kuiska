CREATE TABLE `option` (
	`id` varchar(36) NOT NULL,
	`question_id` varchar(36) NOT NULL,
	`content` varchar(500) NOT NULL,
	`is_correct` boolean NOT NULL,
	`position` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `option_id` PRIMARY KEY(`id`),
	CONSTRAINT `option_question_position_unique` UNIQUE(`question_id`,`position`)
);
--> statement-breakpoint
CREATE TABLE `question` (
	`id` varchar(36) NOT NULL,
	`quiz_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`position` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `question_id` PRIMARY KEY(`id`),
	CONSTRAINT `question_quiz_position_unique` UNIQUE(`quiz_id`,`position`)
);
--> statement-breakpoint
CREATE TABLE `quiz` (
	`id` varchar(36) NOT NULL,
	`owner_id` varchar(36) NOT NULL,
	`title` varchar(120) NOT NULL,
	`description` varchar(500) NOT NULL,
	`category` enum('technology','general','entertainment') NOT NULL,
	`visibility` enum('public','private') NOT NULL,
	`secret_code_hash` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `option` ADD CONSTRAINT `option_question_id_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question` ADD CONSTRAINT `question_quiz_id_quiz_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `option_question_id_idx` ON `option` (`question_id`);--> statement-breakpoint
CREATE INDEX `question_quiz_id_idx` ON `question` (`quiz_id`);--> statement-breakpoint
CREATE INDEX `quiz_owner_id_idx` ON `quiz` (`owner_id`);
