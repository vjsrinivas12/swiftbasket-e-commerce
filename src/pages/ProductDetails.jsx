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
import { useCart } from "../context/CartContext";
import { API_PRODUCTS_BASE_URL } from "../utils/constants";
import {
  formatINR,
  convertToINR,
  calculateOriginalPrice,
} from "../utils/formatters";

export default function ProductDetails() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`${API_PRODUCTS_BASE_URL}/${id}`);
  const { items, addToCart, incrementQty, decrementQty } = useCart();

  const [selectedImg, setSelectedImg] = useState("");

  useEffect(() => {
    if (data?.thumbnail) {
      setSelectedImg(data.images?.[0] || data.thumbnail);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
        <div className="h-5 w-28 bg-gray-200 rounded-full mb-8" />
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-gray-200 rounded-3xl h-80 sm:h-96 md:h-[420px]" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded-full" />
            <div className="h-8 w-3/4 bg-gray-200 rounded-full" />
            <div className="h-4 w-full bg-gray-200 rounded-full" />
            <div className="h-4 w-5/6 bg-gray-200 rounded-full" />
            <div className="h-12 w-48 bg-gray-200 rounded-2xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-red-500 font-bold mb-4">
          {error || "Product could not be found"}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to SwiftBasket store
        </Link>
      </div>
    );
  }

  const product = data;
  const priceINR = convertToINR(product.price);
  const originalINR = calculateOriginalPrice(
    priceINR,
    product.discountPercentage
  );
  const inCart = items.find((i) => i.id === product.id);
  const inStock = product.stock > 0;
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back to Catalog Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-emerald-600 font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Groceries
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Gallery Section */}
        <div className="space-y-3.5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 flex items-center justify-center min-h-[300px] sm:min-h-[380px] border border-gray-100 shadow-sm overflow-hidden">
            <img
              src={selectedImg || images[0]}
              alt={product.title}
              className="max-h-[300px] sm:max-h-[360px] w-auto object-contain transition-all duration-300"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImg(img)}
                  className={`w-18 h-18 sm:w-20 sm:h-20 bg-white rounded-2xl border p-1.5 shrink-0 cursor-pointer transition-all ${
                    (selectedImg || images[0]) === img
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
            {product.brand || product.category}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
            {product.title}
          </h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-900">
                {product.rating}
              </span>
            </div>
            {product.reviews?.length > 0 && (
              <span className="text-xs text-gray-400 font-medium">
                ({product.reviews.length} verified review
                {product.reviews.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-extrabold text-gray-900">
              {formatINR(priceINR)}
            </span>
            {originalINR && (
              <span className="text-base text-gray-400 line-through">
                {formatINR(originalINR)}
              </span>
            )}
            {product.discountPercentage > 5 && (
              <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2 py-0.5 rounded-full">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Highlights & Badges */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-6">
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
              <Package
                className={`w-4 h-4 shrink-0 ${
                  inStock ? "text-emerald-600" : "text-red-500"
                }`}
              />
              <span
                className={`text-xs font-semibold truncate ${
                  inStock ? "text-emerald-800" : "text-red-600"
                }`}
              >
                {inStock ? `In Stock (${product.stock} units)` : "Out of Stock"}
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-gray-700 truncate">
                Delivery in 12 min
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-gray-700 truncate">
                Free above ₹499
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-gray-700 truncate">
                {product.warrantyInformation || "Freshness Guarantee"}
              </span>
            </div>
          </div>

          {/* Cart Stepper Action */}
          {inStock && (
            <div className="mb-8">
              {!inCart ? (
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart • {formatINR(priceINR)}
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-emerald-600 rounded-2xl overflow-hidden shadow-md">
                    <button
                      type="button"
                      onClick={() => decrementQty(product.id)}
                      className="p-3 hover:bg-emerald-700 text-white transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 text-base font-bold text-white tabular-nums">
                      {inCart.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementQty(product.id)}
                      className="p-3 hover:bg-emerald-700 text-white transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Total: {formatINR(priceINR * inCart.qty)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Customer Reviews Section */}
          {product.reviews?.length > 0 && (
            <section className="border-t border-gray-100 pt-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Customer Reviews &amp; Ratings
              </h2>
              <div className="space-y-3">
                {product.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-800">
                        {review.reviewerName}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-gray-700">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                      {new Date(review.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
