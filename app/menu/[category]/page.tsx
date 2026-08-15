import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/menu/ProductGrid";
import { MOCK_PUBLIC_PRODUCTS, MENU_CATEGORIES } from "@/lib/mock/products";

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = MENU_CATEGORIES.find((c) => c.slug === slug);
  const name = category?.name ?? slug;
  return {
    title: `${name} | Jackpot Bangladesh`,
    description: `Order ${name.toLowerCase()} from Jackpot Bangladesh.`,
  };
}

export function generateStaticParams() {
  return MENU_CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: slug } = await params;
  const category = MENU_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  // TODO: replace with await getProductsByCategory(category.id)
  const products = MOCK_PUBLIC_PRODUCTS.filter((p) => p.categoryId === category.id && p.isAvailable);

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-black text-jackpot-black mb-2">{category.name}</h1>
        <p className="text-jackpot-gray mb-8">Fresh {category.name.toLowerCase()}, made to order.</p>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
