'use client';

import React from 'react';

interface ProofProps {
  children: React.ReactNode;
}

export default function Proof({ children }: ProofProps) {
  return (
    <div className="my-4 pl-4 border-l-2 border-muted-foreground/50">
      <em className="font-medium">Proof.</em> {children}
      <div className="text-right">□</div>
    </div>
  );
}