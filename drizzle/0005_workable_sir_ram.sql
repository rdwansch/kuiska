CREATE TABLE `game_room` (
	`id` varchar(36) NOT NULL,
	`quiz_id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`mode` enum('live_trivia','self_paced_race') NOT NULL,
	`status` enum('waiting','active','completed','expired') NOT NULL,
	`invite_code` varchar(32) NOT NULL,
	`participant_limit` int NOT NULL,
	`current_question_position` int,
	`question_opened_at` timestamp(3),
	`question_ends_at` timestamp(3),
	`question_reveal_ends_at` timestamp(3),
	`deadline_at` timestamp(3),
	`started_at` timestamp(3),
	`completed_at` timestamp(3),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_room_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_room_invite_code_unique` UNIQUE(`invite_code`)
);
--> statement-breakpoint
CREATE TABLE `room_answer` (
	`id` varchar(36) NOT NULL,
	`room_participant_id` varchar(36) NOT NULL,
	`question_id` varchar(36) NOT NULL,
	`option_id` varchar(36) NOT NULL,
	`submitted_at` timestamp(3) NOT NULL,
	`is_correct` boolean NOT NULL,
	CONSTRAINT `room_answer_id` PRIMARY KEY(`id`),
	CONSTRAINT `room_answer_participant_question_unique` UNIQUE(`room_participant_id`,`question_id`)
);
--> statement-breakpoint
CREATE TABLE `room_participant` (
	`id` varchar(36) NOT NULL,
	`room_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`status` enum('joined','ready','playing','completed','left') NOT NULL,
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	`started_at` timestamp(3),
	`completed_at` timestamp(3),
	`correct_answers` int NOT NULL DEFAULT 0,
	`total_answer_duration_ms` bigint NOT NULL DEFAULT 0,
	`rank` int,
	CONSTRAINT `room_participant_id` PRIMARY KEY(`id`),
	CONSTRAINT `room_participant_room_user_unique` UNIQUE(`room_id`,`user_id`)
);
--> statement-breakpoint
ALTER TABLE `game_room` ADD CONSTRAINT `game_room_quiz_id_quiz_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_room` ADD CONSTRAINT `game_room_creator_id_user_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_answer` ADD CONSTRAINT `room_answer_room_participant_id_room_participant_id_fk` FOREIGN KEY (`room_participant_id`) REFERENCES `room_participant`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_answer` ADD CONSTRAINT `room_answer_question_id_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_answer` ADD CONSTRAINT `room_answer_option_id_option_id_fk` FOREIGN KEY (`option_id`) REFERENCES `option`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_participant` ADD CONSTRAINT `room_participant_room_id_game_room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `game_room`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_participant` ADD CONSTRAINT `room_participant_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `game_room_quiz_id_idx` ON `game_room` (`quiz_id`);--> statement-breakpoint
CREATE INDEX `game_room_creator_id_idx` ON `game_room` (`creator_id`);--> statement-breakpoint
CREATE INDEX `room_answer_participant_id_idx` ON `room_answer` (`room_participant_id`);--> statement-breakpoint
CREATE INDEX `room_participant_room_id_idx` ON `room_participant` (`room_id`);