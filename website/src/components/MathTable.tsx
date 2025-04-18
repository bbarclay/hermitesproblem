'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface MathTableProps {
  caption?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export default function MathTable({ caption, label, children, className }: MathTableProps) {
  return (
    <div className={cn("my-6", className)} id={label}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
      {caption && (
        <div className="text-center text-sm mt-2 text-muted-foreground">
          Table: {caption}
        </div>
      )}
    </div>
  );
}