-- TFS Database Schema
-- Node-based hierarchical structure where entities can appear multiple times

-- Drop tables if they exist (for clean re-initialization)
DROP TABLE IF EXISTS hierarchy CASCADE;
DROP TABLE IF EXISTS entities CASCADE;

-- Entities table: stores unique business entities
CREATE TABLE entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- discriminator: 'company', 'department', 'project', etc.
    legal_type VARCHAR(100), -- nullable, only for legal entities
    registration_number VARCHAR(100), -- nullable
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on entity_type for TPH pattern queries
CREATE INDEX idx_entities_entity_type ON entities(entity_type);
CREATE INDEX idx_entities_is_active ON entities(is_active);

-- Hierarchy table: stores tree nodes (entities can appear multiple times)
CREATE TABLE hierarchy (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES hierarchy(id) ON DELETE CASCADE, -- null for root nodes
    level INTEGER DEFAULT 0, -- depth in tree (0 = root)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for hierarchy queries
CREATE INDEX idx_hierarchy_entity_id ON hierarchy(entity_id);
CREATE INDEX idx_hierarchy_parent_id ON hierarchy(parent_id);
CREATE INDEX idx_hierarchy_level ON hierarchy(level);

-- Prevent circular references (optional constraint)
-- Note: This is a simple check, for complex scenarios consider recursive CTE checks
CREATE OR REPLACE FUNCTION prevent_circular_reference()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent node from being its own parent
    IF NEW.id = NEW.parent_id THEN
        RAISE EXCEPTION 'Node cannot be its own parent';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_circular_reference
    BEFORE UPDATE ON hierarchy
    FOR EACH ROW
    EXECUTE FUNCTION prevent_circular_reference();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_entities_updated_at
    BEFORE UPDATE ON entities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - remove if not needed)
INSERT INTO entities (name, entity_type, legal_type, registration_number) VALUES
    ('Acme Corporation', 'company', 'AB', '556123-4567'),
    ('Engineering Department', 'department', NULL, NULL),
    ('Sales Department', 'department', NULL, NULL),
    ('Project Alpha', 'project', NULL, NULL),
    ('Project Beta', 'project', NULL, NULL);

-- Sample hierarchy (optional - remove if not needed)
-- Root: Acme Corporation
INSERT INTO hierarchy (entity_id, parent_id, level) VALUES (1, NULL, 0);

-- Children of Acme (Engineering and Sales departments)
INSERT INTO hierarchy (entity_id, parent_id, level) VALUES (2, 1, 1); -- Engineering under Acme
INSERT INTO hierarchy (entity_id, parent_id, level) VALUES (3, 1, 1); -- Sales under Acme

-- Projects under Engineering
INSERT INTO hierarchy (entity_id, parent_id, level) VALUES (4, 2, 2); -- Project Alpha under Engineering
INSERT INTO hierarchy (entity_id, parent_id, level) VALUES (5, 2, 2); -- Project Beta under Engineering

-- Example: Project Alpha also appears under Sales (same entity, different parent)
INSERT INTO hierarchy (entity_id, parent_id, level) VALUES (4, 3, 2); -- Project Alpha also under Sales

-- Useful queries (commented out, for reference)

-- Get all children of a node
-- SELECT h2.*, e.name
-- FROM hierarchy h1
-- JOIN hierarchy h2 ON h2.parent_id = h1.id
-- JOIN entities e ON h2.entity_id = e.id
-- WHERE h1.id = 1;

-- Get full path to a node (recursive CTE)
-- WITH RECURSIVE node_path AS (
--     SELECT id, entity_id, parent_id, 1 as depth
--     FROM hierarchy
--     WHERE id = 5
--     UNION ALL
--     SELECT h.id, h.entity_id, h.parent_id, np.depth + 1
--     FROM hierarchy h
--     JOIN node_path np ON h.id = np.parent_id
-- )
-- SELECT np.depth, e.name, e.entity_type
-- FROM node_path np
-- JOIN entities e ON np.entity_id = e.id
-- ORDER BY np.depth DESC;

-- Get all occurrences of an entity in the tree
-- SELECT h.id as node_id, h.parent_id, e.name
-- FROM hierarchy h
-- JOIN entities e ON h.entity_id = e.id
-- WHERE e.id = 4;
