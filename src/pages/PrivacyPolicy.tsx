import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/components/seo/SEO';

export const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how RentHub collects, uses, and protects your personal information. Your privacy is important to us."
      />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Last Updated: October 1, 2025
              </p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  RentHub ("we", "our", or "us") is committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you use our rental marketplace platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold mb-3 mt-4">Personal Information</h3>
                <p className="text-muted-foreground mb-4">We collect information that you provide directly to us:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Profile photo and bio</li>
                  <li>Address and location information</li>
                  <li>Payment information and billing details</li>
                  <li>Identity verification documents</li>
                  <li>Communications with us and other users</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-4">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring URLs and search terms</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use collected information to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send confirmations</li>
                  <li>Verify identity and prevent fraud</li>
                  <li>Communicate with you about your account and rentals</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Analyze usage patterns and improve user experience</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce our terms</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Other Users:</strong> Your public profile and listing information are
                    visible to other users
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Payment processors, hosting services, and
                    analytics providers
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect rights
                    and safety
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, sale, or
                    acquisition
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational measures to protect your
                  information, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Secure payment processing</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Disable cookies through browser settings</li>
                  <li>Request a copy of your data</li>
                  <li>Object to certain data processing activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze
                  usage, and deliver personalized content. You can control cookies through your
                  browser settings, but this may affect functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
                <p className="text-muted-foreground mb-4">
                  Our Service may contain links to third-party websites. We are not responsible
                  for the privacy practices of these external sites. Please review their privacy
                  policies before providing any information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
                <p className="text-muted-foreground mb-4">
                  Our Service is not intended for users under 18 years of age. We do not
                  knowingly collect information from children. If we learn that we have
                  collected information from a child, we will delete it promptly.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
                <p className="text-muted-foreground mb-4">
                  Your information may be transferred to and processed in countries other than
                  your own. We ensure appropriate safeguards are in place to protect your
                  information in accordance with this Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Data Retention</h2>
                <p className="text-muted-foreground mb-4">
                  We retain your information for as long as necessary to provide services and
                  comply with legal obligations. After account deletion, we may retain certain
                  information for legal and business purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">12. Changes to Privacy Policy</h2>
                <p className="text-muted-foreground mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of
                  material changes by email or through the Service. Your continued use after
                  changes indicates acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Privacy Policy or our data practices, contact
                  us at:
                </p>
                <p className="text-muted-foreground">
                  Email: privacy@renthub.com<br />
                  Address: 123 Rental Street, San Francisco, CA 94102<br />
                  Data Protection Officer: dpo@renthub.com
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
