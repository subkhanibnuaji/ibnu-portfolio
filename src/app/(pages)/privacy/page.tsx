import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Ibnu Portfolio - How we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: January 2025</p>

        <p>
          This Privacy Policy describes how Ibnu Portfolio (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          collects, uses, and protects your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>

        <h3>Information You Provide</h3>
        <ul>
          <li><strong>Contact Information:</strong> Name, email address when you use our contact form</li>
          <li><strong>Guestbook Entries:</strong> Name and message when you sign our guestbook</li>
          <li><strong>Newsletter:</strong> Email address if you subscribe to our newsletter</li>
          <li><strong>Comments:</strong> Name, email, and comment content on blog posts</li>
        </ul>

        <h3>Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, device information</li>
          <li><strong>IP Address:</strong> For security and rate limiting purposes</li>
          <li><strong>Cookies:</strong> Essential cookies for site functionality</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to your inquiries and messages</li>
          <li>To send newsletter updates (if subscribed)</li>
          <li>To improve our website and services</li>
          <li>To protect against security threats and abuse</li>
          <li>To analyze website usage and performance</li>
        </ul>

        <h2>Cookies</h2>
        <p>We use the following types of cookies:</p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
        </ul>
        <p>
          You can manage your cookie preferences through the cookie consent banner or your browser settings.
        </p>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Vercel Analytics:</strong> Website analytics and performance monitoring</li>
          <li><strong>Cloudflare:</strong> CDN, security, and DDoS protection</li>
          <li><strong>Sentry:</strong> Error tracking and monitoring</li>
          <li><strong>Resend:</strong> Email delivery service</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data, including:
        </p>
        <ul>
          <li>HTTPS encryption for all data transmission</li>
          <li>Secure password hashing (bcrypt)</li>
          <li>Rate limiting to prevent abuse</li>
          <li>Regular security audits</li>
          <li>DDoS protection</li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          We retain your personal data only for as long as necessary to fulfill the purposes
          for which it was collected. Contact form submissions and guestbook entries are
          retained indefinitely unless you request deletion.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to data processing</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our website is not intended for children under 13 years of age. We do not
          knowingly collect personal information from children.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of
          any changes by posting the new policy on this page and updating the
          &quot;Last updated&quot; date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or wish to exercise
          your rights, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@heyibnu.com</li>
          <li>Contact Form: <a href="/contact">/contact</a></li>
        </ul>

        <hr />

        <p className="text-sm text-muted-foreground">
          This privacy policy is provided for informational purposes and does not
          constitute legal advice. Please consult with a legal professional for
          specific guidance.
        </p>
      </div>
    </main>
  )
}
