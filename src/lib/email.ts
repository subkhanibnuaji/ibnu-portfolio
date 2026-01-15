import { Resend } from 'resend'

// Initialize Resend - will only work if RESEND_API_KEY is set
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface ContactEmailParams {
  name: string
  email: string
  subject: string
  message: string
}

// Email template for admin notification
const getAdminEmailHtml = ({ name, email, subject, message }: ContactEmailParams) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #00d9ff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
    </div>

    <div style="background-color: #252525; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0 0 8px 0; color: #888;">From:</p>
      <p style="margin: 0; font-size: 18px; font-weight: 600;">${name}</p>
      <p style="margin: 4px 0 0 0; color: #00d9ff;">${email}</p>
    </div>

    <div style="background-color: #252525; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0 0 8px 0; color: #888;">Subject:</p>
      <p style="margin: 0; font-size: 16px; font-weight: 500;">${subject}</p>
    </div>

    <div style="background-color: #252525; border-radius: 8px; padding: 20px;">
      <p style="margin: 0 0 8px 0; color: #888;">Message:</p>
      <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: linear-gradient(135deg, #00d9ff, #a855f7); color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Reply to ${name}
      </a>
    </div>

    <p style="margin-top: 24px; text-align: center; color: #666; font-size: 12px;">
      This email was sent from your portfolio contact form at heyibnu.com
    </p>
  </div>
</body>
</html>
`

// Email template for sender confirmation
const getSenderConfirmationHtml = ({ name, subject }: ContactEmailParams) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #00d9ff; margin: 0; font-size: 24px;">Thanks for reaching out!</h1>
    </div>

    <p style="line-height: 1.6; color: #ccc;">
      Hi ${name},
    </p>

    <p style="line-height: 1.6; color: #ccc;">
      I've received your message regarding "<strong>${subject}</strong>" and will get back to you as soon as possible, usually within 24-48 hours.
    </p>

    <p style="line-height: 1.6; color: #ccc;">
      In the meantime, feel free to check out my latest projects and articles on my website.
    </p>

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://heyibnu.com" style="display: inline-block; background: linear-gradient(135deg, #00d9ff, #a855f7); color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Visit My Portfolio
      </a>
    </div>

    <p style="margin-top: 24px; line-height: 1.6; color: #ccc;">
      Best regards,<br>
      <strong style="color: #00d9ff;">Ibnu Aji</strong>
    </p>

    <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;">

    <p style="text-align: center; color: #666; font-size: 12px;">
      This is an automated confirmation email. Please do not reply to this email.
    </p>
  </div>
</body>
</html>
`

export async function sendContactNotification(params: ContactEmailParams) {
  if (!resend) {
    console.log('Resend not configured, skipping email notification')
    return { success: false, error: 'Email service not configured' }
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'hi@heyibnu.com'

  try {
    // Send notification to admin
    await resend.emails.send({
      from: 'Portfolio Contact <noreply@heyibnu.com>',
      to: adminEmail,
      subject: `New Contact: ${params.subject} - from ${params.name}`,
      html: getAdminEmailHtml(params),
    })

    // Send confirmation to sender
    await resend.emails.send({
      from: 'Ibnu Aji <noreply@heyibnu.com>',
      to: params.email,
      subject: `Thanks for your message - ${params.subject}`,
      html: getSenderConfirmationHtml(params),
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
