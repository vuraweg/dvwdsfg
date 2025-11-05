# Supabase Dashboard Setup for Password Reset

## Quick Start Guide

Follow these steps to configure your Supabase project for the new password reset system.

---

## Step 1: Configure Redirect URLs

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project: PrimoBoost AI

2. **Navigate to Authentication Settings**
   - Click **Authentication** in left sidebar
   - Click **URL Configuration**

3. **Update Site URL**
   ```
   Site URL: https://primoboostai.in
   ```

4. **Update Redirect URLs**

   **IMPORTANT:** Remove any existing URLs and add only these two:
   ```
   https://primoboostai.in/**
   https://www.primoboostai.in/**
   ```

   ⚠️ **The `**` wildcard is critical!** It allows Supabase to append query parameters like `?token=...&type=recovery`

5. **Click "Save"**

---

## Step 2: Configure Email Template

1. **Navigate to Email Templates**
   - Click **Authentication** in left sidebar
   - Click **Email Templates**
   - Select **"Reset Password"** from the list

2. **Update Subject Line**
   ```
   Reset Your Password - PrimoBoost AI
   ```

3. **Update Email Content**

   Copy the entire HTML template from `PASSWORD_RESET_EMAIL_TEMPLATE.md` file and paste it into the email body editor.

   The template includes:
   - PrimoBoost AI branding
   - Security warnings
   - Clear call-to-action button
   - Best practices for password security

4. **Preview the Email**
   - Click "Preview" to see how it looks
   - Test in different email clients if possible

5. **Click "Save"**

---

## Step 3: Verify Email Service

1. **Check Email Provider**
   - Go to **Settings** → **Project Settings** → **Auth**
   - Under "SMTP Settings", verify your email provider is configured
   - If using default Supabase email (recommended for testing), no action needed

2. **Test Email Sending**
   - Create a test user account
   - Request password reset
   - Check if email is received

---

## Step 4: Test the Flow

### Basic Test
1. Go to your app: https://primoboostai.in
2. Click "Forgot Password?"
3. Enter your email address
4. Check your inbox for reset email
5. Click the "Reset Your Password" button
6. Verify the modal opens correctly
7. Set a new password
8. Verify auto-login works

### Rate Limit Test
1. Request password reset for same email
2. Repeat 2 more times (3 total)
3. Try a 4th time
4. Should see: "Too many password reset attempts. Please try again in X minutes."
5. Verify countdown timer works
6. Wait for timer or wait 15 minutes
7. Try again - should work

---

## Configuration Screenshots

### URL Configuration
```
┌─────────────────────────────────────────┐
│ Authentication → URL Configuration      │
├─────────────────────────────────────────┤
│                                         │
│ Site URL:                               │
│ ┌─────────────────────────────────────┐ │
│ │ https://primoboostai.in             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Redirect URLs:                          │
│ ┌─────────────────────────────────────┐ │
│ │ https://primoboostai.in/**          │ │
│ │ https://www.primoboostai.in/**      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│         [Save]                          │
└─────────────────────────────────────────┘
```

### Email Template Configuration
```
┌─────────────────────────────────────────┐
│ Authentication → Email Templates        │
│ → Reset Password                        │
├─────────────────────────────────────────┤
│                                         │
│ Subject:                                │
│ ┌─────────────────────────────────────┐ │
│ │ Reset Your Password - PrimoBoost AI │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Message Body:                           │
│ ┌─────────────────────────────────────┐ │
│ │ <!DOCTYPE html>                     │ │
│ │ <html lang="en">                    │ │
│ │ <head>                              │ │
│ │   ...branded template...            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│         [Preview] [Save]                │
└─────────────────────────────────────────┘
```

---

## Verification Checklist

After completing setup, verify:

- [ ] Site URL is set to `https://primoboostai.in`
- [ ] Redirect URLs include `**` wildcard
- [ ] Email template is branded with PrimoBoost AI styling
- [ ] Email subject line updated
- [ ] Test email received successfully
- [ ] Password reset link opens app correctly
- [ ] URL tokens are cleaned from browser after detection
- [ ] Rate limiting works (3 attempts per 15 minutes)
- [ ] Auto-login works after password reset
- [ ] Success messages display correctly

---

## Troubleshooting

### ❌ "Invalid path" error when clicking email link
**Cause:** Redirect URLs don't have `**` wildcard

**Fix:**
1. Go to Authentication → URL Configuration
2. Make sure redirect URLs are:
   - `https://primoboostai.in/**`
   - `https://www.primoboostai.in/**`
