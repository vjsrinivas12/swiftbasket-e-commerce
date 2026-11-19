export const USD_TO_INR = 85;
export const FREE_DELIVERY_THRESHOLD = 499;
export const DELIVERY_FEE = 30;
export const HANDLING_CHARGE = 5;

export const COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FREESHIP: { type: "shipping", value: 30, label: "Free Shipping" },
};

export const CATEGORIES = [
  "All",
  "Fruits & Vegetables",
  "Dairy & Breakfast",
  "Snacks & Beverages",
  "Staples",
];

export const SORT_OPTIONS = [
  { label: "Relevance", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export const API_GROCERIES_URL =
  "https://dummyjson.com/products/category/groceries?limit=30";
export const API_PRODUCTS_BASE_URL = "https://dummyjson.com/products";
