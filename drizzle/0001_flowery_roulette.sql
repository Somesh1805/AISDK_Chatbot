ALTER TABLE "chat_sessions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "chat_sessions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "chat_id" SET DATA TYPE text;