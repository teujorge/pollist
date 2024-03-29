import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  const numberFormatter = new Intl.NumberFormat(undefined, {
    style: "decimal",
    notation: "compact",
    maximumSignificantDigits: 3,
  });

  return numberFormatter.format(num);
}

export function uppercaseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function uppercaseFirstLetterOfEachSentence(str: string): string {
  const regex = /([^.!?]+[.!?]\s*)/g;
  return (
    str
      .match(regex)
      ?.map((sentence) => (sentence ? uppercaseFirstLetter(sentence) : ""))
      .join("") ?? str
  );
}
