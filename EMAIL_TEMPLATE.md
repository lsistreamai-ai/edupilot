# Custom Email Template Settings

## 1. Go to Email Templates
https://supabase.com/dashboard/project/zpyglubdgpecdfsrnirz/auth/templates

## 2. Edit "Confirm signup" template

**Replace the entire template with:**

### Subject:
```
Welcome to EduPilot - Confirm Your Email
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 30px; text-align: center;">
      <div style="font-size: 48px;">✈️</div>
      <h1 style="color: white; margin: 10px 0 0 0; font-size: 28px;">EduPilot</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin: 0 0 20px 0;">Welcome to EduPilot!</h2>
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
        Thank you for registering. Please confirm your email address to get started with your learning journey.
      </p>
      
      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" 
           style="display: inline-block; background-color: #3B82F6; color: white; padding: 16px 40px; 
                  border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Confirm Email Address
        </a>
      </div>
      
      <p style="color: #9ca3af; font-size: 14px; margin: 20px 0 0 0;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        © 2026 EduPilot - Language Services International (PET) Ltd.
      </p>
    </div>
    
  </div>
</body>
</html>
```

## 3. Save Changes

Click **Save** at the bottom.

---

## Custom Redirect URL (Optional)

If you want the confirmation link to go to your custom page:

1. Go to: https://supabase.com/dashboard/project/zpyglubdgpecdfsrnirz/auth/url-configuration
2. Set **Site URL** to: `https://edupilot-lilac.vercel.app`
3. Add to **Redirect URLs**: `https://edupilot-lilac.vercel.app/auth/confirm`

