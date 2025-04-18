'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface TheoremProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Theorem({ id, title, children, className }: TheoremProps) {
  return (
    <div id={id} className={cn("my-6 bg-secondary/20 p-4 rounded-md border-l-4 border-primary", className)}>
      <div className="font-bold mb-2">{title}</div>
      <div>{children}</div>
    </div>
  );
}