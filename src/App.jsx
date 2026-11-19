import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50/50 font-sans antialiased">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Home searchQuery={searchQuery} />
      </div>
    </CartProvider>
  );
}
