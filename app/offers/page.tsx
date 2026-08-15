import type { Metadata } from "next";
import Image from "next/image";
import { placeholderFoodImage } from "@/lib/utils/placeholderImage";

export const metadata: Metadata = {
  title: "Offers | Jackpot Bangladesh",
  description: "Current promotions and discounts at Jackpot Bangladesh.",
};

// TODO: replace with await getActiveOffers() — that service already filters
// out anything past its validTo date, so expired offers never render here.
export default function OffersPage() {
  const offers: { id: string; title: string; description: string; discountLabel: string; photoTag: string }[] = [];

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-14">
        <h1 className="text-3xl sm:text-4xl font-black text-jackpot-black mb-2">Offers</h1>
        <p className="text-jackpot-gray mb-10">Current promotions running across all Jackpot branches.</p>

        {offers.length === 0 ? (
          <p className="text-center text-jackpot-gray py-16">No active offers right now — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o) => (
              <div key={o.id} className="rounded-2xl border border-black/5 overflow-hidden">
                <div className="relative h-40">
                  <Image src={placeholderFoodImage(o.photoTag, 500, 320)} alt={o.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <span className="inline-block rounded-full bg-jackpot-red px-3 py-1 text-xs font-bold text-white mb-2">{o.discountLabel}</span>
                  <h3 className="font-bold text-jackpot-black">{o.title}</h3>
                  <p className="text-sm text-jackpot-gray mt-1">{o.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
