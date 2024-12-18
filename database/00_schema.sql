CREATE TYPE "app_base"."item_type" AS ENUM('task', 'note');--> statement-breakpoint

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
	"revision" bigint NOT NULL,
	"parent_id" uuid,
	"path" text[] DEFAULT '{}' NOT NULL,
	"is_expanded" boolean DEFAULT true,
	"order" integer DEFAULT 0 NOT NULL
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
ALTER TABLE "app_base"."items" ADD CONSTRAINT "items_parent_id_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "app_base"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_base"."sync_clients" ADD CONSTRAINT "sync_clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;

-- -- Update item path
-- CREATE OR REPLACE FUNCTION app_base.update_item_path()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.parent_id IS NULL THEN
--         -- Root item
--         NEW.path = ARRAY[];
--     ELSE
--         -- Get parent's path and append parent's ID
--         SELECT path || NEW.parent_id INTO NEW.path
--         FROM app_base.items
--         WHERE id = NEW.parent_id;
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Trigger to automatically manage paths on insert/update
-- CREATE TRIGGER manage_item_path
--     BEFORE INSERT OR UPDATE OF parent_id ON app_base.items
--     FOR EACH ROW
--     EXECUTE FUNCTION app_base.update_item_path();

-- -- Update order of all items with the same parent
-- CREATE OR REPLACE FUNCTION app_base.manage_item_order()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     specified_order INTEGER;
-- BEGIN
--     -- For INSERT: if order is 0 (default), put it at the end
--     IF TG_OP = 'INSERT' AND NEW.order = 0 THEN
--         SELECT COALESCE(MAX("order") + 1, 0) INTO NEW.order
--         FROM app_base.items
--         WHERE parent_id IS NOT DISTINCT FROM NEW.parent_id;
--         RETURN NEW;
--     END IF;

--     -- For UPDATE: if order hasn't changed, do nothing
--     IF TG_OP = 'UPDATE' AND NEW.order = OLD.order AND NEW.parent_id IS NOT DISTINCT FROM OLD.parent_id THEN
--         RETURN NEW;
--     END IF;

--     -- Store the specified order
--     specified_order := NEW.order;

--     -- Reorder siblings when order was explicitly specified
--     UPDATE app_base.items
--     SET "order" = CASE
--         -- Items that come after the insertion point need to move up
--         WHEN "order" >= specified_order AND id != NEW.id THEN "order" + 1
--         -- The item being inserted/moved gets the specified order
--         WHEN id = NEW.id THEN specified_order
--         ELSE "order"
--     END
--     WHERE parent_id IS NOT DISTINCT FROM NEW.parent_id;

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Trigger to automatically manage orders on insert/update
-- CREATE TRIGGER manage_item_order
--     BEFORE INSERT OR UPDATE OF "order", parent_id ON app_base.items
--     FOR EACH ROW
--     EXECUTE FUNCTION app_base.manage_item_order();
