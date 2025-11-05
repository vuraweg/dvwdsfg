# Password Reset Setup Guide

## Overview

The forgot password functionality has been fully implemented with the following features:
- Email-based password reset flow
- Secure token handling via Supabase Auth
- Password strength validation
- User-friendly UI with clear feedback
- Automatic redirect after successful reset

## What Was Implemented

### 1. ResetPasswordForm Component (`src/components/auth/ResetPasswordForm.tsx`)
- New password input with strength indicator
- Password confirmation field
- Real-time validation for:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)
- Visual password strength meter
- Show/hide password toggle
- Clear error messages
- Success callback on password reset

### 2. URL Token Detection (App.tsx)
- Automatically detects password reset tokens in URL
- Opens the reset password modal when `type=recovery` is detected in URL hash
- Cleans up URL after processing to avoid token exposure
- Handles authentication state properly during reset flow

### 3. AuthModal Integration
- ResetPasswordForm is now fully integrated into the authentication modal
- Proper view switching between login, signup, forgot password, and reset password
- Success notification after password reset
- Automatic redirect to login after successful reset

### 4. Improved Email Service
- Enhanced redirect URL configuration in authService
- Better error handling and logging
- Proper email validation before sending

## How It Works

1. **User Initiates Reset**:
   - User clicks "Forgot Password" on login form
   - Enters email address
   - System sends password reset email via Supabase Auth

2. **User Receives Email**:
   - Supabase sends an email with a secure reset link
   - Link contains a temporary access token
   - Link redirects to your application with `type=recovery` in URL hash

3. **User Clicks Link**:
   - App detects the recovery token in URL
   - Automatically opens the reset password modal
   - User enters new password with confirmation

4. **Password is Reset**:
   - System validates password strength
   - Updates password via Supabase Auth
   - Shows success message
   - Redirects to login

## Required Supabase Configuration

### Step 1: Configure Site URL

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Set **Site URL** to your application's domain:
   ```
   http://localhost:5173  (for development)
   https://yourdomain.com (for production)
   ```

### Step 2: Add Redirect URLs

In the same **URL Configuration** section, add your redirect URLs:

**For Development:**
```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/*
```

**For Production:**
```
https://yourdomain.com
https://yourdomain.com/
https://yourdomain.com/*
```

### Step 3: Configure Email Templates (Optional)

Supabase provides default email templates, but you can customize them:

1. Go to **Authentication** → **Email Templates**
2. Find the **Reset Password** template
3. Customize the email content if needed
4. Ensure the reset link uses: `{{ .ConfirmationURL }}`

Default template is good for most use cases.

### Step 4: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure SMTP settings if using custom email provider

## Testing the Password Reset Flow

### Method 1: Using the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the login page** and click "Forgot Password"

3. **Enter your email address** (must be a registered user)

4. **Check your email** for the password reset link
   - Check spam folder if not in inbox
   - Email should arrive within 1-2 minutes

5. **Click the reset link** in the email
   - You'll be redirected back to your app
   - Reset password modal will open automatically

6. **Enter your new password**
   - Must meet all strength requirements
   - Confirm the password

7. **Submit the form**
   - Success message will appear
   - You'll be redirected to login
   - Try logging in with your new password

### Method 2: Testing with Supabase Studio

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Find your test user
3. Click the **Send Password Reset Email** button
4. Follow steps 4-7 from Method 1

## Troubleshooting

### Issue: Not Receiving Reset Emails

**Solutions:**
1. Check spam/junk folder
2. Verify email provider is configured in Supabase:
   - Go to **Project Settings** → **Authentication**
   - Check SMTP settings
3. Check Supabase logs for email delivery errors:
   - Go to **Logs** → **Auth Logs**
4. Ensure the user email is verified in Supabase
5. Try with a different email address

### Issue: "Invalid or Expired Token" Error

**Solutions:**
1. Password reset tokens expire after 1 hour
2. Request a new reset email
3. Don't refresh the page after clicking the reset link
4. Ensure you're using the latest email link (not an old one)

### Issue: Reset Link Redirects to Wrong URL

**Solutions:**
1. Verify **Site URL** in Supabase Dashboard matches your app URL
2. Check that redirect URL is in the allowed list
3. For localhost, use `http://localhost:5173` (not 127.0.0.1)
4. Ensure no trailing slashes if not configured

### Issue: Modal Not Opening After Clicking Reset Link

**Solutions:**
1. Check browser console for errors
2. Verify the URL hash contains `type=recovery`
3. Clear browser cache and try again
4. Ensure JavaScript is enabled

### Issue: Password Doesn't Meet Requirements

The password must contain:
- At least 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

### Issue: "Session Expired" Error

**Solutions:**
1. This happens if you take too long to enter the new password
2. Request a new reset email
3. Complete the reset process within 1 hour

## Security Features

✅ **Token Expiration**: Reset tokens expire after 1 hour for security

✅ **One-Time Use**: Each reset token can only be used once

✅ **Strong Password Requirements**: Enforces complex passwords

✅ **URL Cleanup**: Removes tokens from URL after processing

✅ **Secure Transport**: All communications use HTTPS in production

✅ **Email Verification**: Only registered emails can request resets

## Production Checklist

Before deploying to production:

- [ ] Configure production Site URL in Supabase
- [ ] Add production redirect URLs to allowed list
- [ ] Test email delivery in production environment
- [ ] Verify HTTPS is working correctly
- [ ] Test the complete flow end-to-end
- [ ] Monitor Supabase logs for any errors
- [ ] Set up custom email templates (optional)
- [ ] Configure custom SMTP provider (optional)
- [ ] Test password reset from multiple email providers
- [ ] Verify mobile responsiveness of reset form

## Additional Notes

### Email Providers

Supabase provides email service out of the box, but you can configure custom SMTP:

**Gmail SMTP:**
```
Host: smtp.gmail.com
Port: 587
TLS: Enabled
```

**SendGrid:**
```
Host: smtp.sendgrid.net
Port: 587
```

**AWS SES:**
```
Host: email-smtp.region.amazonaws.com
Port: 587
```

### Rate Limiting

Supabase has built-in rate limiting for password reset emails:
- Maximum 5 reset emails per hour per email address
- Maximum 10 reset emails per hour per IP address

This prevents abuse and spam.

### Monitoring

Monitor password reset activity in Supabase Dashboard:
1. Go to **Logs** → **Auth Logs**
2. Filter by event type: `user.recovery.sent`
3. Check for any errors or suspicious activity

## Support

If you encounter issues not covered in this guide:

1. Check Supabase Documentation: https://supabase.com/docs/guides/auth/passwords
2. Review Supabase Auth Logs in Dashboard
3. Check browser console for JavaScript errors
4. Verify all environment variables are set correctly
5. Test with different email addresses and browsers

## Files Modified/Created

**Created:**
- `src/components/auth/ResetPasswordForm.tsx` - New password reset form component

**Modified:**
- `src/components/auth/AuthModal.tsx` - Integrated ResetPasswordForm
- `src/services/authService.ts` - Improved forgot password handling
- `src/App.tsx` - Already had URL token detection (no changes needed)

## Next Steps

1. Configure Supabase Site URL and redirect URLs (see Step 1-2 above)
2. Test the password reset flow locally
3. Deploy to staging/production
4. Test in production environment
5. Monitor for any issues

Your password reset functionality is now fully implemented and ready to use!
