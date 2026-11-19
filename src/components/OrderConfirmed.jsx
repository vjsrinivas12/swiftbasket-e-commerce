import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ShoppingBag, Truck, ArrowLeft, PackageCheck } from "lucide-react";
import { formatINR } from "../utils/formatters";

/**
 * OrderConfirmed component displaying live countdown timer
 * (10s demo timer) and itemized order receipt after successful checkout.
 */
export default function OrderConfirmed({ orderSummary }) {
  const [secondsLeft, setSecondsLeft] = useState(10); // 10-second fast demo countdown

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isDelivered = secondsLeft === 0;

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-12 text-center">
      {/* Animated Success Badge */}
      <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-[scaleIn_0.4s_ease-out]">
        {isDelivered ? (
          <PackageCheck className="w-10 h-10 text-emerald-600 animate-bounce" />
        ) : (
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        {isDelivered ? "Order Delivered! 🎊" : "Order Confirmed! 🎉"}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {isDelivered
          ? "Your groceries have been delivered to your doorstep. Enjoy!"
          : "Your groceries are being packed and will arrive shortly."}
      </p>

      {/* 10-Second Countdown Timer & Delivery Status */}
      <div className="bg-emerald-50 rounded-2xl p-6 mb-8 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Truck
            className={`w-5 h-5 text-emerald-600 ${
              !isDelivered ? "animate-pulse" : ""
            }`}
          />
          <span className="text-sm font-semibold text-emerald-800">
            {isDelivered ? "Delivery Status" : "Estimated Delivery Time"}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm min-w-[72px] border border-emerald-100">
            <span className="text-3xl font-extrabold text-emerald-700 tabular-nums">
              {String(mins).padStart(2, "0")}
            </span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              MINS
            </p>
          </div>
          <span
            className={`text-2xl font-bold text-emerald-400 ${
              !isDelivered ? "animate-pulse" : ""
            }`}
          >
            :
          </span>
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm min-w-[72px] border border-emerald-100">
            <span className="text-3xl font-extrabold text-emerald-700 tabular-nums">
              {String(secs).padStart(2, "0")}
            </span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              SECS
            </p>
          </div>
        </div>

        {/* Live Status Message */}
        {isDelivered ? (
          <div className="mt-3 py-1 px-3 bg-emerald-100/80 rounded-xl inline-block border border-emerald-200">
            <p className="text-sm sm:text-base font-extrabold text-emerald-800">
              🎉 Order Delivered!
            </p>
          </div>
        ) : (
          <p className="text-xs text-emerald-600 font-medium mt-3">
            Rider assigned • On the fastest route to your doorstep
          </p>
        )}
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          Order Receipt
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Items ({orderSummary.totalItems})</span>
            <span>{formatINR(orderSummary.itemTotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Handling Fee</span>
            <span>{formatINR(orderSummary.handlingCharge)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>
              {orderSummary.deliveryFee === 0
                ? "FREE"
                : formatINR(orderSummary.deliveryFee)}
            </span>
          </div>
          {orderSummary.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Coupon Discount</span>
              <span>−{formatINR(orderSummary.couponDiscount)}</span>
            </div>
          )}
          <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
            <span>Total Paid</span>
            <span>{formatINR(orderSummary.grandTotal)}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <p>
            <span className="font-semibold text-gray-700">Deliver to:</span>{" "}
            {orderSummary.address.fullName}, {orderSummary.address.flat},{" "}
            {orderSummary.address.pincode}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Contact:</span> +91{" "}
            {orderSummary.address.mobile}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Payment Mode:</span>{" "}
            <span className="uppercase font-semibold text-emerald-700">
              {orderSummary.address.payment === "upi"
                ? "UPI (Instant)"
                : "Cash on Delivery"}
            </span>
          </p>
        </div>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Order More Groceries
      </Link>
    </main>
  );
}
