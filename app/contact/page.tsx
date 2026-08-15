import type { Metadata } from "next";
import { Phone, Mail } from "lucide-react";
import { BRAND, BRANCHES_SEED } from "@/lib/constants";
import ContactForm from "@/components/layout/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Support | Jackpot Bangladesh",
  description: "Get in touch with Jackpot Bangladesh for support, complaints, or branch inquiries.",
};

export default function ContactPage() {
  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-12 grid lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-jackpot-black mb-6">Contact & Support</h1>

          <div className="rounded-2xl bg-jackpot-offwhite p-6 mb-6">
            <h2 className="font-bold text-sm uppercase tracking-wide text-jackpot-gray mb-3">Complaint & Support</h2>
            {BRAND.supportPhones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="flex items-center gap-2 font-black text-lg text-jackpot-black mb-1">
                <Phone className="h-4 w-4 text-jackpot-red" /> {p}
              </a>
            ))}
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 mt-2 text-jackpot-gray">
              <Mail className="h-4 w-4 text-jackpot-red" /> {BRAND.email}
            </a>
          </div>

          <div className="rounded-2xl bg-jackpot-offwhite p-6">
            <h2 className="font-bold text-sm uppercase tracking-wide text-jackpot-gray mb-3">Branch Contacts</h2>
            {BRANCHES_SEED.map((b) => (
              <div key={b.slug} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                <span className="font-semibold text-jackpot-black">{b.name}</span>
                <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="text-jackpot-red font-bold">{b.phone}</a>
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
