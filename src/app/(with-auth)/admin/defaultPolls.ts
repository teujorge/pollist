"use server";

import { db } from "@/database/prisma";

export async function createPollsFromList() {
  if (process.env.NODE_ENV !== "development") {
    console.error("This function is only available in development mode.");
    return;
  }

  if (process.env.ADMIN_ID === undefined) {
    console.error("Bad ADMIN_ID.");
    return;
  }

  const _polls = polls.sort(() => Math.random() - 0.5);
  for (const poll of _polls) {
    const { question, description, options } = poll;

    try {
      await db.poll.create({
        data: {
          authorId: process.env.ADMIN_ID,
          title: question,
          description: description,
          options: {
            create: options.map((option) => ({ text: option })),
          },
        },
      });
    } catch (error) {
      console.error(`Error creating poll '${question}': `, error);
    }
  }
}

export async function deleteAllPolls() {
  if (process.env.NODE_ENV !== "development") {
    console.error("This function is only available in development mode.");
    return;
  }

  if (process.env.ADMIN_ID === undefined) {
    console.error("Bad ADMIN_ID.");
    return;
  }

  await db.poll.deleteMany({
    where: { authorId: process.env.ADMIN_ID },
  });
}

// CRON JOBS TEST

export async function testCron() {
  if (process.env.NODE_ENV !== "development") {
    console.error("This function is only available in development mode.");
    return;
  }

  if (process.env.ADMIN_ID === undefined) {
    console.error("Bad ADMIN_ID.");
    return;
  }

  await fetch("http://localhost:3000/api/purge-expired");
  await fetch("http://localhost:3000/api/controversy-calculator");
}

type Poll = {
  question: string;
  description?: string;
  options: string[];
};

