'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calculator, 
  RefreshCw, 
  Check, 
  X, 
  Info, 
  HelpCircle,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CubicFieldExplorerProps {
  className?: string;
}

interface CubicPolynomial {
  a: number;
  b: number;
  c: number;
}

interface CubicFieldData {
  polynomial: CubicPolynomial;
  discriminant: number;
  isCyclic: boolean;
  roots: { real: number; imag: number }[];
  minimalPolynomial: string;
  traceSequence: number[];
  periodLength: number | null;
  isCubic: boolean;
}

const CubicFieldExplorer: React.FC<CubicFieldExplorerProps> = ({
  className = ''
}) => {
  const [a, setA] = useState<number>(-3);
  const [b, setB] = useState<number>(1);
  const [c, setC] = useState<number>(-1);
  const [alpha, setAlpha] = useState<number>(Math.pow(2, 1/3));
  const [fieldData, setFieldData] = useState<CubicFieldData | null>(null);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("polynomial");
  const [error, setError] = useState<string | null>(null);

  // Compute cubic field data
  const computeFieldData = () => {
    setIsComputing(true);
    setError(null);
    
    try {
      // Create polynomial
      const polynomial: CubicPolynomial = { a, b, c };
      
      // Compute discriminant
      const discriminant = b * b * a * a - 4 * b * b * b - 4 * a * a * a * c - 27 * c * c + 18 * a * b * c;
      
      // Check if field is cyclic (discriminant is a perfect square)
      const sqrtDisc = Math.sqrt(Math.abs(discriminant));
      const isCyclic = discriminant > 0 && Math.abs(sqrtDisc - Math.round(sqrtDisc)) < 1e-10;
      
      // Find roots using numerical methods
      const roots = findRoots(polynomial);
      
      // Generate minimal polynomial
      const minimalPolynomial = `x³ ${a !== 0 ? `${a > 0 ? '+ ' : '- '}${Math.abs(a)}x²` : ''} ${b !== 0 ? `${b > 0 ? '+ ' : '- '}${Math.abs(b)}x` : ''} ${c !== 0 ? `${c > 0 ? '+ ' : '- '}${Math.abs(c)}` : ''}`;
      
      // Generate trace sequence
      const traceSequence = generateTraceSequence(polynomial, 20);
      
      // Detect periodicity
      const periodLength = detectPeriodicity(traceSequence);
      
      // Check if number is cubic
      const isCubic = periodLength !== null;
      
      // Set field data
      setFieldData({
        polynomial,
        discriminant,
        isCyclic,
        roots,
        minimalPolynomial,
        traceSequence,
        periodLength,
        isCubic
      });
    } catch (err) {
      setError("Error computing field data. Please check your inputs.");
      console.error(err);
    } finally {
      setIsComputing(false);
    }
  };

  // Find roots of cubic polynomial using numerical methods
  const findRoots = (poly: CubicPolynomial): { real: number; imag: number }[] => {
    const { a, b, c } = poly;
    
    // Convert to depressed cubic t^3 + pt + q = 0
    const p = (3 * b - a * a) / 3;
    const q = (2 * a * a * a - 9 * a * b + 27 * c) / 27;
    
    // Compute discriminant
    const discriminant = (q * q / 4) + (p * p * p / 27);
    
    let roots: { real: number; imag: number }[] = [];
    
    if (Math.abs(discriminant) < 1e-10) {
      // One or two real roots
      if (Math.abs(p) < 1e-10) {
        // Triple root
        const x = -a / 3;
        roots = [
          { real: x, imag: 0 },
          { real: x, imag: 0 },
          { real: x, imag: 0 }
        ];
      } else {
        // One single and one double root
        const u = Math.cbrt(-q / 2);
        const x1 = 2 * u;
        const x2 = -u;
        
        roots = [
          { real: x1 - a / 3, imag: 0 },
          { real: x2 - a / 3, imag: 0 },
          { real: x2 - a / 3, imag: 0 }
        ];
      }
    } else if (discriminant > 0) {
      // One real root and two complex conjugate roots
      const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
      const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
      
      const x1 = u + v;
      const x2Real = -(u + v) / 2;
      const x2Imag = (Math.sqrt(3) / 2) * (u - v);
      
      roots = [
        { real: x1 - a / 3, imag: 0 },
        { real: x2Real - a / 3, imag: x2Imag },
        { real: x2Real - a / 3, imag: -x2Imag }
      ];
    } else {
      // Three distinct real roots
      const theta = Math.acos(-q / 2 / Math.sqrt(-p * p * p / 27));
      const x1 = 2 * Math.sqrt(-p / 3) * Math.cos(theta / 3);
      const x2 = 2 * Math.sqrt(-p / 3) * Math.cos((theta + 2 * Math.PI) / 3);
      const x3 = 2 * Math.sqrt(-p / 3) * Math.cos((theta + 4 * Math.PI) / 3);
      
      roots = [
        { real: x1 - a / 3, imag: 0 },
        { real: x2 - a / 3, imag: 0 },
        { real: x3 - a / 3, imag: 0 }
      ];
    }
    
    return roots;
  };

  // Generate trace sequence for companion matrix
  const generateTraceSequence = (poly: CubicPolynomial, length: number): number[] => {
    const { a, b, c } = poly;
    
    // Initial values
    const traces: number[] = [3, a];
    
    // Recurrence relation: tr(A^n) = a*tr(A^(n-1)) - b*tr(A^(n-2)) + c*tr(A^(n-3))
    for (let i = 2; i < length; i++) {
      const nextTrace = a * traces[i - 1] - b * traces[i - 2] + (i >= 3 ? c * traces[i - 3] : 0);
      traces.push(nextTrace);
    }
    
    return traces;
  };

  // Detect periodicity in trace sequence
  const detectPeriodicity = (sequence: number[]): number | null => {
    // Need at least 6 elements to detect periodicity
    if (sequence.length < 6) return null;
    
    // Check for periodicity with period length from 1 to sequence.length / 3
    for (let period = 1; period <= sequence.length / 3; period++) {
      let isPeriodic = true;
      
      // Check if sequence[i] = sequence[i + period] for all i in range
      for (let i = sequence.length - 2 * period; i < sequence.length - period; i++) {
        if (sequence[i] !== sequence[i + period]) {
          isPeriodic = false;
          break;
        }
      }
      
      if (isPeriodic) {
        return period;
      }
    }
    
    return null;
  };

  // Compute field data when polynomial coefficients change
  useEffect(() => {
    if (activeTab === "polynomial") {
      computeFieldData();
    }
  }, [a, b, c, activeTab]);

  // Compute polynomial coefficients from alpha
  const computePolynomialFromAlpha = () => {
    setIsComputing(true);
    setError(null);
    
    try {
      // Approximate coefficients using numerical methods
      // For a cubic irrational α, find polynomial x^3 + ax^2 + bx + c such that α is a root
      
      // Compute powers of alpha
      const alpha2 = alpha * alpha;
      const alpha3 = alpha2 * alpha;
      const alpha4 = alpha3 * alpha;
      const alpha5 = alpha4 * alpha;
      const alpha6 = alpha5 * alpha;
      
      // Set up system of equations
      // α^3 + aα^2 + bα + c = 0
      // α^4 + aα^3 + bα^2 + cα = 0
      // α^5 + aα^4 + bα^3 + cα^2 = 0
      
      // Solve for a, b, c using Cramer's rule
      const det = alpha3 * alpha2 * alpha - alpha3 * alpha * alpha2 - alpha2 * alpha2 * alpha2 + alpha2 * alpha3 * 1 + alpha * alpha * alpha3 - alpha * alpha2 * alpha2;
      
      if (Math.abs(det) < 1e-10) {
        setError("Cannot compute polynomial. The determinant is too close to zero.");
        setIsComputing(false);
        return;
      }
      
      const detA = -alpha4 * alpha2 * alpha + alpha4 * alpha * alpha2 + alpha3 * alpha2 * alpha2 - alpha3 * alpha3 * 1 - alpha2 * alpha * alpha3 + alpha2 * alpha2 * alpha2;
      const detB = alpha3 * -alpha4 * alpha + alpha3 * alpha3 * alpha2 + alpha2 * alpha4 * alpha2 - alpha2 * alpha3 * alpha3 - alpha * alpha3 * alpha3 + alpha * alpha4 * alpha2;
      const detC = alpha3 * alpha2 * -alpha4 + alpha3 * alpha * alpha5 + alpha2 * alpha2 * alpha5 - alpha2 * alpha3 * alpha4 - alpha * alpha * alpha6 + alpha * alpha2 * alpha5;
      
      // Compute coefficients
      const newA = -Math.round(detA / det * 1000) / 1000;
      const newB = -Math.round(detB / det * 1000) / 1000;
      const newC = -Math.round(detC / det * 1000) / 1000;
      
      // Update coefficients
      setA(newA);
      setB(newB);
      setC(newC);
      
      // Switch to polynomial tab
      setActiveTab("polynomial");
    } catch (err) {
      setError("Error computing polynomial. Please check your input.");
      console.error(err);
    } finally {
      setIsComputing(false);
    }
  };

  // Format complex number for display
  const formatComplex = (real: number, imag: number): string => {
    const realPart = Math.abs(real) < 1e-10 ? 0 : Math.round(real * 10000) / 10000;
    const imagPart = Math.abs(imag) < 1e-10 ? 0 : Math.round(imag * 10000) / 10000;
    
    if (imagPart === 0) {
      return `${realPart}`;
    } else if (realPart === 0) {
      return `${imagPart}i`;
    } else {
      return `${realPart} ${imagPart >= 0 ? '+' : '-'} ${Math.abs(imagPart)}i`;
    }
  };

  return (
    <div className={`cubic-field-explorer ${className} border rounded-lg overflow-hidden`}>
      <div className="p-4 bg-slate-100 border-b">
        <h3 className="text-lg font-semibold mb-2">Cubic Field Explorer</h3>
        <p className="text-sm text-gray-600 mb-4">
          Explore cubic fields and their properties. Enter a polynomial or a cubic irrational to get started.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="polynomial">Polynomial Input</TabsTrigger>
            <TabsTrigger value="irrational">Irrational Input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="polynomial" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="a-input">Coefficient a</Label>
                <Input
                  id="a-input"
                  type="number"
                  step="1"
                  value={a}
                  onChange={(e) => setA(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="b-input">Coefficient b</Label>
                <Input
                  id="b-input"
                  type="number"
                  step="1"
                  value={b}
                  onChange={(e) => setB(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="c-input">Coefficient c</Label>
                <Input
                  id="c-input"
                  type="number"
                  step="1"
                  value={c}
                  onChange={(e) => setC(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Polynomial: x³ {a !== 0 ? `${a > 0 ? '+ ' : '- '}${Math.abs(a)}x²` : ''} {b !== 0 ? `${b > 0 ? '+ ' : '- '}${Math.abs(b)}x` : ''} {c !== 0 ? `${c > 0 ? '+ ' : '- '}${Math.abs(c)}` : ''}</p>
              
              <Button 
                variant="outline" 
                onClick={computeFieldData}
                disabled={isComputing}
                className="flex items-center gap-1"
              >
                <RefreshCw size={16} className={isComputing ? "animate-spin" : ""} />
                Compute Field Data
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="irrational" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="alpha-input">Cubic Irrational (α)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="alpha-input"
                    type="number"
                    step="0.001"
                    value={alpha}
                    onChange={(e) => setAlpha(parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setAlpha(Math.pow(2, 1/3))}
                    title="Set to cube root of 2"
                  >
                    ∛2
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setAlpha(Math.pow(3, 1/3))}
                    title="Set to cube root of 3"
                  >
                    ∛3
                  </Button>
                </div>
              </div>
              
              <div>
                <Button 
                  variant="outline" 
                  onClick={computePolynomialFromAlpha}
                  disabled={isComputing}
                  className="flex items-center gap-1"
                >
                  <Calculator size={16} />
                  Find Minimal Polynomial
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  This will attempt to find a polynomial with integer coefficients that has α as a root.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
      
      {fieldData && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  Field Properties
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle size={16} className="text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Properties of the cubic field defined by the polynomial.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1 border-b">
                    <span className="font-medium">Minimal Polynomial</span>
                    <span>{fieldData.minimalPolynomial}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1 border-b">
                    <span className="font-medium">Discriminant</span>
                    <span>{fieldData.discriminant.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1 border-b">
                    <span className="font-medium">Is Cyclic</span>
                    <span className="flex items-center">
                      {fieldData.isCyclic ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <X size={18} className="text-red-500" />
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1 border-b">
                    <span className="font-medium">Is Cubic</span>
                    <span className="flex items-center">
                      {fieldData.isCubic ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <X size={18} className="text-red-500" />
                      )}
                    </span>
                  </div>
                  
                  {fieldData.periodLength && (
                    <div className="flex justify-between items-center py-1 border-b">
                      <span className="font-medium">Period Length</span>
                      <span>{fieldData.periodLength}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Roots</CardTitle>
                <CardDescription>Numerical approximation of the roots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fieldData.roots.map((root, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b">
                      <span className="font-medium">Root {index + 1}</span>
                      <span>{formatComplex(root.real, root.imag)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="trace-sequence">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span>Trace Sequence</span>
                    {fieldData.periodLength && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Period: {fieldData.periodLength}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>n</TableHead>
                          <TableHead>Tr(A^n)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fieldData.traceSequence.map((trace, index) => (
                          <TableRow key={index}>
                            <TableCell>{index}</TableCell>
                            <TableCell>{trace}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="explanation">
                <AccordionTrigger>Mathematical Background</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 text-sm">
                    <p>
                      A cubic field is a number field of degree 3 over the rational numbers. It can be represented as Q(α) where α is a cubic irrational, i.e., a root of an irreducible cubic polynomial with rational coefficients.
                    </p>
                    
                    <p>
                      <strong>Companion Matrix:</strong> For a cubic polynomial p(x) = x³ + ax² + bx + c, the companion matrix is:
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-md font-mono text-center">
                      A = [<br />
                      &nbsp;&nbsp;0, 0, -c<br />
                      &nbsp;&nbsp;1, 0, -b<br />
                      &nbsp;&nbsp;0, 1, -a<br />
                      ]
                    </div>
                    
                    <p>
                      <strong>Trace Sequence:</strong> The sequence Tr(A^n) for n ≥ 0 follows a linear recurrence relation:
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-md font-mono">
                      Tr(A^n) = a·Tr(A^(n-1)) - b·Tr(A^(n-2)) + c·Tr(A^(n-3))
                    </div>
                    
                    <p>
                      <strong>Periodicity:</strong> For cubic irrationals, this trace sequence is eventually periodic modulo some integer. The period length is related to the structure of the cubic field.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
};

export default CubicFieldExplorer;
