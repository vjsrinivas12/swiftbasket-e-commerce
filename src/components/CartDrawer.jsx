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
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR, convertToINR } from "../utils/formatters";

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

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
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
        aria-hidden={!open}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 z-[80] h-full w-full sm:max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping Cart Drawer"
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
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-300 stroke-1" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-1">
              Your cart is empty
            </p>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              Explore our grocery aisles and add your daily essentials!
            </p>
          </div>
        ) : (
          <>
            {/* Free Delivery Tracker */}
            <div className="px-5 pt-4 pb-2">
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  {amountToFree > 0 ? (
                    <p className="text-xs font-medium text-emerald-800">
                      Add{" "}
                      <span className="font-bold">
                        {formatINR(amountToFree)}
                      </span>{" "}
                      more for{" "}
                      <span className="font-bold text-emerald-600">
                        FREE delivery
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <PackageCheck className="w-3.5 h-3.5" />
                      You unlocked FREE delivery!
                    </p>
                  )}
                </div>
                <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 scrollbar-hide">
              {items.map((item) => {
                const itemPriceINR = convertToINR(item.price);
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50/70 hover:bg-gray-50 rounded-xl p-3 transition border border-gray-100/60 group/item"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-contain bg-white rounded-lg shrink-0 p-1 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatINR(itemPriceINR)} each
                      </p>

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Stepper */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => decrementQty(item.id)}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800 tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => incrementQty(item.id)}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 tabular-nums">
                            {formatINR(itemPriceINR * item.qty)}
                          </span>
                          <button
                            type="button"
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

            {/* Footer Bill & Actions */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-3.5 bg-white">
              {/* Coupon Bar */}
              {!coupon ? (
                <div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyCoupon()
                        }
                        placeholder="Coupon (e.g. SAVE10)"
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 uppercase tracking-wider"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-sm shadow-emerald-200"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {couponError}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Use code <span className="font-bold text-gray-600">SAVE10</span> for 10% instant discount
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">
                      {coupon.code}
                    </span>
                    <span className="text-xs text-emerald-600">
                      – {coupon.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-medium text-gray-800">
                    {formatINR(itemTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Charge</span>
                  <span className="font-medium text-gray-800">
                    {formatINR(handlingCharge)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="font-medium text-gray-800">
                      {formatINR(deliveryFee)}
                    </span>
                  )}
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>−{formatINR(couponDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-extrabold text-gray-900 text-sm">
                  <span>To Pay</span>
                  <span className="text-emerald-700">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Proceed CTA */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                <span>{formatINR(grandTotal)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* Clear Cart */}
              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-[11px] text-gray-400 hover:text-red-500 transition cursor-pointer py-0.5"
              >
                Clear cart items
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
