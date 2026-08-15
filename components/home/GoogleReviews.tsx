"use client";

import "@fontsource/dancing-script/600.css";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Quote,
  MapPin,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { GoogleGIcon } from "@/components/ui/GoogleGIcon";
import { placeholderAvatarImage } from "@/lib/utils/placeholderImage";
import { DEV_PLACEHOLDER_TESTIMONIALS } from "@/lib/mock/testimonials";
import { BRANCHES_SEED } from "@/lib/constants";

// TODO: swap DEV_PLACEHOLDER_TESTIMONIALS for real, approved reviews via
// getApprovedReviews() (lib/services/reviews.ts) once the `reviews`
// collection has real, attributed customer/Google review data. See the
// warning at the top of lib/mock/testimonials.ts before shipping this live.
const TESTIMONIALS = DEV_PLACEHOLDER_TESTIMONIALS;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function GoogleReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [
      Autoplay({
        delay: 4500,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    ],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const primaryMapsUrl = BRANCHES_SEED[0]?.googleMapsUrl ?? "#";

  return (
    <section className="w-full" style={{ backgroundColor: "#FFFBF5" }}>
      <div className="container-max px-5 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="text-center max-w-4xl mx-auto mb-8"
        >
          {/* Small Label */}
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-jackpot-red mb-3">
            Customer Reviews
          </span>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-jackpot-black leading-tight">
            Loved by Thousands
          </h2>

          {/* Script Text — always on its own line, centered, never rotated */}
          <div
            className="text-[26px] sm:text-[32px] lg:text-[38px] leading-tight text-jackpot-red -mt-1"
            style={{
              fontFamily: '"Dancing Script", cursive',
            }}
          >
            of Food Lovers
          </div>

          {/* Description */}
          <p className="mt-3 text-sm sm:text-base text-jackpot-gray max-w-2xl mx-auto">
            Real experiences from customers who keep coming back for more.
          </p>
        </motion.div>

        {/* Google rating card */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="max-w-3xl mx-auto mb-8 sm:mb-10 rounded-[24px] bg-white border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-6 sm:px-8 py-4 sm:py-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 text-center">
            <div className="flex flex-col items-center gap-1.5 sm:pr-6">
              <GoogleGIcon className="h-6 w-6" />
              <span className="text-xs font-bold tracking-wide text-jackpot-gray uppercase">
                Google Reviews
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-jackpot-red text-jackpot-red"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-0.5 sm:border-x sm:border-black/5">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-jackpot-black">
                  4.9
                </span>
                <span className="text-sm text-jackpot-gray">/5</span>
              </div>
              <span className="text-xs text-jackpot-gray">Average rating</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-0.5 sm:pl-6">
              <span className="text-3xl font-black text-jackpot-black">
                1,200+
              </span>
              <span className="text-xs text-jackpot-gray">
                Verified Reviews
              </span>
            </div>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-5">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="pl-5 shrink-0 basis-full min-[640px]:basis-1/2 lg:basis-1/3"
                >
                  <div className="relative h-full rounded-[24px] bg-white border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-5 sm:p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)]">
                    <Quote
                      className="absolute top-5 right-5 h-8 w-8 text-jackpot-red/10"
                      fill="currentColor"
                      strokeWidth={0}
                    />

                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-jackpot-offwhite">
                        <Image
                          src={placeholderAvatarImage(t.avatarTag)}
                          alt={t.name}
                          fill
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-jackpot-black text-sm truncate">
                            {t.name}
                          </span>
                          {t.verified && (
                            <BadgeCheck className="h-4 w-4 text-jackpot-red shrink-0" />
                          )}
                        </div>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < t.rating ? "fill-jackpot-red text-jackpot-red" : "fill-transparent text-black/10"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="relative mt-3 text-sm text-jackpot-gray leading-relaxed line-clamp-4">
                      {t.review}
                    </p>

                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-1.5 text-xs text-jackpot-gray">
                      <MapPin className="h-3.5 w-3.5 text-jackpot-red shrink-0" />
                      <span>{t.branch} Branch</span>
                      <span aria-hidden>•</span>
                      <span>{t.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating nav buttons — sit outside the carousel/card row */}
          <button
            onClick={scrollPrev}
            aria-label="Previous testimonials"
            className="hidden md:flex absolute top-1/2 -left-4 lg:-left-12 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:bg-jackpot-red hover:text-white transition-colors duration-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next testimonials"
            className="hidden md:flex absolute top-1/2 -right-4 lg:-right-12 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:bg-jackpot-red hover:text-white transition-colors duration-300"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "w-6 bg-jackpot-red"
                  : "w-2 bg-black/10 hover:bg-black/20"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mt-6 flex justify-center"
        >
          {/* Styled to match Button's primary variant exactly; rendered as a
              real <a> (not the Button component) since this opens an
              external link and a <button> can't correctly nest inside one. */}
          <Link
            href={primaryMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-jackpot-red text-white hover:bg-jackpot-red-dark transition-colors px-7 py-3.5 text-base font-semibold"
          >
            <GoogleGIcon className="h-5 w-5" />
            View More Google Reviews
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
