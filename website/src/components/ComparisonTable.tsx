'use client';

import React from 'react';
import MathTable from './MathTable';
import 'katex/dist/katex.min.css';

export default function ComparisonTable() {
  return (
    <MathTable 
      caption="Comparison of the Three Solution Approaches" 
      label="tab:comparison"
      className="mb-6"
    >
      <thead>
        <tr className="border-b border-border">
          <th className="p-2 text-left font-semibold w-1/3">HAPD Algorithm</th>
          <th className="p-2 text-left font-semibold w-1/3">Matrix Approach</th>
          <th className="p-2 text-left font-semibold w-1/3">Modified sin² Algorithm</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border">
          <td className="p-2">Works directly from number α</td>
          <td className="p-2">Requires minimal polynomial (or candidate)</td>
          <td className="p-2">Works directly from number α</td>
        </tr>
        <tr className="border-b border-border">
          <td className="p-2">Geometric interpretation (projective space)</td>
          <td className="p-2">Clear algebraic interpretation (traces, eigenvalues)</td>
          <td className="p-2">Algorithmic, based on floor functions</td>
        </tr>
        <tr className="border-b border-border">
          <td className="p-2">Provides representation sequence (pairs)</td>
          <td className="p-2">Provides trace sequence</td>
          <td className="p-2">Provides representation sequence (pairs)</td>
        </tr>
        <tr className="border-b border-border">
          <td className="p-2">Handles complex roots inherently</td>
          <td className="p-2">Handles complex roots inherently (via polynomial)</td>
          <td className="p-2">Explicitly modified for complex roots</td>
        </tr>
        <tr className="border-b border-border">
          <td className="p-2">Can be slower numerically</td>
          <td className="p-2">Needs polynomial identification (e.g., PSLQ/LLL)</td>
          <td className="p-2">Sensitivity to phase-preserving floor details</td>
        </tr>
        <tr className="border-b border-border">
          <td className="p-2">Potential precision issues</td>
          <td className="p-2">Robust once polynomial known</td>
          <td className="p-2">Potential precision issues</td>
        </tr>
        <tr className="border-b border-border">
          <td className="p-2">Direct generalization of Hermite's geometric idea</td>
          <td className="p-2">Computationally efficient for verification</td>
          <td className="p-2">Extension of existing algorithm (Karpenkov)</td>
        </tr>
      </tbody>
    </MathTable>
  );
}