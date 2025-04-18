'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator } from 'lucide-react';

interface CubicFieldExplorerProps {
  className?: string;
}

const CubicFieldExplorer: React.FC<CubicFieldExplorerProps> = ({
  className = ''
}) => {
  // Simplified version to avoid UI component dependencies
  return (
    <div className={`cubic-field-explorer ${className} border rounded-lg p-4`}>
      <h3 className="text-lg font-semibold mb-2">Cubic Field Explorer</h3>
      <p className="text-sm text-gray-600 mb-4">
        This component would normally allow you to explore cubic fields and their properties.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Example: Cube Root of 2</h4>
        <p>Minimal Polynomial: x³ - 2</p>
        <p>Discriminant: -108</p>
        <p>Roots: 1.26, -0.63 + 1.09i, -0.63 - 1.09i</p>
        <p>Period Length: 1</p>
      </div>

      <div className="mt-4">
        <Button>
          <Calculator className="mr-2 h-4 w-4" />
          Compute Field Data
        </Button>
      </div>
    </div>
  );
};

export default CubicFieldExplorer;
