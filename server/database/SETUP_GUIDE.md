# Dream Voyager - External Services Setup Guide

This guide will help you set up the required external services for Dream Voyager.

## 1. Supabase Setup (Database & Authentication)

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (free tier available)
3. Sign in with GitHub or email
4. Click "New Project"
5. Fill in:
   - **Name**: Dream Voyager
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project" (takes ~2 minutes)

### Step 2: Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `server/database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" (bottom right)
6. You should see "Success. No rows returned"

### Step 3: Get API Keys
1. Go to **Settings** > **API** (left sidebar)
2. Copy these values to your `server/.env`:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 4: Enable Email Authentication
1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional for now)

---

## 2. Resend Setup (Email Service)

### Step 1: Create Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Click "Get Started" (free tier: 3,000 emails/month)
3. Sign up with email or GitHub

### Step 2: Get API Key
1. After signup, go to **API Keys** in dashboard
2. Click "Create API Key"
3. Name it: "Dream Voyager Production"
4. Copy the key (starts with `re_`)
5. Add to `server/.env` as `RESEND_API_KEY`

### Step 3: Verify Domain (Optional - for production)
1. Go to **Domains** in Resend dashboard
2. Add your domain (e.g., dreamvoyager.com)
3. Add DNS records as shown
4. For development, you can use `onboarding@resend.dev`

---

## 3. Paystack Setup (Payment Gateway)

### Step 1: Create Paystack Account
1. Go to [https://paystack.com](https://paystack.com)
2. Click "Get Started"
3. Sign up (requires Nigerian phone number or business)
4. Complete KYC verification (for live mode)

### Step 2: Get Test API Keys
1. Log in to Paystack Dashboard
2. Go to **Settings** > **API Keys & Webhooks**
3. Copy **Test Keys**:
   - **Test Secret Key** (starts with `sk_test_`) → `PAYSTACK_SECRET_KEY`
   - **Test Public Key** (starts with `pk_test_`) → `PAYSTACK_PUBLIC_KEY`
4. Add both to `server/.env`

### Step 3: Configure Webhook (Later)
1. In Paystack dashboard, go to **Settings** > **API Keys & Webhooks**
2. Add webhook URL: `https://your-domain.com/api/payments/webhook`
3. Select events: `charge.success`, `charge.failed`
4. Copy webhook secret for verification

---

## 4. Update Your .env File

After getting all keys, your `server/.env` should look like:

```env
PORT=5000

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# App Settings
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 5. Verify Setup

Run these commands to verify:

```bash
# Test database connection
npm run dev

# Check server logs for:
# ✓ Server running on port 5000
# ✓ No Supabase errors
```

---

## Troubleshooting

### Supabase Connection Error
- Check `SUPABASE_URL` format: `https://xxxxx.supabase.co`
- Verify keys are copied completely (very long strings)
- Check project is not paused (free tier pauses after 1 week inactivity)

### Resend Email Not Sending
- Verify API key starts with `re_`
- Check email quota (3,000/month on free tier)
- Use `onboarding@resend.dev` as sender for testing

### Paystack Payment Fails
- Ensure using **test keys** (start with `sk_test_` and `pk_test_`)
- Test card: `4084084084084081` (Paystack test card)
- Check webhook URL is accessible (use ngrok for local testing)

---

## Next Steps

Once all services are configured:
1. Restart your server: `npm run dev`
2. Test user registration
3. Test package browsing
4. Test booking creation
5. Test payment flow

Need help? Check the official docs:
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Paystack Docs](https://paystack.com/docs)
