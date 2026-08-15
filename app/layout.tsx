import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { BranchProvider } from "@/context/BranchContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import CartDrawer from "@/components/cart/CartDrawer";
import MobileTopNav from "@/components/layout/MobileTopNav";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "Jackpot Bangladesh | Quality Burger",
  description:
    "Order burgers, wings, drums, crispy chicken and more from Jackpot Bangladesh. Fast delivery and pickup from Staff Quarter, Konapara and Shonir-Akhra.",
  metadataBase: new URL("https://jackpotbangladesh.com"),
  openGraph: {
    title: "Jackpot Bangladesh | Quality Burger",
    description:
      "Big cravings, one Jackpot. Order online for delivery or pickup.",
    siteName: "Jackpot Bangladesh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-jackpot-black font-sans">
        <AuthProvider>
          <BranchProvider>
            <CartProvider>
              <ToastProvider>
                {/* Desktop navigation — unchanged, now desktop-only. Mobile
                    gets the new floating top nav instead. */}
                <div className="hidden lg:block">
                  <Navbar />
                </div>
                <MobileTopNav />

                <main className="flex-1">{children}</main>

                <Footer />

                {/* Mobile-only floating bottom nav (also reserves the
                    space it needs so it never overlaps footer content). */}
                <MobileBottomNav />

                <CartDrawer />
              </ToastProvider>
            </CartProvider>
          </BranchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
