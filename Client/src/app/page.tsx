import { Preloader } from "@/components/home/Preloader";
import { Hero } from "@/components/home/Hero";
import { ScrollChapters } from "@/components/home/ScrollChapters";
import { ColorStory } from "@/components/home/ColorStory";
import { SpecsStrip } from "@/components/home/SpecsStrip";
import { AiTeaser } from "@/components/home/AiTeaser";
import { Reviews } from "@/components/home/Reviews";
import { BuyCta } from "@/components/home/BuyCta";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Hero />
      <ScrollChapters />
      <ColorStory />
      <SpecsStrip />
      <AiTeaser />
      <Reviews />
      <BuyCta />
    </>
  );
}
