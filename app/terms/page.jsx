import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <FileText className="text-primary h-8 w-8" />
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Terms &amp; Conditions
        </h1>
      </div>

      <p className="text-muted-foreground mt-2 text-sm">
        Last updated: 18th August 2026
      </p>

      <div className="prose prose-sm text-muted-foreground mt-8 max-w-none space-y-6">
        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            1. Acceptance of Terms
          </h2>
          <p>
            By creating an account or using Invoicer, you agree to these Terms
            &amp; Conditions. If you do not agree with these terms, please do
            not use the platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            2. The Service
          </h2>
          <p>
            Invoicer provides tools for creating, managing, storing, and
            organizing invoices and related business information. The platform
            is intended to help users manage their invoicing workflow and does
            not constitute accounting, tax, legal, or financial advice.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            3. User Accounts
          </h2>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              You must provide accurate information when creating an account.
            </li>
            <li>
              You are responsible for keeping your account credentials secure.
            </li>
            <li>
              You are responsible for activity performed through your account.
            </li>
            <li>
              You must notify us if you believe your account has been
              compromised.
            </li>
            <li>
              You must not use another person's account or attempt to gain
              unauthorized access to another account.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            4. Invoices and Business Data
          </h2>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              You are responsible for the accuracy and completeness of the
              information entered into your invoices.
            </li>
            <li>
              You are responsible for ensuring that invoices comply with the
              tax, accounting, and legal requirements applicable to your
              business.
            </li>
            <li>
              You are responsible for maintaining appropriate records of your
              invoices and business transactions.
            </li>
            <li>
              You must have the necessary rights or permissions to use customer
              information that you enter into the platform.
            </li>
            <li>
              You must not use the service to create fraudulent, deceptive, or
              misleading invoices.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            5. Acceptable Use
          </h2>
          <p>You agree not to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Use the platform for unlawful or fraudulent purposes.</li>
            <li>
              Attempt to gain unauthorized access to the service or its systems.
            </li>
            <li>Interfere with or disrupt the operation of the platform.</li>
            <li>Upload malicious code, viruses, or other harmful material.</li>
            <li>Use automated methods to abuse or overload the service.</li>
            <li>
              Use the platform in a way that violates the rights of other
              individuals or organizations.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            6. Invoice Delivery and Payments
          </h2>
          <p>
            Invoicer may provide tools that help you prepare or share invoices,
            but we do not guarantee that an invoice will be delivered, viewed,
            accepted, or paid by its recipient.
          </p>
          <p>
            Unless explicitly stated otherwise by the platform, Invoicer does
            not act as a party to transactions between you and your customers.
            You remain responsible for collecting payments, resolving disputes,
            and complying with applicable tax and commercial obligations.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            7. Account Suspension and Termination
          </h2>
          <p>
            We may suspend or terminate accounts that violate these terms,
            misuse the service, create security risks, engage in fraudulent
            activity, or otherwise use the platform in a manner that could harm
            the service or its users.
          </p>
          <p>
            You may stop using the platform and request deletion of your account
            in accordance with the available account controls and applicable
            policies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            8. Intellectual Property
          </h2>
          <p>
            The Invoicer platform, including its software, interface, branding,
            design, and underlying technology, is owned by or licensed to the
            service provider and is protected by applicable intellectual
            property laws.
          </p>
          <p>
            You retain ownership of the business, customer, and invoice
            information that you submit to the platform, subject to the rights
            necessary for us to provide the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            9. Availability and Service Changes
          </h2>
          <p>
            We aim to keep Invoicer available and reliable, but we do not
            guarantee that the service will always be uninterrupted, secure, or
            error-free. We may modify, suspend, or discontinue features of the
            platform when reasonably necessary.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            10. Disclaimer
          </h2>
          <p>
            Invoicer is provided as a business and invoicing tool. We do not
            guarantee that the platform will meet every accounting, tax, legal,
            or business requirement applicable to you.
          </p>
          <p>
            You are responsible for reviewing invoices and other documents
            generated through the platform before using or sending them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            11. Limitation of Liability
          </h2>
          <p>
            To the extent permitted by applicable law, Invoicer and its
            operators will not be responsible for indirect, incidental, special,
            consequential, or business losses arising from your use of or
            inability to use the platform.
          </p>
          <p>
            This includes losses resulting from inaccurate information entered
            by users, missed payments, customer disputes, business decisions,
            service interruptions, or unauthorized access caused by factors
            outside our reasonable control.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            12. Changes to These Terms
          </h2>
          <p>
            We may update these Terms &amp; Conditions from time to time. The
            updated version will be posted on this page with a revised "Last
            updated" date. Continued use of the platform after changes take
            effect means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-foreground text-xl font-semibold">
            13. Contact
          </h2>
          <p>
            If you have questions about these Terms &amp; Conditions, please
            contact the Invoicer support team through the contact details
            provided by the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
