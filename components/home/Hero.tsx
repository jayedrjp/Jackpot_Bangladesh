import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-jackpot-black">
      {/* Hero Image */}
      <div className="relative w-full min-h-[640px] sm:min-h-[680px] lg:min-h-0 lg:aspect-[1920/828]">
        <Image
          src="/images/hero/hero.png"
          alt="Signature Jackpot burger"
          fill
          priority
          sizes="100vw"
          className="object-cover lg:object-fill"
        />

        {/* Left Dark Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0) 85%)",
          }}
        />

        {/* Extra Desktop Overlay */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0.08) 52%, rgba(0,0,0,0) 68%)",
          }}
        />

        {/* Mobile-only bottom fade so wrapped text/buttons near the base of
            the hero stay legible over the image on small screens. Desktop
            (lg+) is untouched. */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent lg:hidden pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 z-10">
          <div className="container-max h-full px-5 sm:px-8 lg:px-12">
            <div className="flex h-full items-center">
              {/* LEFT CONTENT */}
              <div className="w-full lg:w-[58%] xl:w-[56%] max-w-[850px]">
                {/* Heading */}
                <h1
                  className="
                    text-white
                    font-bold
                    leading-[1]
                    tracking-[-0.03em]
                    text-4xl
                    sm:text-5xl
                    lg:text-6xl
                    xl:text-7xl
                    drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]
                  "
                >
                  {/* Line 1 */}
                  <span className="block whitespace-nowrap">
                    Where Every Bite
                  </span>

                  {/* Line 2 */}
                  <span className="block whitespace-nowrap">
                    Feels Like{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 text-jackpot-red">
                        Jackpot
                      </span>

                      <svg
                        viewBox="0 0 260 110"
                        className="
      pointer-events-none
      absolute
      -left-[7%]
      top-[-9%]
      w-[114%]
      h-[135%]
    "
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="
        M 36 68
        C 18 52, 22 26, 52 18
        C 82 6, 130 2, 168 8
        C 206 14, 238 26, 246 46
        C 254 66, 236 86, 202 94
        C 166 103, 112 105, 76 96
        C 46 88, 22 78, 30 62
      "
                          fill="none"
                          stroke="rgba(255,255,255,0.65)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M 96 10 C 118 2, 142 4, 160 12"
                          fill="none"
                          stroke="rgba(255,255,255,0.65)"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </span>
                </h1>

                {/* Description */}
                <p
                  className="
                    mt-5
                    sm:mt-6
                    text-white/85
                    text-base
                    sm:text-lg
                    leading-relaxed
                    max-w-[600px]
                    font-normal
                  "
                >
                  Quality burgers, crispy chicken, wings and drums — made fresh
                  <br className="hidden sm:block" />
                  and delivered fast across Dhaka.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col min-[420px]:flex-row flex-wrap gap-3 sm:gap-4">
                  <Link
                    href="/menu"
                    className="
                      rounded-full
                      bg-jackpot-red
                      px-7
                      sm:px-8
                      py-3.5
                      sm:py-4
                      font-semibold
                      text-white
                      hover:bg-jackpot-red-dark
                      transition-colors
                      shadow-lg
                      shadow-black/20
                    "
                  >
                    Order Now
                  </Link>

                  <Link
                    href="/menu"
                    className="
                      rounded-full
                      border-2
                      border-white/40
                      px-7
                      sm:px-8
                      py-3.5
                      sm:py-4
                      font-semibold
                      text-white
                      hover:bg-white/10
                      transition-colors
                      backdrop-blur-sm
                    "
                  >
                    Explore Menu
                  </Link>
                </div>

                {/* Social Proof - BELOW CTA */}
                <div className="mt-5 flex items-center gap-3">
                  {/* Customer Avatars */}
                  <div className="flex -space-x-3">
                    <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-black/80">
                      <Image
                        src="/images/avatars/1.png"
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>

                    <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-black/80">
                      <Image
                        src="/images/avatars/2.png"
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>

                    <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-black/80">
                      <Image
                        src="/images/avatars/3.png"
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>

                    <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-black/80">
                      <Image
                        src="/images/avatars/4.png"
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>

                    <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-black/80">
                      <Image
                        src="/images/avatars/5.png"
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>
                  </div>

                  {/* Customer Text */}
                  <span
                    className="
                      text-sm
                      font-semibold
                      text-white/80
                    "
                  >
                    50K+ Happy Customers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
