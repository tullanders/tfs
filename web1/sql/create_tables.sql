-- ============================================
-- Entity Status Lookup Table
-- ============================================
CREATE TABLE entity_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    -- enum values: 'Archived', 'Published', 'Draft'
    CONSTRAINT chk_entity_status_name CHECK (name IN ('Archived', 'Published', 'Draft'))
);

-- Insert default status values
INSERT INTO entity_status (name) VALUES ('Draft'), ('Published'), ('Archived');

-- ============================================
-- Legal Entity Table
-- ============================================
CREATE TABLE legal (
    id SERIAL PRIMARY KEY,
    local_id VARCHAR(100) NOT NULL,
    local_id_source VARCHAR(100),
    internal_name VARCHAR(255) NOT NULL,
    
    -- Foreign keys to other entities
    business_equivalent INT NULL,
    financial_equivalent INT NULL,
    
    -- Current status (foreign key to entity_status)
    current_status INT NOT NULL,
    
    -- Official legal name validity periods (commented out in model, keeping as optional)
    -- current_official_legal_name_valid_from TIMESTAMP,
    -- current_official_legal_name_valid_to TIMESTAMP,
    -- upcoming_official_legal_name_valid_from TIMESTAMP,
    
    -- Registration and codes
    local_official_registration_number VARCHAR(100),
    internal_code_1 VARCHAR(50),
    internal_code_2 VARCHAR(50),
    internal_code_3 VARCHAR(50),
    internal_code_4 VARCHAR(50),
    
    -- Country reference (ISO Alpha-3 code)
    country_alpha3_code CHAR(3) NOT NULL,
    
    -- Employee information
    has_employee BOOLEAN NOT NULL DEFAULT false,
    number_of_employee INT NULL,
    
    -- Legal type and setup references
    legal_type_id INT NOT NULL,
    legal_setup_id INT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_legal_entity_status FOREIGN KEY (current_status) 
        REFERENCES entity_status(id)
);

-- Indexes
CREATE INDEX idx_legal_local_id ON legal(local_id);
CREATE INDEX idx_legal_country_code ON legal(country_alpha3_code);
CREATE INDEX idx_legal_status ON legal(current_status);
CREATE INDEX idx_legal_type_id ON legal(legal_type_id);

-- ============================================
-- Ownership Relationship Table
-- ============================================
CREATE TABLE owns (
    id SERIAL PRIMARY KEY,
    legal_id INT NOT NULL,
    owned_legal_id INT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_owns_legal_owner FOREIGN KEY (legal_id) 
        REFERENCES legal(id) ON DELETE NO ACTION,
    CONSTRAINT fk_owns_legal_owned FOREIGN KEY (owned_legal_id) 
        REFERENCES legal(id) ON DELETE NO ACTION,
    
    -- Constraints
    CONSTRAINT chk_owns_percentage CHECK (percentage >= 0 AND percentage <= 100),
    CONSTRAINT chk_owns_different_entities CHECK (legal_id != owned_legal_id),
    
    -- Prevent duplicate ownership records
    CONSTRAINT uq_owns_legal_owned UNIQUE (legal_id, owned_legal_id)
);

-- Indexes
CREATE INDEX idx_owns_legal_id ON owns(legal_id);
CREATE INDEX idx_owns_owned_legal_id ON owns(owned_legal_id);

-- ============================================
-- Function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for legal table
CREATE TRIGGER tr_legal_updated_at
    BEFORE UPDATE ON legal
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for owns table
CREATE TRIGGER tr_owns_updated_at
    BEFORE UPDATE ON owns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comments/Documentation
-- ============================================
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Core legal entity table storing company/organization information',
    @level0type = N'SCHEMA', @level0name = 'dbo',
-- ============================================
-- Comments/Documentation
-- ============================================
COMMENT ON TABLE legal IS 'Core legal entity table storing company/organization information';
COMMENT ON TABLE owns IS 'Tracks ownership relationships between legal entities with percentage ownership';
COMMENT ON TABLE entity_status IS 'Status lookup table for entity lifecycle states';