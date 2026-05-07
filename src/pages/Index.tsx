import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/wedding/Navigation";
import HeroSection from "@/components/wedding/HeroSection";
import EntranceCover from "@/components/wedding/EntranceCover";

// Lazy load below-fold sections individually for better chunking.
// Imports are exposed as functions so we can also call them eagerly for
// preloading while the EntranceCover is visible.
const importOurStory = () => import("@/components/wedding/OurStory");
const importEventDetails = () => import("@/components/wedding/EventDetails");
const importLoveQuote = () => import("@/components/wedding/LoveQuote");
const importGiftSection = () => import("@/components/wedding/GiftSection");
const importWishesSection = () => import("@/components/wedding/WishesSection");
const importFooter = () => import("@/components/wedding/Footer");
const importMusicPlayer = () => import("@/components/wedding/MusicPlayer");

const OurStory = lazy(importOurStory);
const EventDetails = lazy(importEventDetails);
const LoveQuote = lazy(importLoveQuote);
const GiftSection = lazy(importGiftSection);
const WishesSection = lazy(importWishesSection);
const Footer = lazy(importFooter);
const MusicPlayer = lazy(importMusicPlayer);

const SectionFallback = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold-dark rounded-full animate-spin" />
  </div>
);

// Wedding invitation page
const Index = () => {
  const [showCover, setShowCover] = useState(true);
  const [musicReady, setMusicReady] = useState(false);

  // Always scroll to top on page load/refresh, and eagerly preload every
  // lazy section + the music player chunk while the EntranceCover is still
  // showing. By the time the user clicks "Buka Kabar Bahagia" all chunks
  // are already in memory, so no <SectionFallback /> spinner is shown.
  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      importOurStory(),
      importEventDetails(),
      importLoveQuote(),
      importGiftSection(),
      importWishesSection(),
      importFooter(),
      importMusicPlayer(),
    ]).catch(() => {
      /* preload errors are non-fatal; Suspense will retry on render */
    });
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

