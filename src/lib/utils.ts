import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

/**
 * Merges the given class names and returns the resulting class name
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats the given number to a string with the specified number of significant figures
 * @param num
 * @param sigFigs
 * @returns e.g. 12345 => "12.3k"
 */
export function formatNumber(num: number, sigFigs = 3): string {
  const numberFormatter = new Intl.NumberFormat(undefined, {
    style: "decimal",
    notation: "compact",
    maximumSignificantDigits: sigFigs,
  });

  return numberFormatter.format(num);
}

/**
 * Capitalizes the first letter of the given string
 * @param str
 * @returns e.g. "hello world" => "Hello world"
 */
export function uppercaseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalizes the first letter of each sentence in the given string
 * @param str
 * @returns e.g. "hello. how are you?" => "Hello. How are you?"
 */
export function uppercaseFirstLetterOfEachSentence(str: string): string {
  const regex = /([^.!?]+[.!?]\s*)/g;
  return (
    str
      .match(regex)
      ?.map((sentence) => (sentence ? uppercaseFirstLetter(sentence) : ""))
      .join("") ?? uppercaseFirstLetter(str)
  );
}

/**
 * Returns the time elapsed since the given date
 * @param date
 * @returns e.g. "2 days", "5 minutes", "1 year"
 */
export function timeElapsed(date: Date): string {
  // Calculate the difference in seconds between the current date and the given date
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  // Calculate the interval in years, months, days, hours, minutes, or seconds
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

/**
 * Returns whether the given content should be shown to the user
 * @param userId
 * @param contentCreatorId
 * @param isContentSensitive
 * @param userViewsSensitiveContent
 * @returns boolean
 */
export function shouldShowSensitiveContent({
  userId,
  contentCreatorId,
  isContentSensitive,
  userViewsSensitiveContent,
}: {
  userId: string | undefined | null;
  contentCreatorId: string;
  isContentSensitive: boolean;
  userViewsSensitiveContent: boolean | undefined | null;
}): boolean {
  if (!isContentSensitive) return true;

  if (userViewsSensitiveContent) return true;

  if (userId === contentCreatorId) return true;

  return false;
}

/**
 * Returns the string representation of the given poll
 */
export function pollToString({
  title,
  description,
  option1,
  option2,
  options,
}: {
  title: string;
  description: string | undefined | null;
  option1: string;
  option2: string;
  options: string[];
}) {
  return `title: ${title} | description: ${description} | option1: ${option1} | option2: ${option2} | ${options
    .map((option, index) => "option" + (index + 3).toString() + ": " + option)
    .join(" | ")}`;
}
