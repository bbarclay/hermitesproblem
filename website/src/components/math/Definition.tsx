'use client';

import React from 'react';

interface DefinitionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}

export default function Definition({ id, title, children }: DefinitionProps) {
  return (
    <div id={id} className="my-6 bg-secondary/10 p-4 rounded-md">
      <div className="font-semibold mb-2">{title}</div>
      <div>{children}</div>
    </div>
  );
}