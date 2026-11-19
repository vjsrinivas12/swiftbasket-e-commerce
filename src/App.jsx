import { useState, useCallback } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CartDrawer from "./components/CartDrawer";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50/50 font-sans antialiased">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCartClick={openCart}
        />
        <Home searchQuery={searchQuery} />
        <CartDrawer open={cartOpen} onClose={closeCart} />
      </div>
    </CartProvider>
  );
}
