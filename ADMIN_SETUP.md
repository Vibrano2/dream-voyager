# Admin Dashboard Setup Guide

## 🔐 Creating an Admin User

Since your app uses Supabase authentication, you need to create an admin user in your Supabase database.

### Method 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `envdukupdubtajuxexjv`

2. **Create User**
   - Navigate to: **Authentication** → **Users**
   - Click **"Add user"** or **"Invite user"**
   - Enter email and password
   - Click **"Create user"**

3. **Set Admin Role**
   - Click on the newly created user
   - Scroll to **"Raw User Meta Data"** section
   - Add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
   - Click **"Save"**

### Method 2: Via SQL Editor

1. **Go to SQL Editor** in Supabase Dashboard
2. **Run this query** (replace with your details):

```sql
-- First, create the user via Supabase Auth UI or API
-- Then update their role:
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@dreamvoyager.com';
```

### Method 3: Create Profile Entry

If you have a `profiles` table, also run:

```sql
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@dreamvoyager.com'),
  'admin@dreamvoyager.com',
  'Admin User',
  'admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
```

## 🚀 Accessing Admin Dashboard

### Local Development

1. **Start the dev server** (if not running):
   ```bash
   cd client
   npm run dev
   ```

2. **Navigate to Admin Login**:
   - URL: http://localhost:5174/admin/login
   - Or click "Agent Login" in the top bar

3. **Login with admin credentials**:
   - Email: `admin@dreamvoyager.com` (or your admin email)
   - Password: Your admin password

4. **Access Admin Dashboard**:
   - After successful login, you'll be redirected to: http://localhost:5174/admin

### Admin Dashboard Features

- **Dashboard** (`/admin`) - Overview and statistics
- **Bookings** (`/admin/bookings`) - Manage all bookings
- **Packages** (`/admin/packages`) - Manage travel packages
- **Users** (`/admin/users`) - Manage users
- **Settings** (`/admin/settings`) - System settings

## 🌐 cPanel Deployment

### Building for Production

1. **Build the React app**:
   ```bash
   cd client
   npm run build
   ```

2. **Upload to cPanel**:
   - Upload contents of `client/dist` folder to `public_html`
   - Ensure `.htaccess` is configured for React Router

### Backend Setup on cPanel

1. **Upload server files**:
   - Upload `server` folder to your hosting
   - Install dependencies: `npm install`

2. **Configure environment**:
   - Create `.env` file with your Supabase credentials
   - Set `CLIENT_URL` to your domain

3. **Start Node.js app**:
   - Use cPanel's Node.js app manager
   - Set entry point to `server/index.js`
   - Start the application

### Access Admin Panel

- Production URL: `https://yourdomain.com/admin/login`

## 🔒 Security Notes

1. **Strong Password**: Use a strong password for admin account
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` files
4. **Role Verification**: Admin routes check for `role: 'admin'`

## 📝 Default Admin Credentials

**For Testing Only:**
- Email: `admin@dreamvoyager.com`
- Password: Set this in Supabase when creating the user

**Change these immediately in production!**

## ❓ Troubleshooting

### "Access denied. Admin privileges required"
- Check that user's `raw_user_meta_data` contains `"role": "admin"`
- Verify in Supabase Dashboard → Authentication → Users

### "Failed to login"
- Check Supabase credentials in `.env`
- Verify backend server is running
- Check browser console for errors

### Can't access admin routes
- Ensure you're logged in with admin account
- Clear browser cache and cookies
- Check that `AdminLayout` is receiving user data

## 🎯 Next Steps

1. Create your admin user in Supabase
2. Test login at `/admin/login`
3. Verify access to all admin pages
4. Customize admin dashboard as needed
