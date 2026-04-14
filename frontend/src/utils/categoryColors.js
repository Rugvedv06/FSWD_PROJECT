export const CATEGORY_COLORS = {
  Food: '#F59E0B',           // amber
  Transport: '#3B82F6',      // blue
  Entertainment: '#8B5CF6',  // purple
  Shopping: '#EC4899',       // pink
  Bills: '#EF4444',          // red
  Health: '#10B981',         // emerald
  Travel: '#06B6D4',         // cyan
  Other: '#6B7280',          // gray
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
};

export default CATEGORY_COLORS;
