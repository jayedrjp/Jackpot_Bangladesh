import type { Metadata } from "next";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { BRANCHES_SEED } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Branches | Jackpot Bangladesh",
  description:
    "Find your nearest Jackpot Bangladesh branch — Staff Quarter, Konapara and Shonir-Akhra.",
};

export default function BranchesPage() {
  return (
    <section className="w-full" style={{ backgroundColor: "#FFFBF5" }}>
      <div className="container-max px-5 lg:px-8 py-16 sm:py-20">
        {/* Two-column editorial header */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-end mb-14">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-jackpot-red uppercase mb-3">
              Our Branches
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-jackpot-black tracking-tight leading-[1.05]">
              Always Near You.
            </h1>
          </div>
          <p className="text-jackpot-gray text-base sm:text-lg lg:pb-1.5">
            Visit your nearest branch and enjoy fresh food with a warm welcome.
          </p>
        </div>

        {/* Branch grid */}
        <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
          {BRANCHES_SEED.map((b, i) => (
            <div
              key={b.slug}
              className="group relative overflow-hidden rounded-[28px] bg-white border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-8 sm:p-9 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_44px_rgba(0,0,0,0.1)]"
            >
              {/* Decorative number */}
              <span
                aria-hidden
                className="pointer-events-none select-none absolute -top-4 right-4 text-[120px] font-black leading-none text-jackpot-black"
                style={{ opacity: 0.06 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-jackpot-red/10 mb-5 transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="h-5.5 w-5.5 text-jackpot-red" />
                </div>

                <h2 className="text-xl font-black text-jackpot-black">
                  {b.name
                    .replace("Jackpot Bangladesh ", "")
                    .replace(/[()]/g, "")}
                </h2>

                <div className="mt-5 space-y-3 text-sm text-jackpot-gray">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-jackpot-red mt-0.5 shrink-0" />
                    <span>Banasree - Staff Quarter, Demra Rd, Dhaka</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-jackpot-red shrink-0" />
                    <a
                      href={`tel:${b.phone.replace(/\s/g, "")}`}
                      className="hover:text-jackpot-red transition-colors"
                    >
                      {b.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-jackpot-red shrink-0" />
                    <span>
                      {b.openingHours ?? "Open Daily: 3:00 PM – 11:00 PM"}
                    </span>
                  </p>
                </div>

                <a
                  href={b.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-jackpot-black group-hover:text-jackpot-red transition-colors"
                >
                  View on Google Maps
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
