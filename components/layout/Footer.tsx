import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { BRAND, BRANCHES_SEED } from "@/lib/constants";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

export default function Footer() {
  return (
    <footer className="w-full bg-[#fffaf5] text-gray-900 border-t-2 border-jackpot-red">
      <div className="container-max px-5 lg:px-8 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/images/jackpot_logo.png"
              alt="Jackpot BD Logo"
              width={56}
              height={56}
              className="hidden sm:block h-14 w-14 rounded-full object-cover"
            />

            <span className="font-black text-lg">
              JACKPOT<span className="text-jackpot-red"> BD</span>
            </span>
          </div>

          <p className="text-sm text-gray-600">
            {BRAND.tagline} — big cravings, one Jackpot.
          </p>

          {/* Social icons */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href={BRAND.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jackpot Bangladesh on Facebook"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:scale-110 hover:border-jackpot-red hover:bg-jackpot-red hover:text-white"
            >
              <FacebookIcon className="h-4.5 w-4.5" />
            </a>

            <a
              href="#"
              aria-label="Jackpot Bangladesh on Instagram"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:scale-110 hover:border-jackpot-red hover:bg-jackpot-red hover:text-white"
            >
              <InstagramIcon className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-900">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm text-gray-600">
            {[
              ["Home", "/"],
              ["Menu", "/menu"],
              ["Top Selling", "/top-selling"],
              ["Offers", "/offers"],
              ["Branches", "/branches"],
              ["Track Order", "/track-order"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-jackpot-red transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Branches — compact premium cards */}
        <div>
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-900">
            Branches
          </h3>

          <ul className="space-y-2 text-sm text-gray-600">
            {BRANCHES_SEED.map((b) => (
              <li key={b.slug}>
                <span className="block font-medium text-gray-900">
                  {b.name}
                </span>

                <a
                  href={`tel:${b.phone.replace(/\s/g, "")}`}
                  className="text-gray-600 hover:text-jackpot-red"
                >
                  {b.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-900">
            Support
          </h3>

          <ul className="space-y-2 text-sm text-gray-600">
            {BRAND.supportPhones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-jackpot-red" />
                <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
              </li>
            ))}

            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-jackpot-red" />
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#eadfd6] bg-[#fff7f0] py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Jackpot Bangladesh. All rights reserved.
      </div>
    </footer>
  );
}
