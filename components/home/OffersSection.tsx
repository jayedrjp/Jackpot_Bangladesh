"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { placeholderFoodImage } from "@/lib/utils/placeholderImage";
import { getActivePromoBanners } from "@/lib/mock/promoBanners";

// Reuses the same banner data source as components/home/Categories.tsx
// (lib/mock/promoBanners.ts) so there's one list of promo images to manage,
// not two. Swap getActivePromoBanners() for live data later — see the TODO
// in that file.

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function OffersSection() {
  const banners = getActivePromoBanners();

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full" style={{ backgroundColor: "#FFFBF5" }}>
      <div className="container-max px-5 lg:px-8 py-16 sm:py-20">
        {/* Header — unchanged */}
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-jackpot-black tracking-tight">
              Today&apos;s Offers
            </h2>
            <p className="mt-2 text-jackpot-gray">
              Don&apos;t miss these limited-time deals.
            </p>
          </div>
          <Link
            href="/offers"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-jackpot-red hover:gap-2.5 transition-all shrink-0"
          >
            View All Offers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards — same grid/sizing/spacing as before; now pure image containers */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="shrink-0 w-[82%] xs:w-[75%] sm:w-auto aspect-[4/5] sm:aspect-[3/4] rounded-[20px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.16)] transition-shadow duration-300 cursor-pointer snap-start"
            >
              <Link href={banner.link} className="relative block h-full w-full">
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  className="object-cover"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <Link
          href="/offers"
          className="sm:hidden mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-jackpot-red"
        >
          View All Offers <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
