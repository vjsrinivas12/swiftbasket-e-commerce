import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import CartDrawer from "./components/CartDrawer";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gray-50/50 font-sans antialiased">
          <Navbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCartClick={openCart}
          />
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <CartDrawer open={cartOpen} onClose={closeCart} />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
