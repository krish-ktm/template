-- Migration to add appointment booking settings
-- This allows admin to configure how users can select appointment dates

CREATE TABLE IF NOT EXISTS appointment_booking_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Create trigger for updated_at
CREATE TRIGGER update_appointment_booking_settings_updated_at
    BEFORE UPDATE ON appointment_booking_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default booking settings
INSERT INTO appointment_booking_settings (setting_key, setting_value, is_active) VALUES 
(
    'date_selection_options', 
    '{
        "today": {"enabled": true, "label": {"en": "Today", "gu": "આજે"}},
        "tomorrow": {"enabled": true, "label": {"en": "Tomorrow", "gu": "આવતીકાલે"}},
        "week": {"enabled": false, "label": {"en": "This Week", "gu": "આ અઠવાડિયે"}, "days": 7},
        "calendar": {"enabled": false, "label": {"en": "Choose Date", "gu": "તારીખ પસંદ કરો"}, "maxDaysAhead": 30}
    }',
    true
),
(
    'booking_restrictions',
    '{
        "minDaysAhead": 0,
        "maxDaysAhead": 30,
        "allowWeekends": false,
        "allowPastDates": false
    }',
    true
);

-- Add comment
COMMENT ON TABLE appointment_booking_settings IS 'Stores configuration for appointment booking date selection options';