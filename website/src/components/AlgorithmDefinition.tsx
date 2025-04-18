'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface AlgorithmDefProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AlgorithmDefinition({ title, children, className }: AlgorithmDefProps) {
  return (
    <div className={cn("my-6 rounded-lg border border-border bg-card p-4", className)}>
      {title && <div className="font-semibold mb-2">{title}</div>}
      {children}
    </div>
  );
}