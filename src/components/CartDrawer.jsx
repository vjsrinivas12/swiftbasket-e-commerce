import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Truck,
  Tag,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";
import { useCart, USD_TO_INR } from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const {
    items,
    coupon,
    couponError,
    totalItems,
    itemTotal,
    deliveryFee,
    handlingCharge,
    couponDiscount,
    grandTotal,
    freeDeliveryThreshold,
    incrementQty,
    decrementQty,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const navigate = useNavigate();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const amountToFree = Math.max(0, freeDeliveryThreshold - itemTotal);
  const progressPercent = Math.min(
    100,
    (itemTotal / freeDeliveryThreshold) * 100
  );

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <ShoppingBag className="w-16 h-16 mb-4 stroke-1" />
            <p className="text-lg font-semibold mb-1">Your cart is empty</p>
            <p className="text-sm">Add items to get started!</p>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="px-5 pt-4 pb-3">
              <div className="bg-emerald-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  {amountToFree > 0 ? (
                    <p className="text-xs font-medium text-emerald-800">
                      Add{" "}
                      <span className="font-bold">
                        ₹{amountToFree.toLocaleString("en-IN")}
                      </span>{" "}
                      more for{" "}
                      <span className="font-bold text-emerald-600">
                        FREE delivery
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <PackageCheck className="w-3.5 h-3.5" />
                      You get FREE delivery!
                    </p>
                  )}
                </div>
                <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3 scrollbar-hide">
              {items.map((item) => {
                const priceINR = Math.round(item.price * USD_TO_INR);
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50 rounded-xl p-3 group/item"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-contain bg-white rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        ₹{priceINR} each
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => decrementQty(item.id)}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-bold text-gray-800 tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => incrementQty(item.id)}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Line total + delete */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{(priceINR * item.qty).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-300 hover:text-red-500 transition opacity-0 group-hover/item:opacity-100 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer — Coupon + Bill Summary */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-white">
              {/* Coupon */}
              {!coupon ? (
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 uppercase tracking-wider"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 mt-1.5 ml-6">
                      {couponError}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1 ml-6">
                    Try <span className="font-semibold">SAVE10</span> for 10%
                    off
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                      {coupon.code}
                    </span>
                    <span className="text-xs text-emerald-600">
                      – {coupon.label}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Bill summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span>₹{itemTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Handling Charge</span>
                  <span>₹{handlingCharge}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-medium">FREE</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span>−₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-200"
              >
                Proceed to Checkout — ₹{grandTotal.toLocaleString("en-IN")}
              </button>

              {/* Clear */}
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition cursor-pointer py-1"
              >
                Clear entire cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
