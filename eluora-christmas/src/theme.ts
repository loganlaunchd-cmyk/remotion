import { loadFont } from "@remotion/google-fonts/CormorantGaramond";

const cormorant = loadFont("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
});

export const SERIF = cormorant.fontFamily;
export const GOLD = "#C9A45C";
export const IVORY = "#F3EDE2";
export const BLACK = "#070605";
