import localFont from "next/font/local";

// Inter, self-hosted and preloaded, with a size-matched fallback so text doesn't jump when it loads.
export const inter = localFont({
  src: "./inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
