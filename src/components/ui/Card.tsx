import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const hoverStyles = hover
    ? 'hover:shadow-lg hover:border-primary/20 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-border p-6 transition-all duration-300 ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

export function CardImage({ src, alt, className = '', overlay = false }: CardImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-t-xl ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      )}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
