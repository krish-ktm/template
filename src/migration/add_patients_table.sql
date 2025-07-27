-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone_number VARCHAR(10) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255),
    age INTEGER,
    gender VARCHAR(20),
    address TEXT,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add patient_id to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id);

-- Create an index on phone_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_patients_phone_number ON patients(phone_number);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some example data
INSERT INTO patients (first_name, last_name, phone_number, email, age, gender)
VALUES 
    ('John', 'Doe', '9876543210', 'john@example.com', 35, 'male'),
    ('Jane', 'Smith', '9876543211', 'jane@example.com', 28, 'female')
ON CONFLICT (phone_number) DO NOTHING; 