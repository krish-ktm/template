-- Start transaction
BEGIN;

-- Create temporary table to store unique patient information
CREATE TEMP TABLE unique_patients AS
SELECT DISTINCT ON (phone)
  phone,
  name,
  age,
  city
FROM appointments
ORDER BY phone, created_at DESC;

-- Insert unique patients into patients table
WITH inserted_patients AS (
  INSERT INTO patients (
    phone_number,
    first_name,
    last_name,
    age,
    address,
    created_at,
    updated_at
  )
  SELECT
    phone,
    -- Split name into first_name and last_name
    CASE 
      WHEN position(' ' in trim(name)) > 0 
      THEN substring(trim(name) from 1 for position(' ' in trim(name)) - 1)
      ELSE trim(name)
    END as first_name,
    -- Get last name (everything after first space)
    CASE 
      WHEN position(' ' in trim(name)) > 0 
      THEN substring(trim(name) from position(' ' in trim(name)) + 1)
      ELSE NULL
    END as last_name,
    NULLIF(age, 0)::integer, -- Convert 0 to NULL
    city,
    NOW(),
    NOW()
  FROM unique_patients
  -- Don't insert if phone number already exists in patients table
  WHERE NOT EXISTS (
    SELECT 1 FROM patients p 
    WHERE p.phone_number = unique_patients.phone
  )
  RETURNING id, phone_number
)
-- Update appointments with patient_id
UPDATE appointments a
SET patient_id = ip.id
FROM inserted_patients ip
WHERE a.phone = ip.phone_number;

-- Update appointments for patients that already existed
UPDATE appointments a
SET patient_id = p.id
FROM patients p
WHERE a.phone = p.phone_number
AND a.patient_id IS NULL;

-- Create index on patient_id for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);

-- Verify migration results
DO $$
DECLARE
  total_appointments INT;
  linked_appointments INT;
  total_unique_phones INT;
  total_patients INT;
BEGIN
  -- Count total appointments
  SELECT COUNT(*) INTO total_appointments FROM appointments;
  
  -- Count linked appointments
  SELECT COUNT(*) INTO linked_appointments 
  FROM appointments 
  WHERE patient_id IS NOT NULL;
  
  -- Count unique phone numbers in appointments
  SELECT COUNT(DISTINCT phone) INTO total_unique_phones 
  FROM appointments;
  
  -- Count total patients
  SELECT COUNT(*) INTO total_patients 
  FROM patients;
  
  -- Raise notice with results
  RAISE NOTICE 'Migration Summary:';
  RAISE NOTICE '- Total Appointments: %', total_appointments;
  RAISE NOTICE '- Linked Appointments: %', linked_appointments;
  RAISE NOTICE '- Unlinked Appointments: %', total_appointments - linked_appointments;
  RAISE NOTICE '- Unique Phone Numbers in Appointments: %', total_unique_phones;
  RAISE NOTICE '- Total Patients After Migration: %', total_patients;
  
  -- Verify all appointments are linked
  IF linked_appointments < total_appointments THEN
    RAISE WARNING 'Some appointments were not linked to patients!';
  ELSE
    RAISE NOTICE 'All appointments successfully linked to patients.';
  END IF;
END $$;

-- Commit transaction
COMMIT; 