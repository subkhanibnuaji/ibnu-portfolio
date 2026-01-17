import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Ibnu Portfolio - Rules and guidelines for using our website.',
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1>Terms of Service</h1>
        <p className="lead">Last updated: January 2025</p>

        <p>
          Welcome to Ibnu Portfolio. By accessing and using this website, you agree
          to be bound by these Terms of Service. If you do not agree with any part
          of these terms, please do not use this website.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing this website, you confirm that you are at least 13 years of
          age and have the legal capacity to enter into these Terms of Service.
        </p>

        <h2>2. Use of Website</h2>
        <h3>Permitted Use</h3>
        <p>You may use this website for:</p>
        <ul>
          <li>Viewing portfolio content and blog posts</li>
          <li>Using provided tools and utilities</li>
          <li>Contacting us through provided forms</li>
          <li>Subscribing to newsletters</li>
        </ul>

        <h3>Prohibited Use</h3>
        <p>You may NOT:</p>
        <ul>
          <li>Attempt to gain unauthorized access to any part of the website</li>
          <li>Use automated tools to scrape or download content</li>
          <li>Engage in any activity that disrupts the website&apos;s functionality</li>
          <li>Submit false or misleading information</li>
          <li>Use the website for any illegal purpose</li>
          <li>Attempt to bypass security measures</li>
          <li>Upload malicious code or content</li>
          <li>Impersonate any person or entity</li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <p>
          All content on this website, including but not limited to text, graphics,
          logos, images, and code, is the property of Subkhan Ibnu Aji or its
          licensors and is protected by copyright and other intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, modify, or create derivative works
          without explicit written permission, except for personal, non-commercial use.
        </p>

        <h2>4. User-Generated Content</h2>
        <p>
          When you submit content (such as guestbook entries, comments, or contact
          messages), you:
        </p>
        <ul>
          <li>Grant us a non-exclusive license to display the content</li>
          <li>Confirm that you own the rights to the content</li>
          <li>Agree not to submit harmful, offensive, or illegal content</li>
        </ul>
        <p>
          We reserve the right to remove any user-generated content at our discretion.
        </p>

        <h2>5. Third-Party Tools and Services</h2>
        <p>
          Some tools and features on this website may rely on third-party services.
          Your use of these features may be subject to additional terms from those
          third parties.
        </p>

        <h2>6. AI Tools Disclaimer</h2>
        <p>
          The AI-powered tools on this website are provided for educational and
          demonstration purposes. We do not guarantee the accuracy, completeness,
          or reliability of AI-generated outputs. Use AI features at your own risk.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          This website is provided &quot;as is&quot; without warranties of any kind. We are
          not liable for any damages arising from your use of the website, including
          but not limited to:
        </p>
        <ul>
          <li>Direct, indirect, incidental, or consequential damages</li>
          <li>Loss of data or profits</li>
          <li>Service interruptions</li>
          <li>Security breaches beyond our reasonable control</li>
        </ul>

        <h2>8. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Subkhan Ibnu Aji from any claims,
          damages, or expenses arising from your violation of these terms or your
          use of the website.
        </p>

        <h2>9. Security</h2>
        <p>
          We take security seriously and implement various measures to protect the
          website and its users. However, no system is completely secure. If you
          discover a security vulnerability, please report it responsibly to
          security@heyibnu.com.
        </p>

        <h2>10. Modifications</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Changes
          will be effective immediately upon posting. Your continued use of the
          website after changes constitutes acceptance of the new terms.
        </p>

        <h2>11. Termination</h2>
        <p>
          We may terminate or suspend your access to the website at any time,
          without notice, for conduct that we believe violates these terms or is
          harmful to other users or the website.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms of Service are governed by the laws of Indonesia. Any disputes
          shall be resolved in the courts of Indonesia.
        </p>

        <h2>13. Contact</h2>
        <p>
          For questions about these Terms of Service, please contact us at:
        </p>
        <ul>
          <li>Email: legal@heyibnu.com</li>
          <li>Contact Form: <a href="/contact">/contact</a></li>
        </ul>

        <hr />

        <p className="text-sm text-muted-foreground">
          These terms are provided for informational purposes. Please consult with
          a legal professional for specific guidance.
        </p>
      </div>
    </main>
  )
}
