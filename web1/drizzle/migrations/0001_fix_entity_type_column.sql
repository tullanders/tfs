-- Fix entity_type column type from varchar to integer
ALTER TABLE entities 
ALTER COLUMN entity_type TYPE integer USING 
  CASE 
    WHEN entity_type = 'Legal' THEN 1
    WHEN entity_type = 'Business' THEN 2
    WHEN entity_type = 'Operations' THEN 3
    WHEN entity_type = 'Regional' THEN 4
    WHEN entity_type = 'Board' THEN 5
    WHEN entity_type = 'ReportingUnit' THEN 6
    ELSE entity_type::integer
  END;

-- Do the same for status if needed
-- ALTER TABLE entities 
-- ALTER COLUMN status TYPE integer USING status::integer;
