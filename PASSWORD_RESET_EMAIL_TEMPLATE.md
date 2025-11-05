# Custom Password Reset Email Template

## Overview
Supabase password reset emails are configured in the Supabase Dashboard under **Authentication > Email Templates**. This document provides a branded template for PrimoBoost AI.

## How to Configure

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Email Templates**
3. Select **"Reset Password"** template
4. Replace the content with the template below
5. Click **Save** to apply changes

## Branded Password Reset Email Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - PrimoBoost AI</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      color: white;
    }
    .content-section {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      margin: 25px 0;
      border-left: 4px solid #3b82f6;
    }
    .warning-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      border-radius: 12px;
      margin: 25px 0;
    }
    .warning-box h3 {
      margin-top: 0;
      color: #b45309;
      font-size: 18px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white !important;
      padding: 16px 48px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
      transition: all 0.3s ease;
      text-align: center;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
    }
    .cta-section {
      text-align: center;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      color: #777;
      font-size: 14px;
    }
    .security-info {
      background: #e0f2fe;
      border-left: 4px solid #0284c7;
      padding: 20px;
      border-radius: 12px;
      margin: 25px 0;
    }
    .security-info h3 {
      margin-top: 0;
      color: #0369a1;
      font-size: 18px;
    }
    .security-info ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .security-info li {
      margin: 8px 0;
      color: #0c4a6e;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🔐</div>
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>

    <div style="font-size: 16px; color: #555; margin-bottom: 20px;">
      <p>Hello,</p>
      <p>We received a request to reset the password for your PrimoBoost AI account. If you made this request, click the button below to set a new password.</p>
    </div>

    <div class="cta-section">
      <a href="{{ .ConfirmationURL }}" class="cta-button">
        Reset Your Password
      </a>
    </div>

    <div class="warning-box">
      <h3>⚠️ Important Security Information</h3>
      <p style="margin: 10px 0; color: #78350f;">
        <strong>This link will expire in 1 hour</strong> for your security. If you need a new link, please request another password reset from the login page.
      </p>
      <p style="margin: 10px 0; color: #78350f;">
        <strong>If you didn't request this,</strong> you can safely ignore this email. Your password will not be changed.
      </p>
    </div>

    <div class="security-info">
      <h3>🛡️ Security Best Practices</h3>
      <ul>
        <li>Never share your password with anyone</li>
        <li>Use a strong, unique password with at least 8 characters</li>
        <li>Include uppercase, lowercase, numbers, and special characters</li>
        <li>Consider using a password manager for added security</li>
        <li>Enable two-factor authentication when available</li>
      </ul>
    </div>

    <div class="content-section">
      <p style="margin: 0; color: #555; font-size: 14px;">
        <strong>Having trouble clicking the button?</strong><br>
        Copy and paste this link into your browser:<br>
        <span style="color: #3b82f6; word-break: break-all;">{{ .ConfirmationURL }}</span>
      </p>
    </div>

    <div class="footer">
      <p><strong>Need Help?</strong></p>
      <p>If you're having trouble resetting your password or have security concerns, please contact our support team at support@primoboostai.in</p>
      <p style="margin-top: 20px;">
        Best regards,<br>
        <strong>The PrimoBoost AI Security Team</strong>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        This email was sent to you because a password reset was requested for your PrimoBoost AI account.<br>
        If you didn't make this request, please ignore this email or contact support if you have concerns.
      </p>
      <p style="margin-top: 15px; font-size: 12px; color: #999;">
        © 2024 PrimoBoost AI. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

## Key Features of This Template

1. **Branded Design**: Uses PrimoBoost AI colors and styling
2. **Security Warnings**: Clear information about link expiration and what to do if user didn't request reset
3. **Call-to-Action**: Prominent button for password reset
4. **Security Tips**: Best practices for password security
5. **Fallback Link**: Plain text link for email clients that don't support buttons
6. **Professional Footer**: Contact information and disclaimer

## Template Variables

Supabase provides these variables that are automatically replaced:

- `{{ .ConfirmationURL }}` - The password reset link (includes token)
- `{{ .Token }}` - The raw token (if you want to build a custom URL)
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL configured in Supabase
- `{{ .Email }}` - User's email address (optional, use if needed)

## Testing the Template

1. After saving the template in Supabase Dashboard
2. Go to your application and request a password reset
3. Check your email inbox for the new branded email
4. Verify that:
   - The styling renders correctly
   - The reset link works
   - The link expires after 1 hour as expected

## Customization Tips

### Changing Colors
- Replace `#3b82f6` (blue) and `#8b5cf6` (purple) with your brand colors
- Update gradient colors in `.logo` and `.cta-button`

### Adding Logo Image
Replace the emoji logo `🔐` with an image:
```html
<div class="logo">
  <img src="https://your-domain.com/logo.png" alt="PrimoBoost AI" style="width: 100%; height: 100%; object-fit: contain;">
</div>
```

### Adjusting Link Expiration Text
If you change the expiration time in Supabase settings, update the text:
```html
<strong>This link will expire in [YOUR_TIME]</strong>
```

## Related Configuration

### Supabase Dashboard Settings

**Path:** Authentication > URL Configuration

- **Site URL**: `https://primoboostai.in`
- **Redirect URLs**:
  - `https://primoboostai.in/**`
  - `https://www.primoboostai.in/**`

**Path:** Authentication > Email Templates > Reset Password

- **Subject**: Reset Your Password - PrimoBoost AI
- **Redirect To**: `{{ .SiteURL }}` (auto-filled by Supabase)

## Troubleshooting

### Email Not Sending
- Check Supabase email service status
- Verify SMTP settings if using custom email provider
- Check spam/junk folder

### Link Not Working
- Ensure Redirect URLs are configured with wildcards
- Verify Site URL matches your domain
- Check if token has expired

### Styling Issues
- Test in multiple email clients (Gmail, Outlook, etc.)
- Some email clients don't support all CSS
- Use inline styles for critical styling

## Support

For issues with password reset emails:
1. Check Supabase Dashboard logs (Authentication > Logs)
2. Verify email template configuration
3. Test with different email providers
4. Contact Supabase support if needed
