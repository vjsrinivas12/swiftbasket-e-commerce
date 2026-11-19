import { useState, useRef, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Search,
  MapPin,
  Zap,
  X,
  ChevronDown,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar({ searchQuery, setSearchQuery, onCartClick }) {
  const { totalItems, grandTotal } = useCart();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pincode, setPincode] = useState("400001");
  const [tempPin, setTempPin] = useState("400001");
  const searchRef = useRef(null);

  // Focus search on "/" key
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

  // Debounced search
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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 hidden sm:block">
                Swift<span className="text-emerald-600">Basket</span>
              </span>
            </div>

            {/* Delivery Badge + Pincode */}
            <button
              onClick={() => {
                setTempPin(pincode);
                setShowPinModal(true);
              }}
              className="hidden md:flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer shrink-0"
            >
              <span className="flex items-center gap-1 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                12 min
              </span>
              <span className="w-px h-4 bg-emerald-200" />
              <MapPin className="w-3.5 h-3.5" />
              <span className="max-w-[80px] truncate">{pincode}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder='Search groceries…  Press "/"'
                defaultValue={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition"
              />
            </div>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-emerald-200 cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <>
                  <span className="hidden sm:inline">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                    {totalItems}
                  </span>
                </>
              )}
              {totalItems === 0 && (
                <span className="hidden sm:inline">Cart</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Pincode Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[fadeInUp_0.25s_ease-out]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                Delivery Location
              </h3>
              <button
                onClick={() => setShowPinModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Enter Pincode / Area
            </label>
            <input
              type="text"
              value={tempPin}
              onChange={(e) => setTempPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSave()}
              placeholder="e.g. 400001"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 mb-4"
              autoFocus
            />
            <button
              onClick={handlePinSave}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              Save &amp; Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
