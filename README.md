# ⚡ SwiftBasket — Quick-Commerce Grocery Storefront

A modern, responsive, high-performance quick-commerce grocery web application built with **React**, **Vite**, **Tailwind CSS**, and **Lucide React**. SwiftBasket delivers an ultra-fast grocery shopping experience with a 12-minute delivery promise, real-time cart state management, and seamless routing.

---

## 🚀 Key Features

- **⚡ 12-Minute Delivery Experience**: Sticky navigation bar featuring real-time delivery estimates, customizable pincode selector modal, and live cart counter with INR pricing.
- **🔍 Quick Search with Keyboard Shortcut**: Press `/` anywhere to immediately focus the debounced search bar (300ms debounce).
- **🛒 Synced Cart & Smooth Steppers**: Seamless transition between "ADD" button and `− [qty] +` stepper controls with `e.stopPropagation()` protection.
- **📦 Slide-Over Cart Drawer**:
  - Dynamic free delivery progress bar (Free delivery on orders above ₹499; ₹30 delivery fee otherwise).
  - Coupon support (`SAVE10` gives 10% instant discount).
  - Itemized receipt breakdown: Item Total, Handling Charge (₹5), Delivery Fee, Coupon Discount, and Grand Total.
- **📄 Product Details Route (`/product/:id`)**:
  - High-resolution gallery with thumbnail switcher.
  - Live stock indicators, warranty details, and delivery ETA.
  - Verified customer reviews with star ratings and feedback.
- **💳 Form-Validated Checkout (`/checkout`)**:
  - Controlled inputs for Full Name, 10-digit Mobile Number, House/Street details, and 6-digit Pincode.
  - Interactive payment toggle between **UPI (Instant)** and **Cash on Delivery**.
  - Animated Order Confirmed screen with an active **12-minute countdown timer** (`MM:SS`) with automatic interval cleanup.
- **📱 Fully Responsive Design**: Optimized grid and typography scaling across mobile phones, tablets, laptops, and ultra-wide desktops.

---

## 📁 Architecture & Clean Separation of Concerns

The codebase is strictly structured into modular, reusable directories:

```
src/
├── assets/                  # Static media, icons, and image assets
├── components/              # Reusable UI presentation components
│   ├── CartDrawer.jsx       # Slide-over cart panel with bill summary & coupon
│   ├── Navbar.jsx           # Sticky header with location modal, search & cart
│   ├── OrderConfirmed.jsx   # Order receipt screen with live countdown timer
│   ├── ProductCard.jsx      # Product grid card with synchronized qty stepper
│   └── SkeletonCard.jsx     # Animated pulse loading skeleton placeholder
├── context/                 # Centralized React Context & State Management
│   └── CartContext.jsx      # useReducer-powered global cart provider
├── hooks/                   # Custom reusable React hooks
│   ├── useFetch.js          # Fetch hook with AbortController cleanup
│   └── useLocalStorage.js   # Synchronizes React state with window.localStorage
├── pages/                   # Top-level view routes
│   ├── Checkout.jsx         # Address form, payment selector, and checkout logic
│   ├── Home.jsx             # Category pills, sort dropdown, and product catalog
│   └── ProductDetails.jsx   # Dedicated product inspection page with gallery
├── utils/                   # Shared pure utility functions and business logic
│   ├── constants.js         # Pricing rates, delivery rules, and category definitions
│   ├── formatters.js        # Indian currency (₹) and price calculations
│   ├── helpers.js           # Smart product category classifier
│   └── validators.js        # Address input regex and length validators
├── App.jsx                  # Root router layout & context wrapper
├── index.css                # Tailwind CSS v4 directives & keyframe animations
└── main.jsx                 # Application entry point
```

---

## 🧠 React Hooks Deep Dive

### 1. `useReducer` & `useContext` (`CartContext.jsx`)
- **Centralized Action Management**: Manages state transitions using predictable action types:
  - `ADD_ITEM`: Adds a new product or increments an existing product's quantity.
  - `INCREMENT_QTY` & `DECREMENT_QTY`: Updates item volume, auto-removing items when quantity reaches 0.
  - `REMOVE_ITEM`: Deletes a line item from the cart.
  - `APPLY_COUPON` & `REMOVE_COUPON`: Validates and applies discount rules (e.g., `SAVE10`).
  - `CLEAR_CART`: Resets cart contents after a successful order.
- **High-Performance Context**: Exposes memoized helper actions (`useCallback`) and derived financial totals (`totalItems`, `itemTotal`, `deliveryFee`, `grandTotal`).

### 2. Custom `useFetch` Hook (`hooks/useFetch.js`)
- Fetches data from remote REST endpoints with `loading`, `error`, and `data` states.
- Utilizes `AbortController` to cancel ongoing network requests when the component unmounts or when the requested URL changes, preventing memory leaks and race conditions.

### 3. Custom `useLocalStorage` Hook (`hooks/useLocalStorage.js`)
- Persists cart items across browser sessions and page reloads.
- Handles JSON serialization, parsing, and storage quota exceptions gracefully.

### 4. `useMemo` (`pages/Home.jsx`)
- Computes filtered, searched, and sorted product lists with optimal efficiency.
- Recalculates only when `products`, `searchQuery`, `activeCategory`, or `sortBy` change, avoiding expensive re-filtering on unrelated renders.

### 5. `useRef` (`components/Navbar.jsx`)
- **Direct DOM Access**: Holds a reference to the search `<input>` element to auto-focus when the user presses the `/` key.
- **Timer Retention**: Holds debounce timeout references across re-renders without triggering unnecessary updates.

### 6. `useEffect` Cleanup (`components/OrderConfirmed.jsx` & `Navbar.jsx`)
- Manages window keyboard listeners (`keydown`), body scroll locks during drawer visibility, and a live 1-second interval timer that reliably cleans up via `clearInterval` to avoid memory leaks.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Data Source**: [DummyJSON Products API](https://dummyjson.com/)

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm`

### Installation

1. Clone or open the repository directory:
   ```bash
   cd "E-com Website"
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 💡 Quick Tips & Shortcuts

- **Focus Search**: Press `/` from anywhere on the page to instantly search.
- **Discount Coupon**: Apply `SAVE10` in the Cart Drawer to get 10% off your order.
- **Free Delivery**: Add items worth ₹499 or more to unlock zero-cost delivery.
