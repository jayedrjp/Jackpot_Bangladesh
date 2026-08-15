import Hero from "@/components/home/Hero";
import Categories from "@/components/home/OffersSection";
import OurPopular from "@/components/home/OurPopular";
import GoogleReviews from "@/components/home/GoogleReviews";
import BranchPreview from "@/components/home/BranchPreview";
import OffersSection from "@/components/home/OffersSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <OffersSection />
      <OurPopular />
      <GoogleReviews />
      <BranchPreview />
    </>
  );
}
