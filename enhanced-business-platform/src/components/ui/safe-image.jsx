import React from 'react'

export default function SafeImage({ src, alt = '', className = '', fallback = '/assets/placeholder.png', ...props }) {
  const [s, setS] = React.useState(src)
  
  // Enhance alt text for fallback images
  const enhancedAlt = alt || 'صورة غير متاحة'
  
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
