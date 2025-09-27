# Email Integration Guide

## Current Status: Demo Mode
The application currently runs in **demo mode** where OTPs are displayed in a modal instead of being sent via email. This is perfect for testing and development.

## Real Email Integration Options

### 1. EmailJS (Recommended for Quick Setup)
**Best for**: Frontend-only applications, quick prototyping
**Setup time**: 5 minutes
**Cost**: Free tier available

```bash
npm install @emailjs/browser
```

**Steps:**
1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Create a service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Update the code in `src/services/emailService.ts`

### 2. SendGrid (Professional)
**Best for**: Production applications, high volume
**Setup time**: 15 minutes
**Cost**: Free tier (100 emails/day)

```bash
npm install @sendgrid/mail
```

**Steps:**
1. Sign up at [SendGrid.com](https://sendgrid.com/)
2. Create an API key
3. Verify your sender email
4. Update the code in `src/services/emailService.ts`

### 3. Nodemailer (Backend Required)
**Best for**: Full-stack applications with Node.js backend
**Setup time**: 30 minutes
**Cost**: Free (uses your own SMTP)

```bash
npm install nodemailer
```

**Steps:**
1. Create a backend API endpoint
2. Set up SMTP credentials (Gmail, Outlook, etc.)
3. Update the code in `src/services/emailService.ts`

### 4. AWS SES (Enterprise)
**Best for**: Large-scale applications, enterprise use
**Setup time**: 45 minutes
**Cost**: Pay-per-use (very cheap)

```bash
npm install aws-sdk
```

**Steps:**
1. Set up AWS account
2. Configure SES service
3. Verify domain/email
4. Update the code in `src/services/emailService.ts`

## Quick Implementation with EmailJS

1. **Install EmailJS:**
```bash
npm install @emailjs/browser
```

2. **Update App.tsx:**
```typescript
import emailjs from '@emailjs/browser';

const sendOTP = async (email: string) => {
  const otp = generateOTP();
  
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        to_email: email,
        otp_code: otp,
        from_name: 'AI Interview Assistant'
      },
      'YOUR_PUBLIC_KEY'
    );
    
    setOtpSent(true);
    message.success(`OTP sent to ${email}!`);
  } catch (error) {
    message.error('Failed to send OTP. Please try again.');
  }
};
```

3. **Create Email Template in EmailJS:**
```
Subject: Your OTP for AI Interview Assistant

Hello,

Your OTP code is: {{otp_code}}

This code will expire in 10 minutes.

Best regards,
{{from_name}}
```

## Environment Variables

Create a `.env` file in your project root:

```env
# EmailJS
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key

# SendGrid
REACT_APP_SENDGRID_API_KEY=your_sendgrid_api_key

# AWS SES
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_ACCESS_KEY_ID=your_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_key
```

## Testing the Current Demo

1. **Enter your email** in the form
2. **Click "Send OTP"** button
3. **Modal will appear** with the demo OTP
4. **Copy the OTP** from the modal
5. **Enter the OTP** in the verification field
6. **Click "Verify"** to continue

## Production Checklist

- [ ] Choose email service provider
- [ ] Set up API keys and credentials
- [ ] Update email service code
- [ ] Test with real email addresses
- [ ] Set up error handling
- [ ] Configure email templates
- [ ] Test OTP expiration
- [ ] Set up monitoring and logging

## Security Considerations

1. **Rate limiting** - Prevent spam
2. **OTP expiration** - Set time limits
3. **Input validation** - Sanitize email addresses
4. **Error handling** - Don't expose sensitive info
5. **Logging** - Track email sending attempts

## Support

For questions about email integration:
- Check the service provider's documentation
- Test with a simple implementation first
- Use the demo mode for development
- Implement proper error handling
