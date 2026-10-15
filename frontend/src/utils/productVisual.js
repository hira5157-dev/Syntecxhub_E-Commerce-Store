// Fallback emoji and background colour shown when a product has no image
const BY_NAME = [
  ['tomato', '🍅'], ['potato', '🥔'], ['onion', '🧅'], ['spinach', '🥬'],
  ['banana', '🍌'], ['apple', '🍎'], ['orange juice', '🧃'], ['orange', '🍊'],
  ['mango', '🥭'], ['milk', '🥛'], ['egg', '🥚'], ['yogurt', '🥣'], ['yoghurt', '🥣'],
  ['bread', '🍞'], ['bun', '🍞'], ['water', '💧'], ['juice', '🧃'],
  ['chips', '🍟'], ['biscuit', '🍪'], ['carrot', '🥕'], ['grape', '🍇'],
  ['lemon', '🍋'], ['cucumber', '🥒'], ['cheese', '🧀'], ['butter', '🧈'],
];

const BY_CATEGORY = {
  Fruits: ['🍎', '#FFF1D6'],
  Vegetables: ['🥦', '#E3F3E8'],
  Dairy: ['🥛', '#E6EFFA'],
  Bakery: ['🍞', '#F6E8D8'],
  Beverages: ['🧃', '#FDE9D6'],
  Snacks: ['🍿', '#FBE0DE'],
};

export const categoryEmoji = (c) => (BY_CATEGORY[c] ? BY_CATEGORY[c][0] : '🛒');

export function productVisual(product) {
  const n = product.name.toLowerCase();
  const hit = BY_NAME.find(([k]) => n.includes(k));
  const [catEmoji, bg] = BY_CATEGORY[product.category] || ['🛒', '#EEE'];
  return { emoji: hit ? hit[1] : catEmoji, bg };
}
