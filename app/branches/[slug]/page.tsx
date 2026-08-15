import { notFound } from "next/navigation";
import { Phone, MapPin, Navigation } from "lucide-react";
import { BRANCHES_SEED } from "@/lib/constants";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const branch = BRANCHES_SEED.find((b) => b.slug === slug);
  return { title: branch ? `${branch.name} | Jackpot Bangladesh` : "Branch Not Found" };
}

export function generateStaticParams() {
  return BRANCHES_SEED.map((b) => ({ slug: b.slug }));
}

export default async function BranchDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const branch = BRANCHES_SEED.find((b) => b.slug === slug);
  if (!branch) notFound();

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-14 max-w-2xl">
        <h1 className="text-3xl font-black text-jackpot-black mb-6">{branch.name}</h1>
        <div className="rounded-2xl bg-jackpot-offwhite p-6 space-y-3 text-sm">
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-jackpot-red" /> {branch.phone}</p>
          <p className="flex items-center gap-2 text-jackpot-gray"><MapPin className="h-4 w-4 text-jackpot-red" /> Address pending confirmation from Google Business listing</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="rounded-full bg-jackpot-black text-white px-6 py-3 font-bold text-sm hover:bg-black/80">
            Call Branch
          </a>
          <a href={branch.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-jackpot-red text-white px-6 py-3 font-bold text-sm hover:bg-jackpot-red-dark">
            <Navigation className="h-4 w-4" /> Get Directions
          </a>
          <a href="/menu" className="rounded-full border-2 border-jackpot-black px-6 py-3 font-bold text-sm hover:bg-jackpot-black hover:text-white">
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
}
