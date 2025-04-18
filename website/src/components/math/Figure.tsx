'use client';

import React from 'react';
import Image from 'next/image';

interface FigureProps {
  id?: string;
  src: string;
  caption: string;
  alt?: string;
}

export default function Figure({ id, src, caption, alt }: FigureProps) {
  // Extract filename from path to use as alt text if none provided
  const fileName = src.split('/').pop() || 'Figure';
  const imgAlt = alt || `${fileName} - ${caption}`;
  
  return (
    <figure id={id} className="my-8">
      <div className="flex justify-center">
        <div className="relative max-w-full overflow-hidden rounded-md">
          <Image 
            src={src} 
            alt={imgAlt}
            width={800}
            height={500}
            className="object-contain"
          />
        </div>
      </div>
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}