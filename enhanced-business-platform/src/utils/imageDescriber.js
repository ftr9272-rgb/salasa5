/**
 * Image Description Utility
 * Provides functionality to generate descriptions for images in Arabic and English
 */

// Common image description patterns for business platform
const IMAGE_PATTERNS = {
  // Business/platform related
  logo: {
    ar: 'شعار الشركة أو العلامة التجارية',
    en: 'Company or brand logo'
  },
  product: {
    ar: 'صورة منتج',
    en: 'Product image'
  },
  profile: {
    ar: 'صورة شخصية',
    en: 'Profile picture'
  },
  avatar: {
    ar: 'صورة رمزية للمستخدم',
    en: 'User avatar'
  },
  placeholder: {
    ar: 'صورة مؤقتة',
    en: 'Placeholder image'
  },
  // UI elements
  icon: {
    ar: 'أيقونة',
    en: 'Icon'
  },
  button: {
    ar: 'زر تفاعلي',
    en: 'Interactive button'
  },
  chart: {
    ar: 'رسم بياني أو إحصائيات',
    en: 'Chart or statistics'
  },
  map: {
    ar: 'خريطة',
    en: 'Map'
  },
  // Business context
  warehouse: {
    ar: 'صورة مستودع أو مخزن',
    en: 'Warehouse or storage image'
  },
  shipping: {
    ar: 'صورة متعلقة بالشحن أو النقل',
    en: 'Shipping or transport related image'
  },
  merchant: {
    ar: 'صورة متعلقة بالتاجر أو المتجر',
    en: 'Merchant or store related image'
  },
  supplier: {
    ar: 'صورة متعلقة بالمورد',
    en: 'Supplier related image'
  }
};

/**
 * Analyzes image source or context to determine appropriate description
 * @param {string} src - Image source URL
 * @param {string} alt - Existing alt text
 * @param {string} context - Additional context (e.g., 'product', 'profile')
 * @param {string} lang - Language preference ('ar' or 'en')
 * @returns {string} Generated description
 */
export function generateImageDescription(src, alt = '', context = '', lang = 'ar') {
  // If alt text exists and is meaningful, use it
  if (alt && alt.trim() && alt !== 'image' && alt !== 'صورة') {
    return alt;
  }

  // Analyze the source URL for patterns
  const srcLower = (src || '').toLowerCase();
  
  // Check for specific patterns in URL
  for (const [pattern, descriptions] of Object.entries(IMAGE_PATTERNS)) {
    if (srcLower.includes(pattern) || context.toLowerCase().includes(pattern)) {
      return descriptions[lang] || descriptions['ar'];
    }
  }

  // Check for file extensions and common names
  if (srcLower.includes('logo') || srcLower.includes('brand')) {
    return IMAGE_PATTERNS.logo[lang];
  }
  
  if (srcLower.includes('product') || srcLower.includes('item')) {
    return IMAGE_PATTERNS.product[lang];
  }
  
  if (srcLower.includes('profile') || srcLower.includes('user') || srcLower.includes('avatar')) {
    return IMAGE_PATTERNS.profile[lang];
  }
  
  if (srcLower.includes('placeholder') || srcLower.includes('default')) {
    return IMAGE_PATTERNS.placeholder[lang];
  }

  // Context-based descriptions
  if (context) {
    const contextLower = context.toLowerCase();
    for (const [pattern, descriptions] of Object.entries(IMAGE_PATTERNS)) {
      if (contextLower.includes(pattern)) {
        return descriptions[lang];
      }
    }
  }

  // Default fallback
  return lang === 'ar' ? 'صورة' : 'Image';
}

/**
 * Generates accessible description for screen readers
 * @param {string} src - Image source URL
 * @param {string} alt - Existing alt text
 * @param {string} context - Additional context
 * @param {Object} options - Additional options
 * @returns {string} Accessible description
 */
export function generateAccessibleDescription(src, alt = '', context = '', options = {}) {
  const { lang = 'ar', includeContext = true, verbose = false } = options;
  
  let description = generateImageDescription(src, alt, context, lang);
  
  if (includeContext && context) {
    const contextDesc = lang === 'ar' ? `في سياق ${context}` : `in ${context} context`;
    description = `${description} ${contextDesc}`;
  }
  
  if (verbose && src) {
    const fileInfo = extractFileInfo(src);
    if (fileInfo.name) {
      const fileDesc = lang === 'ar' ? `اسم الملف: ${fileInfo.name}` : `filename: ${fileInfo.name}`;
      description = `${description} (${fileDesc})`;
    }
  }
  
  return description;
}

/**
 * Extracts file information from image URL
 * @param {string} src - Image source URL
 * @returns {Object} File information
 */
function extractFileInfo(src) {
  if (!src) return {};
  
  try {
    const url = new URL(src, window.location.origin);
    const pathname = url.pathname;
    const filename = pathname.split('/').pop();
    const extension = filename.split('.').pop();
    const nameWithoutExt = filename.replace(`.${extension}`, '');
    
    return {
      name: filename,
      nameWithoutExtension: nameWithoutExt,
      extension: extension,
      path: pathname
    };
  } catch (err) {
    // Handle relative URLs or malformed URLs
    console.debug('URL parsing failed:', err.message);
    const parts = src.split('/');
    const filename = parts[parts.length - 1];
    const extension = filename.includes('.') ? filename.split('.').pop() : '';
    
    return {
      name: filename,
      extension: extension
    };
  }
}

/**
 * Validates if an image description is meaningful
 * @param {string} description - Description to validate
 * @returns {boolean} Whether description is meaningful
 */
export function isValidDescription(description) {
  if (!description || typeof description !== 'string') return false;
  
  const trimmed = description.trim();
  const meaninglessTerms = ['image', 'صورة', 'img', 'picture', 'صوره'];
  
  return trimmed.length > 0 && !meaninglessTerms.includes(trimmed.toLowerCase());
}

/**
 * Business context analyzer for the platform
 * @param {string} userType - Type of user (merchant, supplier, shipping)
 * @param {string} section - Current section/page
 * @returns {string} Context for image description
 */
export function getBusinessContext(userType, section) {
  const contexts = {
    merchant: {
      dashboard: 'merchant-dashboard',
      products: 'merchant-products',
      suppliers: 'merchant-suppliers',
      orders: 'merchant-orders'
    },
    supplier: {
      dashboard: 'supplier-dashboard',
      products: 'supplier-products',
      orders: 'supplier-orders',
      warehouse: 'warehouse'
    },
    shipping: {
      dashboard: 'shipping-dashboard',
      shipments: 'shipping-shipments',
      tracking: 'shipping-tracking',
      routes: 'shipping-routes'
    }
  };
  
  return contexts[userType]?.[section] || `${userType}-${section}`;
}