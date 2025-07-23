# Quick Start – Clinic Website Template

Welcome!  This guide is written for **non-technical users** who want a beautiful clinic website without worrying about code.

---

## 1. What You Get

✅  Modern, mobile-friendly website  
✅  Online appointment booking  
✅  Admin panel to manage bookings, notices & opening hours  
✅  Multi-language support (English & Gujarati out-of-the-box)  
✅  Search-engine optimisation (SEO) already configured

---

## 2. Three Things You Need

1. **A computer** with internet connection (Windows, macOS, or Linux).  
2. **A free Supabase account** – this stores your appointments and images.  
3. **A hosting account** – we recommend Vercel (free) but Netlify, Firebase or even shared hosting works.

---

## 3. One-Time Setup (15 mins)

### Step 1 – Create Supabase Project

1. Go to **https://supabase.com** → *New project*.
2. Choose a name & region, click **Create project**.
3. Copy these two values (you will need them later):  
   • **Project URL**  
   • **Anon public key**

### Step 2 – Import the Database

1. In Supabase, click **SQL Editor**.
2. Open the `supabase-setup.sql` file (included with the template) and **paste** everything into the editor.
3. Press **RUN**.  This creates all tables, rules and a default admin user.

### Step 3 – Create a Storage Bucket (for notice images)

1. In Supabase, go to **Storage → New bucket**.  
2. Name it **notices** (exact spelling).  
3. Keep *Public bucket* **ON** and save.

➡️  Done!  Supabase is ready.

### Step 4 – Deploy the Website

1. Sign in to **https://vercel.com** with GitHub / GitLab.
2. Click **New Project** → *Import* the repository (or click *Deploy with Vercel* button if provided).
3. When Vercel asks for **Environment Variables**, add:
   - `VITE_SUPABASE_URL` → value from step 3-1
   - `VITE_SUPABASE_ANON_KEY` → value from step 3-1
4. Keep all other settings default → **Deploy**.

After ~1 minute you will get a public URL like `https://your-clinic.vercel.app` – share it with the world!

---

## 4. Logging-in the First Time

Visit `/login` on your website and use:

- **Email:** `admin@example.com`  
- **Password:** `changeme`

👉 **Important:** Change the password immediately in the *Users* section.

---

## 5. Customising the Website (No Coding Needed)

### A. Replace Logo & Images

1. Open the **public** folder in your repo.  
2. Replace `shubham-logo.png`, hero images, gallery photos etc. with your own.  
   • Keep the **same filenames** to avoid code changes.

### B. Update Clinic Details

1. In GitHub, open `src/config/business.ts`.  
2. Edit clinic name, address, email, phone, social links.  
3. Commit → Vercel redeploys automatically.

### C. Edit Services & Prices

1. Go to the **Admin Dashboard** (`/admin`).  
2. Click *Services* section.  
3. Add, edit or delete treatments.  They appear instantly on the public site.

### D. Manage Appointment Slots

1. In Admin, open **Time Management**.  
2. Set working hours, holidays, and slot length (e.g. 15 min).  
3. Patients will only see available times.

### E. Post Notices (Announcements)

1. Admin → **Notice Board**.  
2. Click *New Notice*, upload an image (stored in Supabase) and text.  
3. The notice shows on the home page carousel.

### F. Multi-Language Texts

The template ships with English & Gujarati.  If you would like to edit wording:

1. Go to `src/i18n/translations`.  
2. Open the language file (e.g. `home.ts`).  
3. Change the text between quotes and save.

⚠️  If you add a **brand-new language** you will need a developer to update some code.  Ask us!

---

## 6. Frequently Asked Questions

| Question | Answer |
| -------- | ------ |
| **I forgot the admin password** | Reset in Supabase → Auth → Users → *Reset Password* |
| **How do I change colours/fonts?** | Ask a developer to edit `tailwind.config.js` and `src/theme/colors.ts`. |
| **Can I use my own domain?** | Yes. In Vercel → Settings → Domains add `www.yourclinic.com`.  Update DNS. |
| **Is it GDPR / HIPAA compliant?** | Supabase uses Postgres in EU/US regions. Check your local regulations before collecting sensitive data. |

---

## 7. Need Help?

Email **support@your-template.com** or open an issue in GitHub.  We’re happy to assist ✉️

---

Enjoy your new clinic website and may your bookings be full! 🌟 