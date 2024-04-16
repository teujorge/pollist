"use server";

import OpenAI from "openai";

/**
 * Check if the content is sensitive
 * @param content
 * @returns Whether the content is sensitive
 */
export async function moderate(content: string) {
  // create a new OpenAI instance
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // get moderation results
  const moderationRes = await openai.moderations.create({
    input: content,
  });

  // check if the content is flagged
  if (moderationRes.results[0]?.flagged) return true;

  // get the category scores
  const moderations = moderationRes.results[0]?.category_scores;

  // check if the content is sensitive
  for (const category in moderations) {
    const index = category as keyof typeof moderations;
    const score = moderations[index];

    if (score > 0.25) return true;
  }

  // return false if the content is not sensitive
  return false;
}
