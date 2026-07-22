CREATE TABLE "chat_sessions_json" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"conversation" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_sessions" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "chat_sessions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "chat_id" SET DATA TYPE uuid;

CREATE TABLE "chat_sessions_json" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"conversation" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);