import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { BRANCHES_SEED } from "@/lib/constants";

export default function BranchPreview() {
  return (
    <section className="w-full" style={{ backgroundColor: "#FFFBF5" }}>
      <div className="container-max px-5 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-jackpot-red uppercase mb-3">
            Our Branches
          </span>

          <h2 className="text-4xl sm:text-5xl font-black text-jackpot-black tracking-tight leading-[1.05]">
            Always Near You
          </h2>
        </div>

        {/* 3 Cards in One Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {BRANCHES_SEED.map((b, i) => (
            <div
              key={b.slug}
              className="group relative overflow-hidden rounded-[20px] bg-white border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.09)]"
            >
              {/* Decorative number */}
              <span
                aria-hidden
                className="pointer-events-none select-none absolute -top-2 right-2 text-[80px] font-black leading-none text-jackpot-black"
                style={{ opacity: 0.05 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative">
                {/* Icon */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-jackpot-red/10 mb-3 transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="h-4.5 w-4.5 text-jackpot-red" />
                </div>

                {/* Branch Name */}
                <h3 className="text-lg font-black text-jackpot-black leading-tight">
                  {b.name
                    .replace("Jackpot Bangladesh ", "")
                    .replace(/[()]/g, "")}
                </h3>

                {/* Details */}
                <div className="mt-3 space-y-2 text-xs sm:text-sm text-jackpot-gray">
                  <p className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-jackpot-red mt-0.5 shrink-0" />

                    <span>Banasree - Staff Quarter, Demra Rd, Dhaka</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-jackpot-red shrink-0" />

                    <a
                      href={`tel:${b.phone.replace(/\s/g, "")}`}
                      className="hover:text-jackpot-red transition-colors"
                    >
                      {b.phone}
                    </a>
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-jackpot-red shrink-0" />

                    <span>
                      {b.openingHours ?? "Open Daily: 3:00 PM – 11:00 PM"}
                    </span>
                  </p>
                </div>

                {/* Google Maps */}
                <a
                  href={b.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-jackpot-black group-hover:text-jackpot-red transition-colors"
                >
                  View on Google Maps
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
