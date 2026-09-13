"use client";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
} from "lucide-react";
import ProductCard from "../productCard/productCard"
import { CustomProductType } from "@/types/cProductType";

type MyCreationsProps = {
  products: CustomProductType[];
  isLoading?: boolean;
};

export function MyCreations({
  products,
  isLoading = false,
}: MyCreationsProps) {
  console.log("MyCreations products:", products);
  const router = useRouter();

  return (
    <section className="mt-8 border-t pt-10">
      {/* =========================
          HEADER
      ========================== */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            My Creations
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your custom products
          </p>
        </div>

        {products.length > 4 && (
          <button
            type="button"
            className="group flex items-center gap-1 text-sm font-semibold"
            onClick={() =>
              router.push("/customs/creations")
            }
          >
            View All

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        )}
      </div>

      {/* =========================
          LOADING STATE
      ========================== */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border bg-white animate-pulse"
            >
              {/* Image skeleton */}
              <div className="aspect-square bg-zinc-100" />

              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-5 w-32 rounded bg-zinc-100" />

                <div className="h-4 w-44 rounded bg-zinc-100" />

                <div className="h-3 w-24 rounded bg-zinc-100" />

                <div className="h-9 w-full rounded-xl bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          EMPTY STATE
      ========================== */}
      {!isLoading && products.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-zinc-50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border bg-white">
            ✨
          </div>

          <h3 className="text-lg font-semibold">
            No creations yet
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Generate your first design and it will
            appear here.
          </p>
        </div>
      )}

      {/* =========================
          PRODUCTS
      ========================== */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}