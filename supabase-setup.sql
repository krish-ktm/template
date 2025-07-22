-- Create the `users` table first, as it is referenced by other tables.
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE NULL,
  status TEXT NULL DEFAULT 'active'::TEXT,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_role_check CHECK (
    role = ANY (ARRAY['superadmin'::TEXT, 'receptionist'::TEXT])
  ),
  CONSTRAINT users_status_check CHECK (
    status = ANY (ARRAY['active'::TEXT, 'inactive'::TEXT])
  )
) TABLESPACE pg_default;

-- Create `appointment_rules` table, which is not referenced by any other table but can be updated by others.
CREATE TABLE public.appointment_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title JSONB NOT NULL DEFAULT '{}'::JSONB,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT appointment_rules_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create the `clinic_closure_dates` table, which references `users`.
CREATE TABLE public.clinic_closure_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  created_by UUID NULL,
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT clinic_closure_dates_pkey PRIMARY KEY (id),
  CONSTRAINT clinic_closure_dates_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create `doctor_messages` table, which references `users`.
CREATE TABLE public.doctor_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  message_en TEXT NOT NULL,
  active BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  created_by UUID NULL,
  message_gu TEXT NULL,
  CONSTRAINT doctor_messages_pkey PRIMARY KEY (id),
  CONSTRAINT doctor_messages_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create `image_download_rules` table.
CREATE TABLE public.image_download_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title JSONB NOT NULL DEFAULT '{}'::JSONB,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT image_download_rules_pkey PRIMARY KEY (id),
  CONSTRAINT image_download_rules_type_check CHECK ((type = ANY (ARRAY['patient'::TEXT, 'mr'::TEXT])))
) TABLESPACE pg_default;

-- Create `mr_closure_dates` table, which references `users`.
CREATE TABLE public.mr_closure_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  created_by UUID NULL,
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT mr_closure_dates_pkey PRIMARY KEY (id),
  CONSTRAINT mr_closure_dates_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create `mr_appointments` table, which will not reference other tables directly for now.
CREATE TABLE public.mr_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  mr_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  division_name TEXT NOT NULL,
  contact_no TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  status TEXT NULL DEFAULT 'pending'::TEXT,
  appointment_time TEXT NULL,
  time_slot_id UUID NULL,
  CONSTRAINT mr_appointments_pkey PRIMARY KEY (id),
  CONSTRAINT mr_appointments_status_check CHECK (
    status = ANY (ARRAY['pending'::TEXT, 'completed'::TEXT, 'cancelled'::TEXT])
  )
) TABLESPACE pg_default;

-- Create `mr_weekdays` table.
CREATE TABLE public.mr_weekdays (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  is_working BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  slots JSONB NULL DEFAULT '[]'::JSONB,
  CONSTRAINT mr_weekdays_pkey PRIMARY KEY (id),
  CONSTRAINT mr_weekdays_day_check CHECK (
    day = ANY (ARRAY['Sunday'::TEXT, 'Monday'::TEXT, 'Tuesday'::TEXT, 'Wednesday'::TEXT, 'Thursday'::TEXT, 'Friday'::TEXT, 'Saturday'::TEXT])
  )
) TABLESPACE pg_default;

-- Create `notices` table, which references `users`.
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title JSONB NOT NULL,
  content JSONB NULL,
  formatted_content JSONB NULL,
  images TEXT[] NULL,
  active BOOLEAN NULL DEFAULT true,
  "order" INTEGER NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  created_by UUID NULL,
  CONSTRAINT notices_pkey PRIMARY KEY (id),
  CONSTRAINT notices_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create `appointments` table, which does not reference any other table directly but should be created early.
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  city TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  status TEXT NULL DEFAULT 'pending'::TEXT,
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT valid_age CHECK (
    (age >= 0) AND (age <= 120)
  )
) TABLESPACE pg_default;

-- Create `working_hours` table.
CREATE TABLE public.working_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  is_working BOOLEAN NULL DEFAULT true,
  morning_start TEXT NULL,
  morning_end TEXT NULL,
  evening_start TEXT NULL,
  evening_end TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  slot_interval INTEGER NULL DEFAULT 30,
  slots JSONB NULL DEFAULT '[]'::JSONB,
  CONSTRAINT working_hours_pkey PRIMARY KEY (id),
  CONSTRAINT working_hours_day_check CHECK (
    day = ANY (ARRAY['Sunday'::TEXT, 'Monday'::TEXT, 'Tuesday'::TEXT, 'Wednesday'::TEXT, 'Thursday'::TEXT, 'Friday'::TEXT, 'Saturday'::TEXT])
  ),
  CONSTRAINT working_hours_slot_interval_check CHECK (slot_interval = ANY (ARRAY[15, 30]))
) TABLESPACE pg_default;

