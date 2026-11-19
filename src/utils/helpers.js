/**
 * Classifies a DummyJSON grocery product into quick-commerce catalog categories.
 * @param {object} product
 * @returns {string}
 */
export function guessCategory(product) {
  const text = `${product.title || ""} ${product.description || ""} ${
    product.tags?.join(" ") || ""
  }`.toLowerCase();

  if (
    /fruit|vegetable|lemon|onion|garlic|ginger|potato|tomato|apple|banana|green|chili|cucumber|carrot/i.test(
      text
    )
  ) {
    return "Fruits & Vegetables";
  }

  if (
    /milk|butter|cheese|cream|egg|yogurt|curd|paneer|bread|breakfast|cereal/i.test(
      text
    )
  ) {
    return "Dairy & Breakfast";
  }

  if (
    /snack|chip|biscuit|cookie|drink|juice|soda|tea|coffee|beverage|chocolate|candy|ice/i.test(
      text
    )
  ) {
    return "Snacks & Beverages";
  }

  return "Staples";
}
