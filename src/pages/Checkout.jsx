import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import OrderConfirmed from "../components/OrderConfirmed";
import { addressValidators } from "../utils/validators";
import { formatINR, convertToINR } from "../utils/formatters";

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

  // Redirect to store catalog if cart is empty and no active order
  useEffect(() => {
    if (items.length === 0 && !orderSummary) {
      navigate("/", { replace: true });
    }
  }, [items.length, orderSummary, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field] && addressValidators[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: addressValidators[field](value),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (addressValidators[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: addressValidators[field](form[field]),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate entire form
    const validationErrors = {};
    for (const field of Object.keys(addressValidators)) {
      const msg = addressValidators[field](form[field]);
      if (msg) validationErrors[field] = msg;
    }

    setErrors(validationErrors);
    setTouched({
      fullName: true,
      mobile: true,
      flat: true,
      pincode: true,
    });

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    // Capture receipt details before emptying cart
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

  // Render Confirmation Screen upon completion
  if (orderSummary) {
    return <OrderConfirmed orderSummary={orderSummary} />;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-emerald-600 font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Groceries
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Complete your delivery details to receive your basket in 12 minutes.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <ShieldCheck className="w-4 h-4" />
          Safe &amp; Secure Checkout
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Delivery Form */}
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="lg:col-span-3 space-y-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          noValidate
        >
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Truck className="w-4 h-4 text-emerald-600" />
            Delivery Address
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="e.g. Rahul Sharma"
              className={`w-full px-4 py-2.5 bg-gray-50/70 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.fullName && touched.fullName
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-200 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white"
              }`}
            />
            {errors.fullName && touched.fullName && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
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
                className={`w-full pl-12 pr-4 py-2.5 bg-gray-50/70 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                  errors.mobile && touched.mobile
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white"
                }`}
              />
            </div>
            {errors.mobile && touched.mobile && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Flat / House Details */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Flat, House No., Building, Street *
            </label>
            <input
              type="text"
              value={form.flat}
              onChange={(e) => handleChange("flat", e.target.value)}
              onBlur={() => handleBlur("flat")}
              placeholder="e.g. Flat 302, Palm Heights, Main Street"
              className={`w-full px-4 py-2.5 bg-gray-50/70 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.flat && touched.flat
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-200 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white"
              }`}
            />
            {errors.flat && touched.flat && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.flat}
              </p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Pincode *
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
              className={`w-full px-4 py-2.5 bg-gray-50/70 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.pincode && touched.pincode
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-200 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white"
              }`}
            />
            {errors.pincode && touched.pincode && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.pincode}
              </p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange("payment", "upi")}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  form.payment === "upi"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>UPI (Instant)</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange("payment", "cod")}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  form.payment === "cod"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* Mobile Submit Button */}
          <button
            type="submit"
            className="w-full lg:hidden mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-200"
          >
            Place Order • {formatINR(grandTotal)}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 sticky top-24">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Order Summary ({totalItems})
            </h3>

            {/* Scrollable Items List */}
            <div className="space-y-2.5 mb-4 max-h-56 overflow-y-auto scrollbar-hide pr-1">
              {items.map((item) => {
                const itemPrice = convertToINR(item.price);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs text-gray-700"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-10 h-10 object-contain bg-gray-50 rounded-lg shrink-0 p-1 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {item.qty} × {formatINR(itemPrice)}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 tabular-nums">
                      {formatINR(itemPrice * item.qty)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span className="font-semibold text-gray-800">
                  {formatINR(itemTotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Handling Fee</span>
                <span className="font-semibold text-gray-800">
                  {formatINR(handlingCharge)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  <span className="font-semibold text-gray-800">
                    {formatINR(deliveryFee)}
                  </span>
                )}
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>−{formatINR(couponDiscount)}</span>
                </div>
              )}
              <div className="border-t border-dashed border-gray-200 pt-2.5 flex justify-between font-extrabold text-gray-900 text-sm">
                <span>Grand Total</span>
                <span className="text-emerald-700">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>

            {/* Desktop Submit Button */}
            <button
              type="submit"
              form="checkout-form"
              className="hidden lg:block w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-200 hover:shadow-emerald-300 text-center"
            >
              Place Order • {formatINR(grandTotal)}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