create table public.contact_messages (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  is_read boolean null default false,
  constraint contact_messages_pkey primary key (id)
) TABLESPACE pg_default;

-- Triggers to update `updated_at` column for certain tables.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW(); -- Set the updated_at to the current timestamp
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for `updated_at` column in tables
CREATE TRIGGER update_clinic_closure_dates_updated_at
BEFORE UPDATE ON clinic_closure_dates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_messages_updated_at
BEFORE UPDATE ON doctor_messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_download_rules_updated_at
BEFORE UPDATE ON image_download_rules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mr_closure_dates_updated_at
BEFORE UPDATE ON mr_closure_dates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mr_weekdays_updated_at
BEFORE UPDATE ON mr_weekdays
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_working_hours_updated_at
BEFORE UPDATE ON working_hours
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO users (email, password, role, name, status)
VALUES ('admin@example.com', '$2b$10$qV8tZ.LE0J5kxAkRJ2/aU.5WLrFL982JkBZZZBppur5J01KrpgEI.', 'superadmin', 'Admin User', 'active');

INSERT INTO working_hours (day, is_working, morning_start, morning_end, evening_start, evening_end, slot_interval, slots) VALUES
('Tuesday', true, '09:30 AM', '12:30 PM', '04:30 PM', '06:30 PM', '15', '[{"time":"09:30 AM","maxBookings":3},{"time":"09:45 AM","maxBookings":3},{"time":"10:00 AM","maxBookings":3},{"time":"10:15 AM","maxBookings":3},{"time":"10:30 AM","maxBookings":3},{"time":"10:45 AM","maxBookings":3},{"time":"11:00 AM","maxBookings":3},{"time":"11:15 AM","maxBookings":3},{"time":"11:30 AM","maxBookings":3},{"time":"11:45 AM","maxBookings":3},{"time":"12:00 PM","maxBookings":3},{"time":"12:15 PM","maxBookings":3},{"time":"12:30 PM","maxBookings":3},{"time":"04:30 PM","maxBookings":3},{"time":"04:45 PM","maxBookings":3},{"time":"05:00 PM","maxBookings":3},{"time":"05:15 PM","maxBookings":3},{"time":"05:30 PM","maxBookings":3},{"time":"05:45 PM","maxBookings":3},{"time":"06:00 PM","maxBookings":3},{"time":"06:15 PM","maxBookings":3},{"time":"06:30 PM","maxBookings":3}]'),
('Wednesday', true, '09:30 AM', '12:00 PM', '04:30 PM', '06:30 PM', '15', '[{"time":"09:30 AM","maxBookings":3},{"time":"09:45 AM","maxBookings":3},{"time":"10:00 AM","maxBookings":3},{"time":"10:15 AM","maxBookings":3},{"time":"10:30 AM","maxBookings":3},{"time":"10:45 AM","maxBookings":3},{"time":"11:00 AM","maxBookings":3},{"time":"11:15 AM","maxBookings":3},{"time":"11:30 AM","maxBookings":3},{"time":"11:45 AM","maxBookings":3},{"time":"12:00 PM","maxBookings":3},{"time":"04:30 PM","maxBookings":3},{"time":"04:45 PM","maxBookings":3},{"time":"05:00 PM","maxBookings":3},{"time":"05:15 PM","maxBookings":3},{"time":"05:30 PM","maxBookings":3},{"time":"05:45 PM","maxBookings":3},{"time":"06:00 PM","maxBookings":3},{"time":"06:15 PM","maxBookings":3},{"time":"06:30 PM","maxBookings":3}]'),
('Thursday', true, '09:30 AM', '12:00 PM', '04:30 PM', '06:30 PM', '15', '[{"time":"09:30 AM","maxBookings":3},{"time":"09:45 AM","maxBookings":3},{"time":"10:00 AM","maxBookings":3},{"time":"10:15 AM","maxBookings":3},{"time":"10:30 AM","maxBookings":3},{"time":"10:45 AM","maxBookings":3},{"time":"11:00 AM","maxBookings":3},{"time":"11:15 AM","maxBookings":3},{"time":"11:30 AM","maxBookings":3},{"time":"11:45 AM","maxBookings":3},{"time":"12:00 PM","maxBookings":3},{"time":"04:30 PM","maxBookings":3},{"time":"04:45 PM","maxBookings":3},{"time":"05:00 PM","maxBookings":3},{"time":"05:15 PM","maxBookings":3},{"time":"05:30 PM","maxBookings":3},{"time":"05:45 PM","maxBookings":3},{"time":"06:00 PM","maxBookings":3},{"time":"06:15 PM","maxBookings":3},{"time":"06:30 PM","maxBookings":3}]'),
('Monday', true, '09:30 AM', '12:30 PM', '04:30 PM', '06:30 PM', '15', '[{"time":"09:30 AM","maxBookings":3},{"time":"09:45 AM","maxBookings":3},{"time":"10:00 AM","maxBookings":3},{"time":"10:15 AM","maxBookings":3},{"time":"10:30 AM","maxBookings":3},{"time":"10:45 AM","maxBookings":3},{"time":"11:00 AM","maxBookings":3},{"time":"11:15 AM","maxBookings":3},{"time":"11:30 AM","maxBookings":3},{"time":"11:45 AM","maxBookings":3},{"time":"12:00 PM","maxBookings":3},{"time":"12:15 PM","maxBookings":3},{"time":"12:30 PM","maxBookings":3},{"time":"04:30 PM","maxBookings":3},{"time":"04:45 PM","maxBookings":3},{"time":"05:00 PM","maxBookings":3},{"time":"05:15 PM","maxBookings":3},{"time":"05:30 PM","maxBookings":3},{"time":"05:45 PM","maxBookings":3},{"time":"06:00 PM","maxBookings":3},{"time":"06:15 PM","maxBookings":3},{"time":"06:30 PM","maxBookings":3}]');

