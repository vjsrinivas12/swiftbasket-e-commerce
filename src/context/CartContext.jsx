import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  USD_TO_INR,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_FEE,
  HANDLING_CHARGE,
  COUPONS,
} from "../utils/constants";
import { convertToINR } from "../utils/formatters";

const CartContext = createContext();

export { USD_TO_INR };

/* ── Reducer ── */
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, qty: 1 }],
      };
    }

    case "INCREMENT_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i
        ),
      };

    case "DECREMENT_QTY": {
      const item = state.items.find((i) => i.id === action.id);
      if (!item) return state;
      if (item.qty === 1) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty - 1 } : i
        ),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
      };

    case "APPLY_COUPON": {
      const code = action.code.toUpperCase().trim();
      const coupon = COUPONS[code];
      if (!coupon)
        return { ...state, coupon: null, couponError: "Invalid coupon code" };
      return { ...state, coupon: { code, ...coupon }, couponError: null };
    }

    case "REMOVE_COUPON":
      return { ...state, coupon: null, couponError: null };

    case "CLEAR_CART":
      return { ...state, items: [], coupon: null, couponError: null };

    case "HYDRATE":
      return { ...state, items: action.items };

    default:
      return state;
  }
}

const initialState = {
  items: [],
  coupon: null,
  couponError: null,
};

/* ── Provider ── */
export function CartProvider({ children }) {
  const [persisted, setPersisted] = useLocalStorage("swiftbasket-cart", []);
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    items: persisted,
  });

  // Persist items to localStorage on state changes
  useEffect(() => {
    setPersisted(state.items);
  }, [state.items, setPersisted]);

  /* ── Actions ── */
  const addToCart = useCallback(
    (product) => dispatch({ type: "ADD_ITEM", product }),
    []
  );
  const incrementQty = useCallback(
    (id) => dispatch({ type: "INCREMENT_QTY", id }),
    []
  );
  const decrementQty = useCallback(
    (id) => dispatch({ type: "DECREMENT_QTY", id }),
    []
  );
  const removeItem = useCallback(
    (id) => dispatch({ type: "REMOVE_ITEM", id }),
    []
  );
  const applyCoupon = useCallback(
    (code) => dispatch({ type: "APPLY_COUPON", code }),
    []
  );
  const removeCoupon = useCallback(
    () => dispatch({ type: "REMOVE_COUPON" }),
    []
  );
  const clearCart = useCallback(
    () => dispatch({ type: "CLEAR_CART" }),
    []
  );

  /* ── Computed values ── */
  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
  const itemTotal = state.items.reduce(
    (sum, i) => sum + convertToINR(i.price) * i.qty,
    0
  );
  const deliveryFee = itemTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const couponDiscount = state.coupon
    ? state.coupon.type === "percent"
      ? Math.round(itemTotal * (state.coupon.value / 100))
      : state.coupon.value
    : 0;
  const grandTotal = Math.max(
    0,
    itemTotal + HANDLING_CHARGE + deliveryFee - couponDiscount
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        coupon: state.coupon,
        couponError: state.couponError,
        totalItems,
        itemTotal,
        deliveryFee,
        handlingCharge: HANDLING_CHARGE,
        couponDiscount,
        grandTotal,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        addToCart,
        incrementQty,
        decrementQty,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
