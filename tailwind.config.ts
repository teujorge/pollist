import plugin from "tailwindcss/plugin";
import { fontFamily } from "tailwindcss/defaultTheme";

import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", ...fontFamily.sans],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-foreground":
          "rgb(var(--color-primary-foreground) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "secondary-foreground":
          "rgb(var(--color-secondary-foreground) / <alpha-value>)",
        destructive: "rgb(var(--color-destructive) / <alpha-value>)",
        "destructive-foreground":
          "rgb(var(--color-destructive-foreground) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-foreground":
          "rgb(var(--color-accent-foreground) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),

    // hovact
    plugin(function ({ addVariant }) {
      addVariant("hovact", [
        "@media (min-width: 640px) { &:hover }",
        "&:active",
      ]);
    }),

    // scrollbar-gutter
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-gutter": {
          "scrollbar-gutter": "stable both-edges",
        },
      });
    }),
  ],
} satisfies Config;

export default config;
