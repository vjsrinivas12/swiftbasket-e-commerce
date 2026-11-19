import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  Clock,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import useFetch from "../hooks/useFetch";
import { useCart, USD_TO_INR } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(
    `https://dummyjson.com/products/${id}`
  );
  const { items, addToCart, incrementQty, decrementQty } = useCart();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
        <div className="h-5 w-28 bg-gray-200 rounded-full mb-8" />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-2xl h-80 md:h-[420px]" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded-full" />
            <div className="h-7 w-3/4 bg-gray-200 rounded-full" />
            <div className="h-4 w-full bg-gray-200 rounded-full" />
            <div className="h-4 w-5/6 bg-gray-200 rounded-full" />
            <div className="h-10 w-32 bg-gray-200 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-red-500 font-semibold mb-4">
          {error || "Product not found"}
        </p>
        <Link
          to="/"
          className="text-emerald-600 hover:underline text-sm font-medium"
        >
          ← Back to store
        </Link>
      </div>
    );
  }

  const product = data;
  const priceINR = Math.round(product.price * USD_TO_INR);
  const originalINR = product.discountPercentage
    ? Math.round(priceINR / (1 - product.discountPercentage / 100))
    : null;
  const inCart = items.find((i) => i.id === product.id);
  const inStock = product.stock > 0;
  const images = product.images?.length ? product.images : [product.thumbnail];
  const [selectedImg, setSelectedImg] = useState(images[0]);

  useEffect(() => {
    if (images.length) setSelectedImg(images[0]);
  }, [product.id]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 font-medium mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to store
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* ── Image gallery ── */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center min-h-[320px] md:min-h-[420px]">
            <img
              src={selectedImg || images[0]}
              alt={product.title}
              className="max-h-[360px] object-contain transition-all duration-200"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 bg-gray-50 rounded-xl border p-1.5 shrink-0 cursor-pointer transition ${
                    (selectedImg || images[0]) === img
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
            {product.brand || product.category}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-gray-800">
                {product.rating}
              </span>
            </div>
            {product.reviews?.length > 0 && (
              <span className="text-sm text-gray-400">
                ({product.reviews.length} review
                {product.reviews.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-extrabold text-gray-900">
              ₹{priceINR.toLocaleString("en-IN")}
            </span>
            {originalINR && (
              <span className="text-lg text-gray-400 line-through">
                ₹{originalINR.toLocaleString("en-IN")}
              </span>
            )}
            {product.discountPercentage > 5 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Info pills */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <Package
                className={`w-4 h-4 ${inStock ? "text-emerald-600" : "text-red-500"}`}
              />
              <span
                className={`text-xs font-semibold ${inStock ? "text-emerald-700" : "text-red-600"}`}
              >
                {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-gray-700">
                Delivery in 12 min
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-gray-700">
                Free above ₹499
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-gray-700">
                {product.warrantyInformation || "Quality Assured"}
              </span>
            </div>
          </div>

          {/* Cart stepper */}
          {inStock && (
            <div className="mb-8">
              {!inCart ? (
                <button
                  onClick={() => addToCart(product)}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart — ₹{priceINR.toLocaleString("en-IN")}
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-emerald-600 rounded-xl overflow-hidden shadow-md">
                    <button
                      onClick={() => decrementQty(product.id)}
                      className="p-3 hover:bg-emerald-700 text-white transition cursor-pointer"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-5 text-lg font-bold text-white tabular-nums">
                      {inCart.qty}
                    </span>
                    <button
                      onClick={() => incrementQty(product.id)}
                      className="p-3 hover:bg-emerald-700 text-white transition cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    ₹{(priceINR * inCart.qty).toLocaleString("en-IN")} total
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Customer Reviews
              </h2>
              <div className="space-y-3">
                {product.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {review.reviewerName}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-gray-600">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      {new Date(review.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
