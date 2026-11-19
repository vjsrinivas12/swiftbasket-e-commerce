import { useState, useMemo } from "react";
import { SlidersHorizontal, AlertCircle, Sparkles } from "lucide-react";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import {
  API_GROCERIES_URL,
  CATEGORIES,
  SORT_OPTIONS,
} from "../utils/constants";
import { guessCategory } from "../utils/helpers";

export default function Home({ searchQuery }) {
  const { data, loading, error } = useFetch(API_GROCERIES_URL);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Filter out meat products as requested
  const products = useMemo(() => {
    return (data?.products ?? []).filter((p) => {
      const text = `${p.title} ${p.description} ${p.category} ${
        p.tags?.join(" ") || ""
      }`.toLowerCase();
      return !/\b(meat|beef|chicken|pork|lamb|mutton|steak|sausage)\b/.test(
        text
      );
    });
  }, [data]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (activeCategory !== "All") {
      list = list.filter((p) => guessCategory(p) === activeCategory);
    }

    // Sorting
    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return list;
  }, [products, searchQuery, activeCategory, sortBy]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Strip */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-xl shadow-emerald-600/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              12-Minute Superfast Delivery
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Fresh farm groceries, straight to your door.
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2">
              Order fresh fruits, vegetables, dairy, and daily essentials with zero hassle.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center md:text-right shrink-0">
            <span className="block text-2xl font-black text-amber-300">
              FREE
            </span>
            <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
              Delivery on orders over ₹499
            </span>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* Filter and Sort Toolbar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 shadow-2xs cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 shadow-2xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Failed to load groceries</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm font-medium text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
            {searchQuery && (
              <p className="text-xs text-emerald-600 font-medium">
                Filtered by: &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-gray-100 shadow-2xs">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-50 rounded-full flex items-center justify-center">
                <SlidersHorizontal className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                No groceries matched your search
              </p>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
                Try searching with a different term or clearing your active category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
