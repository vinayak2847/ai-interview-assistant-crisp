// Email Service Implementation Examples
// Choose one of these methods for real email integration

// Method 1: EmailJS (Frontend only - No backend required)
/*
import emailjs from '@emailjs/browser';

export const sendOTPEmail = async (email: string, otp: string) => {
  const templateParams = {
    to_email: email,
    otp_code: otp,
    from_name: 'AI Interview Assistant'
  };

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID', 
      templateParams,
      'YOUR_PUBLIC_KEY'
    );
    return { success: true };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
};
*/

// Method 2: SendGrid (Backend required)
/*
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendOTPEmail = async (email: string, otp: string) => {
  const msg = {
    to: email,
    from: 'noreply@yourcompany.com',
    subject: 'Your OTP for AI Interview Assistant',
    text: `Your OTP code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <div style="background: #f0f8ff; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #1890ff;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid Error:', error);
    return { success: false, error };
  }
};
*/

// Method 3: Nodemailer (Backend required)
/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for AI Interview Assistant',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <div style="background: #f0f8ff; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #1890ff;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return { success: false, error };
  }
};
*/

// Method 4: AWS SES (Backend required)
/*
import AWS from 'aws-sdk';

const ses = new AWS.SES({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Data: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Verification</h2>
              <p>Your OTP code is:</p>
              <div style="background: #f0f8ff; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #1890ff;">
                ${otp}
              </div>
              <p>This code will expire in 10 minutes.</p>
            </div>
          `
        }
      },
      Subject: {
        Data: 'Your OTP for AI Interview Assistant'
      }
    },
    Source: 'noreply@yourcompany.com'
  };

  try {
    await ses.sendEmail(params).promise();
    return { success: true };
  } catch (error) {
    console.error('AWS SES Error:', error);
    return { success: false, error };
  }
};
*/

// Demo implementation (current)
export const sendOTPEmail = async (email: string, otp: string) => {
  // This is just a demo - in production, use one of the methods above
  console.log(`Demo: Sending OTP ${otp} to ${email}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true };
};

export const sendCompletionEmail = async (email: string, candidateName: string, score: number) => {
  // This is just a demo - in production, use one of the methods above
  console.log(`Demo: Sending completion email to ${email} for ${candidateName} with score ${score}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true };
};
