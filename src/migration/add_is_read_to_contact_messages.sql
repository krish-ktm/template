-- Check if the is_read column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contact_messages' 
        AND column_name = 'is_read'
    ) THEN
        -- Add the is_read column with default value false
        ALTER TABLE contact_messages 
        ADD COLUMN is_read BOOLEAN DEFAULT false;
        
        -- Add a comment to explain what the column is for
        COMMENT ON COLUMN contact_messages.is_read IS 'Indicates whether the message has been read by an admin';
    END IF;
END $$; 