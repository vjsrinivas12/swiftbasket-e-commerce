import { useState, useMemo } from "react";
import { SlidersHorizontal, AlertCircle } from "lucide-react";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

const API_URL =
  "https://dummyjson.com/products/category/groceries?limit=30";

const CATEGORIES = [
  "All",
  "Fruits & Vegetables",
  "Dairy & Breakfast",
  "Snacks & Beverages",
  "Staples",
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

/* Simple keyword → category mapping for the dummy data */
function guessCategory(product) {
  const text =
    `${product.title} ${product.description} ${product.tags?.join(" ") || ""}`.toLowerCase();
  if (/fruit|vegetable|lemon|onion|garlic|ginger|potato|tomato|apple|banana|green|chili/i.test(text))
    return "Fruits & Vegetables";
  if (/milk|butter|cheese|cream|egg|yogurt|curd|paneer|bread|breakfast/i.test(text))
    return "Dairy & Breakfast";
  if (/snack|chip|biscuit|cookie|drink|juice|soda|tea|coffee|beverage|chocolate|candy|ice/i.test(text))
    return "Snacks & Beverages";
  return "Staples";
}

export default function Home({ searchQuery }) {
  const { data, loading, error } = useFetch(API_URL);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const products = (data?.products ?? []).filter((p) => {
    const text =
      `${p.title} ${p.description} ${p.category} ${p.tags?.join(" ") || ""}`.toLowerCase();
    return !/\b(meat|beef|chicken|pork|lamb|mutton|steak|sausage)\b/.test(text);
  });

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search filter
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

    // Sort
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
      {/* Hero strip */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl px-6 py-5 mb-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fresh groceries, delivered fast 🚀
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            Get everything you need in just 12 minutes.
          </p>
        </div>
        <span className="bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-2 rounded-full shrink-0">
          🎉 Free delivery on first order!
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Failed to load products — {error}
          </p>
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <>
          <p className="text-sm text-gray-400 mb-4">
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-semibold mb-1">No products found</p>
              <p className="text-sm">
                Try a different search term or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
