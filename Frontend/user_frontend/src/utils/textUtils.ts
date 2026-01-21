/**
 * Strip HTML tags from a string and return plain text
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';

  // Create a temporary div element to parse HTML
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  // Get text content (automatically strips all HTML tags)
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Truncate text to a maximum length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format price to Vietnamese currency
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + '₫';
};

/**
 * Format date to Vietnamese locale
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Sanitize text for safe display (removes HTML and trims whitespace)
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  return stripHtml(text).trim();
};
