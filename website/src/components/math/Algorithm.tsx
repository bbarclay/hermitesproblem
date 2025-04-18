'use client';

import React from 'react';

interface AlgorithmProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}

export default function Algorithm({ id, title, children }: AlgorithmProps) {
  return (
    <div id={id} className="my-6 bg-card p-4 rounded-md border border-border">
      <div className="font-bold mb-2">{title}</div>
      <div>{children}</div>
    </div>
  );
}