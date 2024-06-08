import Link from "next/link";
import type { Metadata } from "next";

export default function TermsOfServicePage() {
  return (
    <main className="gap-2 [&>h2]:pt-10 [&>h2]:text-3xl [&>h2]:font-semibold [&>p]:py-2 [&>ul]:list-disc [&>ul]:pl-6">
      <div className="py-20">
        <h1 className="py-4 text-center text-7xl font-black md:text-9xl">
          Terms of Service
        </h1>
        <p className="text-center text-accent-foreground">
          Last updated: June 8, 2024
        </p>
      </div>

      <p>
        Welcome to Pollist! By accessing or using our website, mobile
        application, or services (collectively, the &quot;Service&quot;), you
        signify that you have read, understood, and agree to be bound by these
        Terms and Conditions (&quot;Terms&quot;), which include our Privacy
        Policy. If you do not agree with any of these terms, you are prohibited
        from using or accessing this site.
      </p>

      <h2>Use of Service</h2>
      <p>
        Pollist grants you a limited, non-exclusive, non-transferable, and
        revocable license to access and use the Service for personal,
        non-commercial purposes. You agree to use the Service in compliance with
        all applicable laws and regulations.
      </p>

      <h2>User-Generated Content</h2>
      <p>
        Users may post, upload, share, or store content, including messages,
        text, photos, videos, and other materials (collectively, &quot;User
        Content&quot;). You are solely responsible for your use of such features
        and for the User Content that you post. By posting User Content, you
        represent and warrant that you own or have the necessary rights to all
        of your User Content and that use of your User Content does not
        infringe, misappropriate, or violate the rights of any third party.
        <br /> <br />
        While we strive to maintain high standards for quality and content, we
        do not monitor or control the User Content posted and can make no
        guarantees regarding its integrity, accuracy, or quality. We reserve the
        right to remove any User Content that we deem to be in violation of
        these Terms or otherwise harmful to the Service, but we assume no
        responsibility or liability for any User Content, including any loss or
        damage resulting from it.
      </p>

      <h2>Disclaimer of Warranties</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot;
        with all faults and without warranty of any kind. Pollist hereby
        disclaims all warranties and conditions with respect to the Service,
        either express, implied, or statutory, including, but not limited to,
        the implied warranties and/or conditions of merchantability, of
        satisfactory quality, of fitness for a particular purpose, of accuracy,
        of quiet enjoyment, and of non-infringement of third-party rights. No
        oral or written information or advice given by Pollist or its authorized
        representative shall create a warranty.
      </p>

      <h2>Acceptance of Terms</h2>
      <p>
        By accessing or using the Service, you agree to these Terms and consent
        to our collection, use, and sharing of your information as outlined in
        our{" "}
        <Link
          href="/privacy-policy"
          className="text-primary underline decoration-transparent transition-all hovact:decoration-primary"
        >
          Privacy Policy
        </Link>
        . If you do not agree to these Terms, you must not access or use the
        Service.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Pollist, its affiliates, and its service providers will not be liable
        for any indirect, incidental, special, consequential, or punitive
        damages, including loss of profits, data, use, goodwill, or other
        intangible losses, resulting from (a) your access to or use of or
        inability to access or use the Service; (b) any conduct or content of
        any third party on the Service; (c) any content obtained from the
        Service; and (d) unauthorized access, use, or alteration of your
        transmissions or content, whether based on warranty, contract, tort
        (including negligence), or any other legal theory, whether or not we
        have been informed of the possibility of such damage.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify or replace these Terms at any time at our
        sole discretion. If we make changes, we will notify you by revising the
        date at the top of the policy and, in some cases, we may provide you
        with additional notice (such as adding a statement to our homepage or
        sending you a notification). Your continued use of the Service following
        the posting of any changes to the Terms constitutes acceptance of those
        changes.
      </p>

      <h2>Termination</h2>
      <p>
        These Terms are effective until terminated by you or Pollist. Your
        rights under these Terms will terminate automatically if you fail to
        comply with any of its terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms and the relationship between you and Pollist shall be
        governed by the laws of the State of California, excluding its conflicts
        of law provisions. You and Pollist agree to submit to the personal and
        exclusive jurisdiction of the courts located within the county of Santa
        Clara, California, to resolve any dispute or claim arising from these
        Terms.
      </p>

      <h2>Miscellaneous</h2>
      <p>
        If any provision of these Terms is held to be invalid or unenforceable,
        such provision shall be struck and the remaining provisions shall be
        enforced to the fullest extent under law. Pollist&apos;s failure to
        enforce any right or provision in these Terms will not constitute a
        waiver of such right or provision unless acknowledged and agreed to by
        us in writing.
        <br /> <br />
        By using the Service, you agree to these Terms and acknowledge that you
        have read and understood them.
      </p>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read our terms and conditions for using Pollist.",
};
