import { Input } from "@/app/components/Input";
import { Button } from "@/components/ui/button";
import { BlobBg } from "@/app/components/BlobBg";
import { StackPlus } from "@phosphor-icons/react/dist/ssr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata } from "next";

const faqData = [
  {
    question: <>How do I create a poll?</>,
    answer: (
      <>
        Creating a poll on Pollist is a breeze! Simply log into your account and
        click on the <strong>Create</strong>{" "}
        <StackPlus className="inline-block" /> button on the main app. You can
        add questions, set options, and even upload images to make your poll
        more engaging. Once you&apos;re satisfied, hit <strong>Submit</strong>{" "}
        and your poll will be live for the community to participate in.
      </>
    ),
  },
  {
    question: <>Can I edit a poll after publishing?</>,
    answer: (
      <>
        No, you can&quot;t edit a poll after publishing. Once a poll is
        published, it&quot;s final and cannot be modified. If you need to make
        changes, you can delete the existing poll and create a new one with the
        updated information.
      </>
    ),
  },
  {
    question: <>How do I delete my account?</>,
    answer: (
      <>
        We&quot;re sorry to see you go! If you wish to delete your account,
        please log in and navigate to your account settings. Within your
        security settings, you should see an option to delete your account
        there. Keep in mind that this action is irreversible and all your data
        will be permanently removed from our servers.
      </>
    ),
  },
  {
    question: <>Can I share my polls on social media?</>,
    answer: (
      <>
        Yes, you can share your polls on social media directly from Pollist.
        Once your poll is published, click the <strong>Share</strong> button on
        your poll page and choose the social media platform you want to share it
        on. This is a great way to reach a wider audience and get more
        responses!
      </>
    ),
  },
  {
    question: <>How do I participate in a poll?</>,
    answer: (
      <>
        Participating in a poll is simple! Browse through the list of available
        polls on the homepage or search for a specific topic. Click on the poll
        you want to participate in and select your answer. You can also leave
        comments and engage in discussions about the poll.
      </>
    ),
  },
  {
    question: <>What do I get with the Pro tier?</>,
    answer: (
      <>
        The Pro tier offers additional benefits to enhance your Pollist
        experience. With the Pro subscription, you enjoy the following features:
        No ads, Private account, Image uploads, and more to come! For more
        details, visit our subscription page.
      </>
    ),
  },
];

export default function SupportPage() {
  return (
    <main>
      <BlobBg />

      <div className="relative z-10 flex flex-col py-24">
        <h1 className="text-center text-7xl font-black md:text-9xl">Support</h1>
      </div>

      <section className="relative z-10 flex flex-col items-center gap-16 px-4 py-10">
        <h2 className="text-center text-xl font-semibold">
          Need help with Pollist? We&apos;re here to assist you! Whether
          you&apos;re encountering an issue or just have a question, our support
          team is ready to help.
        </h2>

        <div className="w-full max-w-4xl">
          <div className="mb-10 rounded-lg border border-accent bg-background/85 p-4 shadow-md">
            <h3 className="mb-4 text-2xl font-bold">
              Frequently Asked Questions
            </h3>
            <Accordion type="multiple" className="w-full p-4">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mb-10 rounded-lg border border-accent bg-background/85 p-4 shadow-md">
            <h3 className="mb-4 text-2xl font-bold">Contact Us</h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactForm() {
  return (
    <form
      className="space-y-2 p-4"
      action="https://api.web3forms.com/submit"
      method="POST"
    >
      <input
        type="hidden"
        name="access_key"
        value={process.env.CONTACT_FORM_ACCESS_KEY}
      />
      <input
        type="hidden"
        name="redirect"
        value={`https://pollist.org/support/success`}
      />
      <input type="checkbox" name="botcheck" className="hidden" />

      <Input
        labelProps={{ text: "Name" }}
        inputProps={{
          type: "text",
          id: "name",
          name: "name",
          required: true,
        }}
      />

      <Input
        labelProps={{ text: "Email" }}
        inputProps={{
          type: "email",
          id: "email",
          name: "email",
          required: true,
        }}
      />

      <div className="flex w-full flex-col p-1">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full resize-none"
          required
        />
      </div>

      <div className="px-4 py-2">
        <Button type="submit" variant="secondary" className="w-full">
          Submit
        </Button>
      </div>
    </form>
  );
}

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help and support for Pollist. We&apos;re here to assist you with any questions or issues.",
};
