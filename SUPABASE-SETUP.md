# Supabase Setup Instructions

Follow these steps to set up the appointment system on a new Supabase account:

## 1. Create a Supabase Project

1. Sign up for a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one
2. Create a new project from the Supabase dashboard
3. Note down your project URL and anon key (you'll need these later)

## 2. Database Setup

1. In your Supabase project, navigate to the SQL Editor
2. Open the `supabase-setup.sql` file from this repository
3. Copy and paste its contents into the SQL Editor
4. Run the script to create all the necessary tables, policies, and initial data

## 3. Storage Setup

Create the following storage bucket:

1. Navigate to Storage in your Supabase dashboard
2. Click "Create a new bucket"
3. Name the bucket `notices` (must be exactly this name)
4. For the bucket access:
   - Set "Public bucket" to ON (to allow public access to images)
5. Create the bucket
6. After creation, navigate to the bucket's policies
7. Set up the following policies:
   - For Select (Read) operations: Make it publicly accessible
   - For Insert/Update/Delete operations: Restrict to authenticated users

This bucket is used for storing notice/announcement images that are displayed on the website.

## 4. Update Environment Variables

1. Create a `.env` file in your project root (or update the existing one) with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from your new Supabase project.

## 5. Initial Login

1. After setting up the database and deploying your application, you can log in with:
   - Email: admin@example.com
   - Password: changeme

2. **IMPORTANT:** Change this password immediately after your first login for security reasons.

## 6. Common Issues

- If you encounter RLS (Row Level Security) errors, you may need to adjust the policies in the Supabase dashboard
- Check for any table constraints that might be preventing data operations
- Verify that all environment variables are correctly set
- If images aren't displaying, check the storage bucket policies to ensure public access is enabled

## 7. Additional Configuration

Depending on your specific implementation, you might need to:

1. Set up email services if the application uses email notifications
2. Configure third-party integrations
3. Adjust application settings through the admin dashboard

For any assistance, please refer to the Supabase documentation at [https://supabase.com/docs](https://supabase.com/docs). 