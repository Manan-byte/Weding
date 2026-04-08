import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/wedding/Navigation";
import HeroSection from "@/components/wedding/HeroSection";
import EntranceCover from "@/components/wedding/EntranceCover";

// Lazy load below-fold sections individually for better chunking
const OurStory = lazy(() => import("@/components/wedding/OurStory"));
const EventDetails = lazy(() => import("@/components/wedding/EventDetails"));
const Gallery = lazy(() => import("@/components/wedding/Gallery"));
const GiftSection = lazy(() => import("@/components/wedding/GiftSection"));
const WishesSection = lazy(() => import("@/components/wedding/WishesSection"));
const Footer = lazy(() => import("@/components/wedding/Footer"));
const MusicPlayer = lazy(() => import("@/components/wedding/MusicPlayer"));

const SectionFallback = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold-dark rounded-full animate-spin" />
  </div>
);

// Wedding invitation page
const Index = () => {
  const [showCover, setShowCover] = useState(true);
  const [musicReady, setMusicReady] = useState(false);

  // Always scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCoverOpen = () => {
    setShowCover(false);
    setMusicReady(true);
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {showCover && <EntranceCover onOpen={handleCoverOpen} />}
      </AnimatePresence>
      <Navigation />
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <OurStory />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <EventDetails />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Gallery />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <GiftSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WishesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <MusicPlayer startPlaying={musicReady} />
      </Suspense>
    </div>
  );
};

export default Index;
