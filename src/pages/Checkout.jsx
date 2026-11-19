import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart, USD_TO_INR } from "../context/CartContext";

/* ── Validation helpers ── */
const validators = {
  fullName: (v) => (v.trim().length >= 2 ? "" : "Name must be at least 2 characters"),
  mobile: (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number"),
  flat: (v) => (v.trim().length >= 1 ? "" : "Required"),
  pincode: (v) => (/^\d{6}$/.test(v) ? "" : "Enter a valid 6-digit pincode"),
};

/* ============================================================
   ORDER CONFIRMED SCREEN (shown after successful submission)
   ============================================================ */
function OrderConfirmed({ orderSummary }) {
  const [secondsLeft, setSecondsLeft] = useState(12 * 60); // 12 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-12 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-[scaleIn_0.4s_ease-out]">
        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        Order Confirmed! 🎉
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Your order has been placed successfully.
      </p>

      {/* Countdown timer */}
      <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Truck className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-800">
            Estimated Delivery
          </span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm min-w-[72px]">
            <span className="text-3xl font-extrabold text-emerald-700 tabular-nums">
              {String(mins).padStart(2, "0")}
            </span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              MINS
            </p>
          </div>
          <span className="text-2xl font-bold text-emerald-400 animate-pulse">
            :
          </span>
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm min-w-[72px]">
            <span className="text-3xl font-extrabold text-emerald-700 tabular-nums">
              {String(secs).padStart(2, "0")}
            </span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              SECS
            </p>
          </div>
        </div>
        {secondsLeft === 0 && (
          <p className="text-sm font-bold text-emerald-700 mt-3">
            🎊 Your order has arrived!
          </p>
        )}
      </div>

      {/* Order summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          Order Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Items ({orderSummary.totalItems})</span>
            <span>₹{orderSummary.itemTotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Handling</span>
            <span>₹{orderSummary.handlingCharge}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>
              {orderSummary.deliveryFee === 0
                ? "FREE"
                : `₹${orderSummary.deliveryFee}`}
            </span>
          </div>
          {orderSummary.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Coupon</span>
              <span>
                −₹{orderSummary.couponDiscount.toLocaleString("en-IN")}
              </span>
            </div>
          )}
          <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
            <span>Total Paid</span>
            <span>₹{orderSummary.grandTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <p>
            <span className="font-medium text-gray-700">Delivering to:</span>{" "}
            {orderSummary.address.fullName}, {orderSummary.address.flat},{" "}
            {orderSummary.address.pincode}
          </p>
          <p className="mt-0.5">
            <span className="font-medium text-gray-700">Payment:</span>{" "}
            {orderSummary.address.payment === "upi"
              ? "UPI"
              : "Cash on Delivery"}
          </p>
        </div>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-emerald-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>
    </main>
  );
}

/* ============================================================
   CHECKOUT PAGE
   ============================================================ */
export default function Checkout() {
  const navigate = useNavigate();
  const {
    items,
    totalItems,
    itemTotal,
    deliveryFee,
    handlingCharge,
    couponDiscount,
    grandTotal,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    flat: "",
    pincode: "",
    payment: "upi",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [orderSummary, setOrderSummary] = useState(null);

  // Redirect to home if cart is empty and no order placed
  useEffect(() => {
    if (items.length === 0 && !orderSummary) {
      navigate("/", { replace: true });
    }
  }, [items.length, orderSummary, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Live validation if already touched
    if (touched[field] && validators[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validators[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](form[field]),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    for (const field of Object.keys(validators)) {
      const msg = validators[field](form[field]);
      if (msg) newErrors[field] = msg;
    }
    setErrors(newErrors);
    setTouched({ fullName: true, mobile: true, flat: true, pincode: true });

    if (Object.values(newErrors).some(Boolean)) return;

    // Save summary before clearing
    setOrderSummary({
      totalItems,
      itemTotal,
      deliveryFee,
      handlingCharge,
      couponDiscount,
      grandTotal,
      address: { ...form },
    });
    clearCart();
  };

  // Show confirmed screen
  if (orderSummary) {
    return <OrderConfirmed orderSummary={orderSummary} />;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 font-medium mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to store
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* ── Delivery address form ── */}
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="lg:col-span-3 space-y-5"
          noValidate
        >
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            Delivery Address
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="John Doe"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.fullName && touched.fullName
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-emerald-500/40 focus:border-emerald-400"
              }`}
            />
            {errors.fullName && touched.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={form.mobile}
                onChange={(e) =>
                  handleChange("mobile", e.target.value.replace(/\D/g, ""))
                }
                onBlur={() => handleBlur("mobile")}
                placeholder="9876543210"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                  errors.mobile && touched.mobile
                    ? "border-red-300 focus:ring-red-300"
                    : "border-gray-200 focus:ring-emerald-500/40 focus:border-emerald-400"
                }`}
              />
            </div>
            {errors.mobile && touched.mobile && (
              <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Flat / House */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flat / House No. / Address
            </label>
            <input
              type="text"
              value={form.flat}
              onChange={(e) => handleChange("flat", e.target.value)}
              onBlur={() => handleBlur("flat")}
              placeholder="Flat 401, Tower B, Green Residency"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.flat && touched.flat
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-emerald-500/40 focus:border-emerald-400"
              }`}
            />
            {errors.flat && touched.flat && (
              <p className="text-xs text-red-500 mt-1">{errors.flat}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              maxLength={6}
              value={form.pincode}
              onChange={(e) =>
                handleChange("pincode", e.target.value.replace(/\D/g, ""))
              }
              onBlur={() => handleBlur("pincode")}
              placeholder="400001"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.pincode && touched.pincode
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-emerald-500/40 focus:border-emerald-400"
              }`}
            />
            {errors.pincode && touched.pincode && (
              <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
            )}
          </div>

          {/* Payment method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange("payment", "upi")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition cursor-pointer ${
                  form.payment === "upi"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                UPI
              </button>
              <button
                type="button"
                onClick={() => handleChange("payment", "cod")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition cursor-pointer ${
                  form.payment === "cod"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Banknote className="w-4 h-4" />
                Cash on Delivery
              </button>
            </div>
          </div>

          {/* Submit (visible on mobile, hidden on desktop — desktop uses the sidebar CTA) */}
          <button
            type="submit"
            className="w-full lg:hidden bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-200"
          >
            Place Order — ₹{grandTotal.toLocaleString("en-IN")}
          </button>
        </form>

        {/* ── Order summary sidebar ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Order Summary
            </h3>

            {/* Items preview */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
              {items.map((item) => {
                const pINR = Math.round(item.price * USD_TO_INR);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-10 h-10 object-contain bg-gray-50 rounded-lg shrink-0"
                    />
                    <span className="flex-1 truncate text-gray-700">
                      {item.title}
                    </span>
                    <span className="text-gray-400 text-xs">×{item.qty}</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      ₹{(pINR * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bill */}
            <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span>₹{itemTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Handling</span>
                <span>₹{handlingCharge}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-medium">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon</span>
                  <span>−₹{couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Desktop CTA — submits the form via form id */}
            <button
              type="submit"
              form="checkout-form"
              onClick={(e) => {
                // Programmatically submit the form
                e.preventDefault();
                document
                  .querySelector("form")
                  ?.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  );
              }}
              className="hidden lg:block w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-200"
            >
              Place Order — ₹{grandTotal.toLocaleString("en-IN")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
