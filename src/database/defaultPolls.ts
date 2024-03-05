"use server";

import { db } from "./db";

type Poll = {
  question: string;
  options: { text: string }[];
};

const polls: Poll[] = [
  {
    question: "Which modern invention do we most take for granted?",
    options: [
      { text: "Smartphones" },
      { text: "The Internet" },
      { text: "Vaccines" },
      { text: "Plastic" },
    ],
  },
  {
    question: "What's the biggest threat to humanity today?",
    options: [
      { text: "Climate change" },
      { text: "Artificial Intelligence" },
      { text: "Nuclear war" },
      { text: "Pandemics" },
    ],
  },
  {
    question: "Should voting be mandatory?",
    options: [
      { text: "Yes, it's a civic duty" },
      { text: "No, it's a personal choice" },
      { text: "Only for critical issues" },
      { text: "Indifferent, doesn't change much" },
    ],
  },
  {
    question: "Is the concept of a 9-5 job outdated?",
    options: [
      { text: "Yes, we need more flexibility" },
      { text: "No, it provides structure" },
      { text: "Work should be task-based, not time-based" },
      { text: "The whole employment system needs rethinking" },
    ],
  },
  {
    question: "Should education be entirely online?",
    options: [
      { text: "Yes, it's more accessible" },
      { text: "No, in-person interaction is crucial" },
      { text: "Hybrid models are the future" },
      { text: "Depends on the level of education" },
    ],
  },
  {
    question: "Can technology solve all our problems?",
    options: [
      { text: "Yes, it's just a matter of time" },
      { text: "No, some problems are beyond technology" },
      { text: "Technology creates as many problems as it solves" },
      { text: "We should focus more on ethics than tech" },
    ],
  },
  {
    question: "Is universal basic income a good idea?",
    options: [
      { text: "Yes, it ensures a safety net for everyone" },
      { text: "No, it discourages productivity" },
      { text: "Only if complemented with other social programs" },
      { text: "The economy can't support it" },
    ],
  },
  {
    question: "Should we colonize other planets?",
    options: [
      { text: "Yes, to ensure human survival" },
      { text: "No, we should fix Earth first" },
      { text: "Only if it's sustainable and ethical" },
      { text: "It's an inevitable step for humanity" },
    ],
  },
  {
    question: "Is social media more harmful than beneficial?",
    options: [
      { text: "Yes, it's damaging to mental health" },
      { text: "No, it connects the world" },
      { text: "It's a tool; usage determines its impact" },
      { text: "Benefits and harms are equally balanced" },
    ],
  },
  {
    question: "Should there be limits on free speech?",
    options: [
      { text: "Yes, to prevent hate speech" },
      { text: "No, all speech should be free" },
      { text: "Only if it incites violence" },
      { text: "Limits are necessary in a civilized society" },
    ],
  },
  {
    question: "What's the best way to eat pizza?",
    options: [
      { text: "With your hands, like a true pizza lover." },
      { text: "With a fork and knife, to avoid the mess." },
      { text: "Cold, straight out of the fridge." },
    ],
  },
  {
    question: "If you could have one superpower, what would it be?",
    options: [
      { text: "Invisibility" },
      { text: "Flight" },
      { text: "Mind reading" },
      { text: "Time travel" },
    ],
  },
  {
    question: "Which fictional city would you live in?",
    options: [
      { text: "Gotham City" },
      { text: "Hogwarts" },
      { text: "The Shire" },
      { text: "Wakanda" },
    ],
  },
  {
    question: "Who would win in a battle of wits?",
    options: [
      { text: "Sherlock Holmes" },
      { text: "Tony Stark (Iron Man)" },
      { text: "Tyrion Lannister" },
      { text: "Lisa Simpson" },
    ],
  },
  {
    question: "What's the best way to deal with a zombie apocalypse?",
    options: [
      { text: "Befriend the zombies." },
      { text: "Build a fortress." },
      { text: "Run for the hills." },
      { text: "Become a zombie to fit in." },
    ],
  },
  {
    question: "If animals could talk, which would be the rudest?",
    options: [
      { text: "Cats" },
      { text: "Seagulls" },
      { text: "Monkeys" },
      { text: "Dolphins" },
    ],
  },
  {
    question: "What invention has had the most significant impact on humanity?",
    options: [
      { text: "The wheel" },
      { text: "The internet" },
      { text: "Penicillin" },
      { text: "The printing press" },
    ],
  },
  {
    question: "Which period in history had the best fashion?",
    options: [
      { text: "The Roaring Twenties" },
      { text: "The Hippie Sixties" },
      { text: "The Victorian Era" },
      { text: "The Renaissance" },
    ],
  },
  {
    question:
      "If you could only use one for the rest of your life, which would you choose?",
    options: [
      { text: "Social media" },
      { text: "Streaming services" },
      { text: "Video games" },
      { text: "Books" },
    ],
  },
  {
    question: "Is pineapple an acceptable pizza topping?",
    options: [
      { text: "Yes, it's the perfect blend of sweet and savory." },
      { text: "No, fruit has no place on a pizza." },
    ],
  },
  {
    question: "Should adults be allowed to ride scooters?",
    options: [
      { text: "Absolutely, scooters are for everyone." },
      { text: "No, leave the scooters for the kids." },
    ],
  },
  {
    question: "What's the most overrated movie franchise?",
    options: [
      { text: "The Marvel Cinematic Universe" },
      { text: "The Star Wars Saga" },
      { text: "The Harry Potter Series" },
      { text: "The Fast and the Furious" },
    ],
  },
  {
    question: "Is it okay to recline your seat on an airplane?",
    options: [
      { text: "Yes, if the seat reclines, I'm reclining." },
      { text: "No, it's inconsiderate to the person behind you." },
    ],
  },
];

export async function createPollsFromList() {
  for (const poll of polls) {
    const { question, options } = poll;

    try {
      await db.poll.create({
        data: {
          authorId: await adminId(),
          title: question,
          description: "",
          options: {
            create: options.map((option) => ({ text: option.text })),
          },
        },
      });
    } catch (error) {
      console.error(`Error creating poll '${question}': `, error);
    }
  }
}

export async function deleteAllPolls() {
  await db.poll.deleteMany({
    where: { authorId: await adminId() },
  });
}

export const adminId = async () => "user_2cPaAJQIPmK7XooVoIExRO7M2lF";

// CRON JOBS TEST

export async function testCron() {
  await fetch("http://localhost:3000/api/purge-expired");
  await fetch("http://localhost:3000/api/controversy-calculator");
}
