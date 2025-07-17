// Loader.jsx
import React from 'react';
import './Loader.css';

/**
 * Loader komponenta sa dvije varijante:
 * - "skeleton" za tabele (koristi Bootstrap placeholders)
 * - "roller" za custom spinner sa tačkicama koje se vrte
 *
 * Props:
 * @param {{
 *   variant?: 'skeleton' | 'roller',
 *   isLoading: boolean,
 *   children: React.ReactNode,
 *   columns?: number,
 *   rows?: number
 * }} props
 */
const Loader = ({
  variant = 'roller',
 size = 'normal',
  isLoading,
   className = '',
  style = {},
  children
}) => {
  if (!isLoading) return <>{children}</>;


  if (variant === 'skeleton') {
     return (
      <div className="skeleton-overlay">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="skeleton-line" />
        ))}
      </div>
    );
  }

  const rollerClass = size === 'small'
    ? 'loader-roller loader-roller--small'
    : 'loader-roller';
  return (
     <div className={`${rollerClass} ${className}`} style={style}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} />
      ))}
    </div>
  );
};

export default Loader;