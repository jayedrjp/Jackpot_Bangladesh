import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PUBLIC_PRODUCTS } from "@/lib/mock/products";
import ProductDetailClient from "@/components/menu/ProductDetailClient";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PUBLIC_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found | Jackpot Bangladesh" };
  return {
    title: `${product.name} | Jackpot Bangladesh`,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription },
  };
}

export function generateStaticParams() {
  return MOCK_PUBLIC_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  // TODO: replace with await getProductBySlug(slug)
  const product = MOCK_PUBLIC_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    aggregateRating: product.reviewCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.discountPrice ?? product.price,
      availability: product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient product={product} related={MOCK_PUBLIC_PRODUCTS.filter((p) => p.id !== product.id && p.categoryId === product.categoryId)} />
    </>
  );
}
