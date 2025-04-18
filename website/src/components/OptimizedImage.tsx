'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 500,
  caption,
  className = '',
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <figure className="my-8 relative">
      <div
        className={`
          overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 relative
          ${isLoading ? 'animate-pulse' : ''}
          ${className}
        `}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`
            duration-700 ease-in-out
            ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
            ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
            transition-all hover:scale-102
          `}
          quality={90}
          onLoadingComplete={() => setLoading(false)}
          onClick={toggleZoom}
        />
        {!isLoading && !isZoomed && (
          <button 
            onClick={toggleZoom}
            className="absolute top-2 right-2 bg-white/70 dark:bg-black/70 p-1 rounded-full shadow-sm text-gray-800 dark:text-gray-100 opacity-70 hover:opacity-100 transition-opacity" 
            aria-label="Zoom image"
          >
            <ZoomIn size={16} />
          </button>
        )}
      </div>
      
      {caption && (
        <figcaption className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2 italic">
          {caption}
        </figcaption>
      )}

      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={toggleZoom}
        >
          <Image
            src={src}
            alt={alt}
            width={width * 1.5}
            height={height * 1.5}
            className="max-h-screen max-w-full object-contain"
            quality={100}
          />
          {caption && (
            <figcaption className="text-sm text-center text-gray-300 absolute bottom-8 left-0 right-0">
              {caption}
            </figcaption>
          )}
        </div>
      )}
    </figure>
  );
}