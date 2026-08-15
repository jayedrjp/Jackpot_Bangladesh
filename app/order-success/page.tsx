"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-jackpot-red mx-auto mb-4" />
        <h1 className="text-2xl font-black text-jackpot-black">Order confirmed</h1>
        {orderId && <p className="mt-2 text-jackpot-gray">Order ID: <span className="font-bold text-jackpot-black">{orderId}</span></p>}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={`/track-order${orderId ? `?orderId=${orderId}` : ""}`} className="rounded-full bg-jackpot-red px-8 py-3.5 font-bold text-white hover:bg-jackpot-red-dark">
            Track Order
          </Link>
          <Link href="/menu" className="rounded-full border-2 border-jackpot-black px-8 py-3.5 font-bold hover:bg-jackpot-black hover:text-white">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
