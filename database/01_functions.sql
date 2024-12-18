
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
