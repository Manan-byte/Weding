import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import EntranceCover from "@/components/wedding/EntranceCover";
import LazyVisible from "@/components/LazyVisible";

const loadNavigation = () => import("@/components/wedding/Navigation");
const loadHeroSection = () => import("@/components/wedding/HeroSection");
const loadOurStory = () => import("@/components/wedding/OurStory");
const loadEventDetails = () => import("@/components/wedding/EventDetails");
const loadLoveQuote = () => import("@/components/wedding/LoveQuote");
const loadGiftSection = () => import("@/components/wedding/GiftSection");
const loadWishesSection = () => import("@/components/wedding/WishesSection");
const loadFooter = () => import("@/components/wedding/Footer");
const loadMusicPlayer = () => import("@/components/wedding/MusicPlayer");

const Navigation = lazy(loadNavigation);
const HeroSection = lazy(loadHeroSection);
const OurStory = lazy(loadOurStory);
const EventDetails = lazy(loadEventDetails);
const LoveQuote = lazy(loadLoveQuote);
const GiftSection = lazy(loadGiftSection);
const WishesSection = lazy(loadWishesSection);
const Footer = lazy(loadFooter);
const MusicPlayer = lazy(loadMusicPlayer);

const SectionFallback = () => null;
const HeroFallback = () => <div className="min-h-[100svh] bg-background" />;

const Index = () => {
  const [showCover, setShowCover] = useState(true);
  const [musicReady, setMusicReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Preload above-the-fold chunks immediately so no loading flash appears
    // when the user opens the cover.
    loadNavigation();
    loadHeroSection();
    loadOurStory();
    loadMusicPlayer();
  }, []);

  const handleCoverOpen = () => {
    setShowCover(false);
    setMusicReady(true);
  };

  return (
    <div className="min-h-[100svh]">
      <AnimatePresence>
        {showCover && <EntranceCover onOpen={handleCoverOpen} />}
      </AnimatePresence>

      {!showCover && (
        <>
          <Suspense fallback={<HeroFallback />}>
            <Navigation />
            <HeroSection />
          </Suspense>

          <LazyVisible minHeight="600px">
            <Suspense fallback={<SectionFallback />}>
              <OurStory />
            </Suspense>
          </LazyVisible>
          <LazyVisible minHeight="600px">
            <Suspense fallback={<SectionFallback />}>
              <EventDetails />
            </Suspense>
          </LazyVisible>
          <LazyVisible minHeight="400px">
            <Suspense fallback={<SectionFallback />}>
              <LoveQuote />
            </Suspense>
          </LazyVisible>
          <LazyVisible minHeight="400px">
            <Suspense fallback={<SectionFallback />}>
              <GiftSection />
            </Suspense>
          </LazyVisible>
          <LazyVisible minHeight="600px">
            <Suspense fallback={<SectionFallback />}>
              <WishesSection />
            </Suspense>
          </LazyVisible>
          <LazyVisible minHeight="200px">
            <Suspense fallback={<SectionFallback />}>
              <Footer />
            </Suspense>
          </LazyVisible>
          <Suspense fallback={null}>
            <MusicPlayer startPlaying={musicReady} />
          </Suspense>
        </>
      )}
    </div>
  );
};

export default Index;