INSERT INTO mr_weekdays (day, is_working, slots)
VALUES
    ('Sunday', false, '[]'),
    ('Monday', true, '[{"time": "10:00", "maxBookings": 2}, {"time": "11:00", "maxBookings": 2}, {"time": "12:00", "maxBookings": 2}, {"time": "16:00", "maxBookings": 2}, {"time": "17:00", "maxBookings": 2}, {"time": "18:00", "maxBookings": 2}]'),
    ('Tuesday', true, '[{"time": "10:00", "maxBookings": 2}, {"time": "11:00", "maxBookings": 2}, {"time": "12:00", "maxBookings": 2}, {"time": "16:00", "maxBookings": 2}, {"time": "17:00", "maxBookings": 2}, {"time": "18:00", "maxBookings": 2}]'),
    ('Wednesday', true, '[{"time": "10:00", "maxBookings": 2}, {"time": "11:00", "maxBookings": 2}, {"time": "12:00", "maxBookings": 2}, {"time": "16:00", "maxBookings": 2}, {"time": "17:00", "maxBookings": 2}, {"time": "18:00", "maxBookings": 2}]'),
    ('Thursday', true, '[{"time": "10:00", "maxBookings": 2}, {"time": "11:00", "maxBookings": 2}, {"time": "12:00", "maxBookings": 2}, {"time": "16:00", "maxBookings": 2}, {"time": "17:00", "maxBookings": 2}, {"time": "18:00", "maxBookings": 2}]'),
    ('Friday', true, '[{"time": "10:00", "maxBookings": 2}, {"time": "11:00", "maxBookings": 2}, {"time": "12:00", "maxBookings": 2}, {"time": "16:00", "maxBookings": 2}, {"time": "17:00", "maxBookings": 2}, {"time": "18:00", "maxBookings": 2}]'),
    ('Saturday', true, '[{"time": "10:00", "maxBookings": 2}, {"time": "11:00", "maxBookings": 2}, {"time": "12:00", "maxBookings": 2}]');

INSERT INTO public.image_download_rules (id, type, title, content, "order", is_active) VALUES 
('54142068-325e-4d85-b07b-244dd4bdb9ed', 'mr', '{"en": "Important Notes", "gu": "મહત્વપૂર્ણ નોંધ"}', '{"en": "- Please arrive 10 minutes before your appointment time\\n- Bring your company ID card and visiting card\\n", "gu": "- કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો\\n- તમારું કંપની ID કાર્ડ અને વિઝિટિંગ કાર્ડ લાવો\\n"}', '1', 'true'), 
('829815dd-27f0-49eb-a775-6b1fd77c3073', 'patient', '{"en": "Important Notes", "gu": "સૂચનાઓ"}', '{"en": "- Please arrive before 10 minutes of your appointment \\n- Bring old files and records with you. ", "gu": "- તમને આપેલા સમય થી ૧૦ મિનિટ વહેલા આવવું. \\n- જૂની  ફાઇલ્સ અને કોઈ રિપોર્ટ હોય તો સાથે લાવવા. "}', '1', 'true');
