import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const tailwindConfig: Config = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
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
        ".scrollbar-gutter-stable": {
          "scrollbar-gutter": "stable both-edges",
        },
      });
    }),
  ],
};

export default tailwindConfig;
