import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        omnes: ["omnes-pro", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "game-gradient":
          "linear-gradient(180deg, hsl(222, 59%, 10%) 0%, hsl(222, 59%, 5%) 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        button: {
          primary: "#00B0C5",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        game: {
          background: {
            DEFAULT: "hsl(222, 59%, 10%)", // #0A132A
            lighter: "hsl(222, 59%, 15%)",
            darker: "hsl(222, 59%, 5%)",
          },
          text: {
            DEFAULT: "hsl(220, 100%, 93%)", // #DAE6FF
            secondary: "#4665A9",
            muted: "hsl(220, 100%, 85%)",
            bright: "hsl(220, 100%, 98%)",
          },
          life: {
            full: "hsl(142, 76%, 45%)",
            mid: "hsl(39, 76%, 45%)",
            low: "hsl(0, 76%, 45%)",
            background: "hsl(224, 32%, 15%)",
          },
        },
      },
      rotate: {
        '10': '10deg',
      },
      keyframes: {
        "wiggle": {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        rise: {
          "0%": {
            transform: "translate(-50%, -50%)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(-50%, calc(-50% - 100px))",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        rise: "rise 2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        wiggle: 'wiggle 300ms ease-in-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
