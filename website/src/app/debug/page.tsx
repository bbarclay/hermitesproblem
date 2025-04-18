'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSearch, Bug, Braces, FileCode } from 'lucide-react';
import TexDebugger from '@/components/debug/TexDebugger';

export default function DebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">LaTeX Debug Tools</h1>
      <p className="mb-6 text-slate-600">
        Use this page to test and debug LaTeX rendering issues. Enter LaTeX content in the editor and process it to see how it renders.
      </p>
      <TexDebugger />
    </div>
  );
}