3. Click Save
4. Request new password reset

### ❌ Email not received
**Possible Causes:**
1. Email in spam/junk folder
2. Email service not configured
3. User email doesn't exist

**Debugging:**
1. Check Supabase Dashboard → Authentication → Logs
2. Look for email sending errors
3. Verify user exists in Users table
4. Check spam/junk folder
5. Try with different email provider (Gmail, Outlook, etc.)

### ❌ Link opens but modal doesn't show
**Possible Causes:**
1. JavaScript error in console
2. URL detection logic not working
3. Token already used

**Debugging:**
1. Open browser console (F12)
2. Look for errors
3. Check if URL has `type=recovery` and `access_token`
4. Request new reset link (tokens are single-use)

### ❌ Rate limit not working
**Possible Causes:**
1. Database migration not applied
2. Function doesn't exist

**Fix:**
1. Check if migration applied:
   ```sql
   SELECT * FROM pg_proc
   WHERE proname = 'check_password_reset_rate_limit';
   ```
2. If not found, apply migration:
   - File: `supabase/migrations/20251105120000_add_password_reset_rate_limiting.sql`
3. Verify table exists:
   ```sql
   SELECT * FROM information_schema.tables
   WHERE table_name = 'password_reset_attempts';
   ```

---

## Email Template Preview

Your branded email will look like this:

```
┌───────────────────────────────────────┐
│           🔐                          │
│                                       │
│     Password Reset Request            │
│                                       │
│  Hello,                               │
│                                       │
│  We received a request to reset the   │
│  password for your PrimoBoost AI      │
│  account...                           │
│                                       │
│  ┌───────────────────────────────┐   │
│  │  Reset Your Password          │   │
│  └───────────────────────────────┘   │
│                                       │
│  ⚠️ Important Security Information    │
│  This link will expire in 1 hour...  │
│                                       │
│  🛡️ Security Best Practices          │
│  • Never share your password...      │
│  • Use a strong, unique password...  │
│                                       │
│  Need Help?                           │
│  Contact: support@primoboostai.in    │
│                                       │
│  © 2024 PrimoBoost AI                │
└───────────────────────────────────────┘
```

---

## Advanced Configuration (Optional)

### Custom SMTP Settings

If you want to use your own email domain:

1. Go to **Settings** → **Project Settings** → **Auth**
2. Scroll to "SMTP Settings"
3. Configure your SMTP provider:
   ```
   Host: smtp.your-provider.com
   Port: 587
   Username: your-email@primoboostai.in
   Password: your-smtp-password
   Sender Email: noreply@primoboostai.in
   Sender Name: PrimoBoost AI
   ```
4. Click "Save"
5. Test email sending

### Link Expiration Time

To change how long reset links are valid:

1. Go to **Authentication** → **Policies**
2. Find "Reset Password Expiry"
3. Default: 3600 seconds (1 hour)
4. Adjust as needed (max recommended: 24 hours)
5. Update email template text if you change this

### Rate Limit Adjustment

To change rate limits (currently 3 per 15 minutes):

Edit the migration file or run:
```sql
-- Change max attempts and time window
CREATE OR REPLACE FUNCTION check_password_reset_rate_limit(...)
...
  v_rate_limit_minutes integer := 30;  -- Change from 15 to 30
  v_max_attempts integer := 5;          -- Change from 3 to 5
...
```

---

## Support

### Still having issues?

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Logs**: Dashboard → Authentication → Logs
3. **Check Console**: Browser DevTools → Console tab
4. **View Network**: Browser DevTools → Network tab (filter: "resetPassword")
5. **Database Logs**: Dashboard → Logs → Query Performance

### Contact Support

- **Email**: support@primoboostai.in
- **Documentation**: See `PASSWORD_RESET_IMPLEMENTATION_COMPLETE.md`
- **Supabase Docs**: https://supabase.com/docs/guides/auth

---

## Next Steps

After completing setup:

1. ✅ Test password reset flow end-to-end
2. ✅ Test rate limiting (3 attempts)
3. ✅ Verify email branding looks good
4. ✅ Test on mobile devices
5. ✅ Test in different email clients (Gmail, Outlook, Apple Mail)
6. ✅ Monitor reset success rate in first week
7. ✅ Gather user feedback

---

**Setup Time:** ~10 minutes
**Difficulty:** Easy
**Status:** Ready to configure

✅ Your password reset system is ready to go live!
