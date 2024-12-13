CREATE TYPE "app_base"."item_type" AS ENUM('task', 'note');--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_base"."items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"type" "app_base"."item_type" NOT NULL,
	"tags" text[],
	"completed" boolean,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"user_id" uuid,
	"revision" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_base"."sync_clients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_group_id" uuid,
	"revision" bigint NOT NULL,
	"last_mutation_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_base"."items" ADD CONSTRAINT "items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_base"."sync_clients" ADD CONSTRAINT "sync_clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;