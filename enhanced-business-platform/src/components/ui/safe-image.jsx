import React from 'react'
import { generateImageDescription, generateAccessibleDescription } from '../../utils/imageDescriber'

export default function SafeImage({ 
  src, 
  alt = '', 
  className = '', 
  fallback = '/assets/placeholder.png', 
  context = '',
  lang = 'ar',
  autoDescribe = true,
  accessibleMode = false,
  ...props 
}) {
  const [s, setS] = React.useState(src)
  
  // Generate enhanced alt text if needed
  const enhancedAlt = React.useMemo(() => {
    if (!autoDescribe) return alt;
    
    if (accessibleMode) {
      return generateAccessibleDescription(s, alt, context, { lang, includeContext: true });
    }
    
    return generateImageDescription(s, alt, context, lang);
  }, [s, alt, context, lang, autoDescribe, accessibleMode]);

  return (
    <img
      src={s}
      alt={enhancedAlt}
      className={className}
      onError={() => { 
        if (s !== fallback) {
          setS(fallback);
        }
      }}
      {...props}
    />
  )
}
