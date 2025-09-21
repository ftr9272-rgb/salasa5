import React from 'react'

export default function SafeImage({ src, alt = '', className = '', fallback = '/assets/placeholder.png', ...props }) {
  const [s, setS] = React.useState(src)
  return (
    <img
      src={s}
      alt={alt}
      className={className}
      onError={() => { if (s !== fallback) setS(fallback); }}
      {...props}
    />
  )
}
