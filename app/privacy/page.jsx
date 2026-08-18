import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Shield className="text-primary h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      </div>

      <p className="text-muted-foreground mt-2 text-sm">
        Last updated: 18th August 2026
      </p>

      <div className="text-muted-foreground mt-8 max-w-none space-y-6">
        <section>
          <h2 className="text-foreground text-xl font-semibold">
            1. Introduction
          </h2>
          <p>
            Invoicer ("we", "us", or "our") respects your privacy and is
            committed to protecting your personal information. This Privacy
            Policy explains what information we collect, how we use it, and how
            we protect it when you use our invoicing platform.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            2. Information We Collect
          </h2>
          <p>Depending on how you use the platform, we may collect:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong className="text-foreground">Account information:</strong>{" "}
              Your name, email address, profile information, and authentication
              details.
            </li>
            <li>
              <strong className="text-foreground">Business information:</strong>{" "}
              Your business name, address, contact details, tax or registration
              information, and other information you choose to add to your
              invoices.
            </li>
            <li>
              <strong className="text-foreground">Invoice information:</strong>{" "}
              Customer names and contact details, invoice numbers, descriptions,
              products or services, quantities, prices, taxes, discounts,
              payment terms, due dates, and other invoice-related information
              you enter.
            </li>
            <li>
              <strong className="text-foreground">Customer information:</strong>{" "}
              Information about customers or clients that you store in order to
              create and manage invoices.
            </li>
            <li>
              <strong className="text-foreground">Usage information:</strong>{" "}
              Information about how you use the application, including pages
              visited, features used, and interactions with the platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            3. How We Use Your Information
          </h2>
          <p>We may use collected information to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Provide, operate, and maintain the invoicing platform.</li>
            <li>Create, manage, edit, and store your invoices.</li>
            <li>Generate invoices and related documents for you.</li>
            <li>Help you manage customers and business information.</li>
            <li>Authenticate your account and maintain account security.</li>
            <li>Communicate with you about your account and our services.</li>
            <li>
              Improve the functionality, reliability, and user experience of the
              platform.
            </li>
            <li>
              Detect, prevent, and address fraud, abuse, and security issues.
            </li>
            <li>Comply with applicable legal and regulatory requirements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            4. How We Share Information
          </h2>
          <p>
            We do not sell your personal information. We may share information
            only when reasonably necessary to operate the service, provide
            requested functionality, comply with legal obligations, protect our
            rights, or prevent fraud and abuse.
          </p>
          <p>
            Information contained in invoices may be shared with recipients when
            you choose to send, export, download, or otherwise provide an
            invoice to them. You are responsible for ensuring that you have the
            appropriate permission to enter and share information belonging to
            your customers or other third parties.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            5. Data Security
          </h2>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access, alteration, disclosure, or destruction.
            However, no online service can guarantee absolute security, and you
            are responsible for keeping your account credentials confidential.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            6. Data Retention
          </h2>
          <p>
            We retain your account, invoice, and related information for as long
            as reasonably necessary to provide the service, maintain business
            records, resolve disputes, enforce our agreements, and comply with
            applicable legal obligations.
          </p>
          <p>
            If you delete your account, we may delete or anonymize your
            information subject to technical limitations and any legal or
            legitimate business requirements that require certain information to
            be retained.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            7. Your Rights
          </h2>
          <p>Depending on applicable law, you may have the right to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate or incomplete information.</li>
            <li>Request deletion of your personal information.</li>
            <li>Object to or restrict certain uses of your information.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p>
            Some requests may be subject to legal or operational limitations.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            8. Cookies and Similar Technologies
          </h2>
          <p>
            We may use cookies or similar technologies where necessary to
            authenticate users, maintain sessions, remember preferences, improve
            the platform, and understand how the service is used.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            9. Third-Party Services
          </h2>
          <p>
            The platform may rely on third-party services to provide
            authentication, hosting, database functionality, analytics, email,
            or other infrastructure. These providers may process information on
            our behalf and are expected to handle it according to their own
            privacy policies and applicable requirements.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we make
            changes, we will update the "Last updated" date on this page. Your
            continued use of the platform after changes become effective
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">11. Contact</h2>
          <p>
            If you have questions, concerns, or requests relating to this
            Privacy Policy or your personal information, please contact the
            Invoicer support team through the contact details provided by the
            platform.
          </p>
        </section>
      </div>
    </div>
  );
}
