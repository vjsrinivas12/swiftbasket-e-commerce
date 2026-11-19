import { Plus, Minus, Star } from "lucide-react";
import { useCart, USD_TO_INR } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { items, addToCart, incrementQty, decrementQty } = useCart();
  const inCart = items.find((i) => i.id === product.id);
  const priceINR = Math.round(product.price * USD_TO_INR);
  const originalINR = product.discountPercentage
    ? Math.round(priceINR / (1 - product.discountPercentage / 100))
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative bg-gray-50 p-4 flex items-center justify-center h-44 sm:h-48 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPercentage > 5 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
          {product.brand || product.category}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-gray-600">
            {product.rating}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          {/* Price */}
          <div>
            <span className="text-lg font-bold text-gray-900">₹{priceINR}</span>
            {originalINR && (
              <span className="ml-1.5 text-xs text-gray-400 line-through">
                ₹{originalINR}
              </span>
            )}
          </div>

          {/* ADD button ↔ Qty stepper with smooth transition */}
          <div className="relative h-8 min-w-[72px] flex items-center justify-end">
            {!inCart ? (
              <button
                onClick={() => addToCart(product)}
                className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer animate-[fadeIn_0.15s_ease-out]"
              >
                <Plus className="w-3.5 h-3.5" />
                ADD
              </button>
            ) : (
              <div className="flex items-center bg-emerald-600 rounded-lg overflow-hidden shadow-md animate-[scaleIn_0.2s_ease-out]">
                <button
                  onClick={() => decrementQty(product.id)}
                  className="p-1.5 hover:bg-emerald-700 text-white transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 text-sm font-bold text-white min-w-[24px] text-center tabular-nums">
                  {inCart.qty}
                </span>
                <button
                  onClick={() => incrementQty(product.id)}
                  className="p-1.5 hover:bg-emerald-700 text-white transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
