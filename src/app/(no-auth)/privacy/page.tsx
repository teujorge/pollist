import type { Metadata } from "next";

export default function PrivacyPolicyPage() {
  return (
    <main className="gap-2 [&>h2]:pt-10 [&>h2]:text-3xl [&>h2]:font-semibold [&>p]:py-2 [&>ul]:list-disc [&>ul]:pl-6">
      <div className="py-20">
        <h1 className="py-4 text-center text-7xl font-black md:text-9xl">
          Privacy Policy
        </h1>
        <p className="text-center text-accent-foreground">
          Last updated: June 8, 2024
        </p>
      </div>

      <p>
        This Privacy Policy describes how Pollist (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares
        information about you through our mobile application (the
        &quot;App&quot;). By using the App, you agree to the collection, use,
        and sharing of your information as described in this Privacy Policy.
      </p>

      <h2>Information We Collect</h2>
      <p>We collect the following types of information:</p>
      <ul>
        <li>
          <strong>User Provided Information:</strong> We collect information you
          provide directly to us when you create an account, such as your
          username, email address, and other contact or profile information you
          choose to provide.
        </li>
        <li>
          <strong>Automatically Collected Information:</strong> When you use our
          App, we automatically collect certain information, including your IP
          address, device type, operating system, and usage details (such as the
          time and frequency of your use of the App).
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our App;</li>
        <li>
          Communicate with you about products, services, and promotional offers;
        </li>
        <li>
          Monitor and analyze trends, usage, and activities in connection with
          our App;
        </li>
        <li>
          Detect, investigate, and prevent fraudulent transactions and other
          illegal activities, and protect the rights and property of Pollist and
          others.
        </li>
      </ul>

      <h2>Sharing of Information</h2>
      <p>We may share your information as follows:</p>
      <ul>
        <li>
          With vendors, consultants, and other service providers who need access
          to such information to carry out work on our behalf;
        </li>
        <li>
          In response to a request for information if we believe disclosure is
          in accordance with, or required by, any applicable law, regulation, or
          legal process;
        </li>
        <li>
          Between and among Pollist and our current and future parents,
          affiliates, subsidiaries, and other companies under common control and
          ownership;
        </li>
        <li>With your consent or at your direction.</li>
      </ul>
      <p>
        Additionally, we may share aggregated or de-identified information,
        which cannot reasonably be used to identify you.
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li>
          <strong>Account Information:</strong> You may update, correct, or
          delete information about you at any time by logging into your account
          and modifying your information or by contacting us.
        </li>
        <li>
          <strong>Cookies:</strong> Most web browsers are set to accept cookies
          by default. If you prefer, you can usually choose to set your browser
          to remove or reject browser cookies.
        </li>
        <li>
          <strong>Promotional Communications:</strong> You can opt out of
          receiving promotional emails from us by following the instructions in
          those emails. If you opt out, we may still send you non-promotional
          emails, such as those about your account or our ongoing business
          relations.
        </li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We take reasonable measures to help protect information about you from
        loss, theft, misuse, and unauthorized access, disclosure, alteration,
        and destruction.
      </p>

      <h2>Changes to the Privacy Policy</h2>
      <p>
        We reserve the right to modify or replace this Privacy Policy at any
        time at our sole discretion. If we make changes, we will notify you by
        revising the date at the top of the policy and, in some cases, we may
        provide you with additional notice (such as adding a statement to our
        homepage or sending you a notification). Your continued use of the App
        following the posting of any changes to the Privacy Policy constitutes
        acceptance of those changes.
      </p>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Pollist",
};
