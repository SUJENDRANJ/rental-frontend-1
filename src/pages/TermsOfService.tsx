import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/components/seo/SEO';

export const TermsOfService = () => {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Read RentHub's terms of service to understand your rights and responsibilities when using our rental marketplace platform."
      />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Last Updated: October 1, 2025
              </p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using RentHub ("Service"), you accept and agree to be bound by
                  the terms and provision of this agreement. If you do not agree to these terms,
                  please do not use our Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground mb-4">
                  RentHub is a peer-to-peer rental marketplace that connects hosts who have items
                  to rent with renters looking to rent those items. We provide the platform but
                  are not a party to the rental agreements between users.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground mb-4">
                  To use certain features of the Service, you must register for an account. You
                  agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept all responsibility for activity under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Host Responsibilities</h2>
                <p className="text-muted-foreground mb-4">As a host, you agree to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate descriptions of items listed</li>
                  <li>Ensure items are safe, clean, and in working condition</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Maintain appropriate insurance coverage</li>
                  <li>Respond promptly to rental requests and inquiries</li>
                  <li>Honor confirmed bookings</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Renter Responsibilities</h2>
                <p className="text-muted-foreground mb-4">As a renter, you agree to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Use rented items responsibly and as intended</li>
                  <li>Return items in the same condition as received</li>
                  <li>Pay all fees and charges on time</li>
                  <li>Follow all instructions provided by the host</li>
                  <li>Report any damage or issues immediately</li>
                  <li>Respect the host's property and policies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Payments and Fees</h2>
                <p className="text-muted-foreground mb-4">
                  RentHub charges service fees for using the platform. Payment processing is
                  handled securely through our payment partners. All fees are non-refundable
                  except as required by law or specified in our cancellation policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Cancellation and Refunds</h2>
                <p className="text-muted-foreground mb-4">
                  Cancellation policies are set by individual hosts. Review the specific
                  cancellation policy before booking. Refunds are processed according to the
                  applicable cancellation policy and may take 5-10 business days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Prohibited Activities</h2>
                <p className="text-muted-foreground mb-4">You may not:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Post false or misleading information</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Harass or harm other users</li>
                  <li>Attempt to bypass security measures</li>
                  <li>Use the Service for commercial purposes without authorization</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
                <p className="text-muted-foreground mb-4">
                  All content on RentHub, including text, graphics, logos, and software, is the
                  property of RentHub or its licensors and is protected by copyright and other
                  intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  RentHub is not liable for any damages arising from your use of the Service or
                  rental transactions between users. We do not guarantee the quality, safety, or
                  legality of items listed on the platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Dispute Resolution</h2>
                <p className="text-muted-foreground mb-4">
                  Disputes between users should be resolved directly. RentHub may provide
                  mediation services at our discretion. Any disputes with RentHub shall be
                  resolved through binding arbitration.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">12. Modifications to Terms</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to modify these terms at any time. Changes will be
                  effective upon posting. Continued use of the Service after changes constitutes
                  acceptance of the modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">13. Termination</h2>
                <p className="text-muted-foreground mb-4">
                  We may terminate or suspend your account at any time for violation of these
                  terms. You may also terminate your account at any time by contacting us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-muted-foreground">
                  Email: legal@renthub.com<br />
                  Address: 123 Rental Street, San Francisco, CA 94102
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
