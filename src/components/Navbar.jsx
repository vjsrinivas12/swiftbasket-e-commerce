import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  MapPin,
  Zap,
  X,
  ChevronDown,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/formatters";

export default function Navbar({ searchQuery, setSearchQuery, onCartClick }) {
  const { totalItems, grandTotal } = useCart();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pincode, setPincode] = useState("400001");
  const [tempPin, setTempPin] = useState("400001");
  const searchRef = useRef(null);

  // Focus search bar on "/" keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if (
        e.key === "/" &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Debounced search handling
  const debounceRef = useRef(null);
  const handleSearch = useCallback(
    (value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, 300);
    },
    [setSearchQuery]
  );

  const handlePinSave = () => {
    if (tempPin.trim().length >= 5) {
      setPincode(tempPin.trim());
      setShowPinModal(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Brand Logo & Name */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
              aria-label="SwiftBasket Home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 hidden sm:block">
                Swift<span className="text-emerald-600">Basket</span>
              </span>
            </Link>

            {/* Delivery ETA & Pincode Pill */}
            <button
              type="button"
              onClick={() => {
                setTempPin(pincode);
                setShowPinModal(true);
              }}
              className="hidden md:flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0"
              title="Change Delivery Location"
            >
              <span className="flex items-center gap-1 font-bold text-emerald-700">
                <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                12 mins
              </span>
              <span className="w-px h-3.5 bg-emerald-200" />
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[70px] truncate">{pincode}</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            {/* Search Input Bar with '/' trigger */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder='Search groceries, fruits, milk... (Press "/" to focus)'
                defaultValue={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white transition"
              />
            </div>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onCartClick}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 cursor-pointer shrink-0"
              aria-label={`Open Cart with ${totalItems} items`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 ? (
                <>
                  <span className="hidden sm:inline tabular-nums">
                    {formatINR(grandTotal)}
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                    {totalItems}
                  </span>
                </>
              ) : (
                <span className="hidden sm:inline">My Cart</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Pincode / Location Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-[fadeInUp_0.25s_ease-out] border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Select Delivery Location
              </h3>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="p-1 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
              Enter Pincode / Area
            </label>
            <input
              type="text"
              value={tempPin}
              onChange={(e) => setTempPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSave()}
              placeholder="e.g. 400001"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white mb-4 transition"
              autoFocus
            />

            <button
              type="button"
              onClick={handlePinSave}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md shadow-emerald-200"
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}
    </>
  );
}
