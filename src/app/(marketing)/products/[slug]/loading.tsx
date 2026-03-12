import { ProductDetailSkeleton } from "@/components/shared/product-card";
import { Navbar } from "@/components/shared/navbar";

export default function ProductLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen container mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </main>
    </>
  );
}