const polls: Poll[] = [
  {
    question: "Which modern invention do we most take for granted?",
    options: ["Smartphones", "The Internet", "Vaccines", "Plastic"],
  },
  {
    question: "What's the biggest threat to humanity today?",
    options: [
      "Climate change",
      "Artificial Intelligence",
      "Nuclear war",
      "Pandemics",
    ],
  },
  {
    question: "Should voting be mandatory?",
    options: [
      "Yes, it's a civic duty",
      "No, it's a personal choice",
      "Only for critical issues",
      "Indifferent, doesn't change much",
    ],
  },
  {
    question: "Is the concept of a 9-5 job outdated?",
    options: [
      "Yes, we need more flexibility",
      "No, it provides structure",
      "Work should be task-based, not time-based",
      "The whole employment system needs rethinking",
    ],
  },
  {
    question: "Should education be entirely online?",
    options: [
      "Yes, it's more accessible",
      "No, in-person interaction is crucial",
      "Hybrid models are the future",
      "Depends on the level of education",
    ],
  },
  {
    question: "Can technology solve all our problems?",
    options: [
      "Yes, it's just a matter of time",
      "No, some problems are beyond technology",
      "Technology creates as many problems as it solves",
      "We should focus more on ethics than tech",
    ],
  },
  {
    question: "Is universal basic income a good idea?",
    options: [
      "Yes, it ensures a safety net for everyone",
      "No, it discourages productivity",
      "Only if complemented with other social programs",
      "The economy can't support it",
    ],
  },
  {
    question: "Should we colonize other planets?",
    options: [
      "Yes, to ensure human survival",
      "No, we should fix Earth first",
      "Only if it's sustainable and ethical",
      "It's an inevitable step for humanity",
    ],
  },
  {
    question: "Is social media more harmful than beneficial?",
    options: [
      "Yes, it's damaging to mental health",
      "No, it connects the world",
      "It's a tool; usage determines its impact",
      "Benefits and harms are equally balanced",
    ],
  },
  {
    question: "Should there be limits on free speech?",
    options: [
      "Yes, to prevent hate speech",
      "No, all speech should be free",
      "Only if it incites violence",
      "Limits are necessary in a civilized society",
    ],
  },
  {
    question: "What's the best way to eat pizza?",
    options: [
      "With your hands, like a true pizza lover.",
      "With a fork and knife, to avoid the mess.",
      "Cold, straight out of the fridge.",
    ],
  },
  {
    question: "If you could have one superpower, what would it be?",
    options: ["Invisibility", "Flight", "Mind reading", "Time travel"],
  },
  {
    question: "Which fictional city would you live in?",
    options: ["Gotham City", "Hogwarts", "The Shire", "Wakanda"],
  },
  {
    question: "Who would win in a battle of wits?",
    options: [
      "Sherlock Holmes",
      "Tony Stark (Iron Man)",
      "Tyrion Lannister",
      "Lisa Simpson",
    ],
  },
  {
    question: "What's the best way to deal with a zombie apocalypse?",
    options: [
      "Befriend the zombies.",
      "Build a fortress.",
      "Run for the hills.",
      "Become a zombie to fit in.",
    ],
  },
  {
    question: "If animals could talk, which would be the rudest?",
    options: ["Cats", "Seagulls", "Monkeys", "Dolphins"],
  },
  {
    question: "What invention has had the most significant impact on humanity?",
    options: ["The wheel", "The internet", "Penicillin", "The printing press"],
  },
  {
    question: "Which period in history had the best fashion?",
    options: [
      "The Roaring Twenties",
      "The Hippie Sixties",
      "The Victorian Era",
      "The Renaissance",
    ],
  },
  {
    question:
      "If you could only use one for the rest of your life, which would you choose?",
    options: ["Social media", "Streaming services", "Video games", "Books"],
  },
  {
    question: "Is pineapple an acceptable pizza topping?",
    options: [
      "Yes, it's the perfect blend of sweet and savory.",
      "No, fruit has no place on a pizza.",
    ],
  },
  {
    question: "Should adults be allowed to ride scooters?",
    options: [
      "Absolutely, scooters are for everyone.",
      "No, leave the scooters for the kids.",
    ],
  },
  {
    question: "What's the most overrated movie franchise?",
    options: [
      "The Marvel Cinematic Universe",
      "The Star Wars Saga",
      "The Harry Potter Series",
      "The Fast and the Furious",
    ],
  },
  {
    question: "Is it okay to recline your seat on an airplane?",
    options: [
      "Yes, if the seat reclines, I'm reclining.",
      "No, it's inconsiderate to the person behind you.",
    ],
  },
  {
    question:
      "What is your perspective on the impact of pornography in society?",
    options: [
      "It has positive effects, such as promoting openness about sexuality.",
      "It can have negative effects, potentially impacting relationships and mental health.",
      "More regulation is needed to mitigate its negative aspects.",
      "Its impact varies greatly and depends on individual usage and context.",
    ],
    description:
      "This question seeks to understand diverse views on a complex issue. We encourage thoughtful responses and respect for different opinions.",
  },
  {
    question: "How do you view the future of AI's impact on the job market?",
    options: [
      "AI will eventually take over most jobs, leaving many unemployed.",
      "AI has reached its peak; its impact on jobs will be minimal going forward.",
      "It will take a long time for AI to significantly impact most jobs.",
      "Humans will always play a crucial role, with AI enhancing our work efficiency and capabilities.",
    ],
    description:
      "As AI technology evolves, opinions vary on how it will affect our working lives. What's your take on the future of AI in the job market?",
  },
  {
    question:
      "If you could live forever but had to give up one thing, what would it be?",
    options: ["Taste", "Ability to fall in love", "Sleeping", "Memories"],
    description:
      "Imagine immortality comes with a price. What sacrifice would you make?",
  },
  {
    question:
      "Would you rather know all the mysteries of the universe or know every outcome of your decisions?",
    options: ["Mysteries of the universe", "Outcomes of my decisions"],
  },
  {
    question: "Which apocalypse would you rather face?",
    options: [
      "Zombie outbreak",
      "Alien invasion",
      "Robot uprising",
      "Super volcano eruption",
    ],
  },
  {
    question: "In an alternate universe, which role would you choose?",
    options: [
      "Pirate in the high seas",
      "Knight in medieval times",
      "Space explorer in the galaxy",
      "Wizard in a magical realm",
    ],
  },
  {
    question: "What's the ultimate comfort food?",
    options: ["Ice cream", "Pizza", "Chocolate", "Mac and cheese"],
  },
  {
    question: "If you could communicate with one species, which would it be?",
    options: ["Birds", "Dogs", "Cats", "Whales"],
  },
  {
    question: "What skill would you want to master instantly?",
    options: [
      "Playing an instrument",
      "Speaking multiple languages",
      "Master chef cooking skills",
      "Professional sports",
    ],
  },
  {
    question: "Which fictional gadget do you wish was real?",
    options: ["Time machine", "Teleporter", "Invisibility cloak", "Hoverboard"],
  },
  {
    question:
      "Would you rather have the power to read minds or alter memories?",
    options: ["Read minds", "Alter memories"],
  },
  {
    question: "What's the most important trait for a leader to have?",
    options: ["Empathy", "Decisiveness", "Integrity", "Vision"],
  },
  {
    question:
      "Is it better to have loved and lost than never to have loved at all?",
    options: ["Yes, the experience is worth it", "No, the pain isn't worth it"],
  },
  {
    question:
      "Which era of human history would you visit if you could time travel?",
    options: [
      "Dinosaurs and prehistoric times",
      "Ancient Egypt",
      "Medieval Europe",
      "The future, 100 years from now",
    ],
  },
  {
    question:
      "Would you rather explore the depths of the ocean or outer space?",
    options: ["Ocean depths", "Outer space"],
  },
  {
    question: "If you could only save one, would you choose art or science?",
    options: ["Art", "Science"],
  },
  {
    question: "What's more important: privacy or security?",
    options: ["Privacy", "Security"],
  },
  {
    question:
      "Would you rather live in a utopia as a normal person or in a dystopia but as a leader?",
    options: ["Utopia as a normal person", "Dystopia but as a leader"],
  },
  {
    question: "Should genetic engineering be used to enhance human abilities?",
    options: [
      "Yes, it's the next step in human evolution",
      "No, it's unethical and dangerous",
      "Only for medical purposes, not enhancements",
      "It's inevitable, but we need strict regulations",
    ],
  },
  {
    question:
      "Is it ethical to colonize Mars if it means potentially harming undiscovered Martian life?",
    options: [
      "Yes, human expansion is a priority",
      "No, we must prioritize protecting all forms of life",
      "Only if we can ensure no harm to Martian ecosystems",
      "We should focus on Earth before considering Mars",
    ],
  },
  {
    question: "Should the wealthy have a significantly higher tax rate?",
    options: [
      "Yes, it's necessary for social equity",
      "No, it discourages wealth creation and investment",
      "Yes, but only if it directly funds social programs",
      "No, tax reform should focus on closing loopholes instead",
    ],
  },
  {
    question:
      "Is it possible to achieve true democracy in the age of misinformation?",
    options: [
      "Yes, through education and media literacy",
      "No, misinformation too deeply influences public opinion",
      "It's possible, but requires significant changes in social media regulation",
      "True democracy was always an ideal, not a reality",
    ],
  },
  {
    question:
      "Should there be global governance to tackle worldwide issues like climate change?",
    options: [
      "Yes, it's the only way to address global challenges",
      "No, it would infringe on national sovereignty",
      "Yes, but with significant input from local governments",
      "No, global efforts can be coordinated without a single governing body",
    ],
  },
  {
    question: "Can true equality ever be achieved?",
    options: [
      "Yes, through continuous social reform and education",
      "No, inherent biases and systemic structures will always exist",
      "It's a goal worth striving for, even if it's unattainable",
      "The concept of equality needs to be redefined for progress",
    ],
  },
  {
    question: "Is it ethical to create AI that mimics human emotions?",
    options: [
      "Yes, it can greatly benefit human-AI interaction",
      "No, it blurs the line between humanity and machines",
      "Only if there are strict guidelines and purposes",
      "The ethical implications are too complex to decide yet",
    ],
  },
  {
    question: "Should prisoners be allowed to vote?",
    options: [
      "Yes, disenfranchisement is a violation of democratic principles",
      "No, committing a crime should suspend certain rights",
      "Yes, but only for those committing non-violent crimes",
      "No, but voting rights should be restored after serving time",
    ],
  },
  {
    question:
      "If you could only keep one, would you choose the internet or your pet?",
    options: ["The internet", "My pet"],
    description:
      "A tough choice for the modern individual, balancing between digital connectivity and companionship.",
  },
  {
    question: "Would you accept a one-way ticket to start a new life on Mars?",
    options: ["Yes, sign me up!", "No, Earth is home"],
  },
  {
    question:
      "If you could eat only one food for the rest of your life, what would it be?",
    options: ["Pizza", "Sushi", "Chocolate", "Pasta"],
  },
  {
    question: "What era would you visit if time travel was safe and easy?",
    options: [
      "The future",
      "The age of dinosaurs",
      "Ancient Rome",
      "The 1980s",
    ],
  },
  {
    question:
      "Would you rather be able to talk to animals or speak all foreign languages?",
    options: ["Talk to animals", "Speak all foreign languages"],
  },
  {
    question: "If you found a magic lamp, what would be your first wish?",
    options: [
      "Endless wealth",
      "Eternal health",
      "World peace",
      "Infinite wisdom",
    ],
  },
  {
    question:
      "In a battle of survival, which fictional character would you choose as your ally?",
    options: ["Batman", "Katniss Everdeen", "Harry Potter", "Wonder Woman"],
  },
  {
    question:
      "If you could instantly master a musical instrument, which would it be?",
    options: ["Guitar", "Piano", "Violin", "Drums"],
  },
  {
    question:
      "Would you rather have a rewind button or a pause button for your life?",
    options: ["Rewind", "Pause"],
  },
  {
    question:
      "If you could choose, would you rather live in a world without lies or without secrets?",
    options: ["Without lies", "Without secrets"],
  },
  {
    question: "What's the ultimate movie snack?",
    options: ["Popcorn", "Nachos", "Candy", "Ice cream"],
  },
  {
    question:
      "If you could bring one extinct animal back to life, which would it be?",
    options: ["Dodo", "Woolly mammoth", "Tasmanian tiger", "Passenger pigeon"],
  },
];
