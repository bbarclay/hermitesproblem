'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, SkipForward, ChevronRight } from 'lucide-react';
import SubtractiveAlgorithmChart from './SubtractiveAlgorithmChart';

interface SubtractiveAlgorithmVisualizerProps {
  initialAlpha?: number;
  className?: string;
}

export interface IterationState {
  iteration: number;
  v1: number;
  v2: number;
  v3: number;
  a1: number;
  a2: number;
  r1: number;
  r2: number;
  rMax: number;
  maxIndex: number;
}

const SubtractiveAlgorithmVisualizer: React.FC<SubtractiveAlgorithmVisualizerProps> = ({
  initialAlpha = Math.pow(2, 1/3), // Default to cube root of 2
  className = ''
}) => {
  const [alpha, setAlpha] = useState(initialAlpha);
  const [maxIterations, setMaxIterations] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [iterations, setIterations] = useState<IterationState[]>([]);
  const [periodDetected, setPeriodDetected] = useState<number | null>(null);
  const [periodStart, setPeriodStart] = useState<number | null>(null);

  // Run the subtractive algorithm
  const runSubtractiveAlgorithm = (alpha: number, maxIter: number) => {
    const results: IterationState[] = [];
    const history: [number, number, number][] = [];
    let v1 = alpha;
    let v2 = alpha * alpha;
    let v3 = 1;

    // Add initial state
    results.push({
      iteration: 0,
      v1,
      v2,
      v3,
      a1: 0,
      a2: 0,
      r1: 0,
      r2: 0,
      rMax: 0,
      maxIndex: 0
    });

    history.push([v1, v2, v3]);

    for (let i = 1; i <= maxIter; i++) {
      // Compute integer parts
      const a1 = Math.floor(v1 / v3);
      const a2 = Math.floor(v2 / v3);

      // Calculate remainders
      const r1 = v1 - a1 * v3;
      const r2 = v2 - a2 * v3;

      // Determine maximum remainder
      const maxIndex = r1 >= r2 ? 1 : 2;
      const rMax = maxIndex === 1 ? r1 : r2;

      // Add current state before update
      results.push({
        iteration: i,
        v1,
        v2,
        v3,
        a1,
        a2,
        r1,
        r2,
        rMax,
        maxIndex
      });

      // Update values
      v1 = r1;
      v2 = r2;
      v3 = rMax;

      // Normalize to prevent overflow
      const norm = Math.sqrt(v1*v1 + v2*v2 + v3*v3);
      v1 /= norm;
      v2 /= norm;
      v3 /= norm;

      // Check for periodicity
      for (let j = 0; j < i; j++) {
        const [prevV1, prevV2, prevV3] = history[j];

        // Calculate distance in normalized space
        const dist = Math.sqrt(
          Math.pow(v1 - prevV1, 2) +
          Math.pow(v2 - prevV2, 2) +
          Math.pow(v3 - prevV3, 2)
        );

        // If points are very close
        if (dist < 0.001) {
          setPeriodDetected(i - j);
          setPeriodStart(j);
          return results;
        }
      }

      history.push([v1, v2, v3]);
    }

    setPeriodDetected(null);
    setPeriodStart(null);
    return results;
  };

  // Run algorithm when alpha changes
  useEffect(() => {
    const results = runSubtractiveAlgorithm(alpha, maxIterations);
    setIterations(results);
    setCurrentStep(0);
  }, [alpha, maxIterations]);

  // Animation effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= iterations.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, iterations.length]);

  // Play/pause animation
  const togglePlay = () => {
    if (currentStep >= iterations.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Reset animation
  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  // Skip to end
  const skipToEnd = () => {
    setIsPlaying(false);
    setCurrentStep(iterations.length - 1);
  };

  // Handle alpha input change
  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAlpha(value);
    }
  };

  // Handle max iterations change
  const handleMaxIterationsChange = (value: number[]) => {
    setMaxIterations(value[0]);
  };

  // Get current iteration data
  const currentIteration = iterations[currentStep] || {
    iteration: 0,
    v1: 0,
    v2: 0,
    v3: 0,
    a1: 0,
    a2: 0,
    r1: 0,
    r2: 0,
    rMax: 0,
    maxIndex: 0
  };

  return (
    <div className={`subtractive-algorithm-visualizer ${className} border rounded-lg overflow-hidden`}>
      <div className="p-4 bg-slate-100 border-b">
        <h3 className="text-lg font-semibold mb-2">Subtractive Algorithm Visualizer</h3>
        <p className="text-sm text-gray-600 mb-4">
          Visualize the Subtractive HAPD algorithm for cubic irrationals.
          {periodDetected && (
            <span className="ml-2 text-green-600 font-medium">
              Period detected: {periodDetected}
            </span>
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="alpha-input">Cubic Irrational (α)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="alpha-input"
                type="number"
                step="0.001"
                value={alpha}
                onChange={handleAlphaChange}
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
            <Label>Max Iterations: {maxIterations}</Label>
            <Slider
              value={[maxIterations]}
              min={5}
              max={50}
              step={1}
              onValueChange={handleMaxIterationsChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePlay}
            className="flex items-center gap-1"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetAnimation}
            className="flex items-center gap-1"
          >
            <RotateCcw size={16} />
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={skipToEnd}
            className="flex items-center gap-1"
          >
            <SkipForward size={16} />
            Skip
          </Button>

          <div className="flex-1 mx-4">
            <Slider
              value={[currentStep]}
              min={0}
              max={iterations.length - 1}
              step={1}
              onValueChange={(value: number[]) => setCurrentStep(value[0])}
              disabled={iterations.length <= 1}
            />
            <div className="text-xs text-center mt-1">
              Iteration: {currentStep} / {iterations.length - 1}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="md:col-span-2">
          <SubtractiveAlgorithmChart
            iterations={iterations}
            currentStep={currentStep}
            periodDetected={periodDetected}
            periodStart={periodStart}
          />
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Current Iteration: {currentIteration.iteration}</CardTitle>
              <CardDescription>Step-by-step algorithm execution</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-red-100 p-2 rounded text-center">
                    <div className="font-semibold">v₁</div>
                    <div>{currentIteration.v1.toFixed(4)}</div>
                  </div>
                  <div className="bg-blue-100 p-2 rounded text-center">
                    <div className="font-semibold">v₂</div>
                    <div>{currentIteration.v2.toFixed(4)}</div>
                  </div>
                  <div className="bg-green-100 p-2 rounded text-center">
                    <div className="font-semibold">v₃</div>
                    <div>{currentIteration.v3.toFixed(4)}</div>
                  </div>
                </div>

                {currentIteration.iteration > 0 && (
                  <>
                    <div className="flex items-center gap-2 text-gray-600">
                      <ChevronRight size={16} />
                      <span>Compute integer parts</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-semibold">a₁ = ⌊v₁/v₃⌋</div>
                        <div>{currentIteration.a1}</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-semibold">a₂ = ⌊v₂/v₃⌋</div>
                        <div>{currentIteration.a2}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <ChevronRight size={16} />
                      <span>Calculate remainders</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-semibold">r₁ = v₁ - a₁·v₃</div>
                        <div>{currentIteration.r1.toFixed(4)}</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-semibold">r₂ = v₂ - a₂·v₃</div>
                        <div>{currentIteration.r2.toFixed(4)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <ChevronRight size={16} />
                      <span>Find maximum remainder</span>
                    </div>

                    <div className="bg-yellow-100 p-2 rounded text-center">
                      <div className="font-semibold">
                        r<sub>max</sub> = r<sub>{currentIteration.maxIndex}</sub>
                      </div>
                      <div>{currentIteration.rMax.toFixed(4)}</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 border-t">
        <h4 className="font-semibold mb-2">Algorithm Trace</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Iter</TableHead>
                <TableHead>v₁</TableHead>
                <TableHead>v₂</TableHead>
                <TableHead>v₃</TableHead>
                <TableHead>a₁</TableHead>
                <TableHead>a₂</TableHead>
                <TableHead>r₁</TableHead>
                <TableHead>r₂</TableHead>
                <TableHead>r<sub>max</sub></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iterations.slice(0, currentStep + 1).map((iter) => (
                <TableRow
                  key={iter.iteration}
                  className={iter.iteration === currentStep ? 'bg-blue-50' : ''}
                >
                  <TableCell>{iter.iteration}</TableCell>
                  <TableCell>{iter.v1.toFixed(4)}</TableCell>
                  <TableCell>{iter.v2.toFixed(4)}</TableCell>
                  <TableCell>{iter.v3.toFixed(4)}</TableCell>
                  <TableCell>{iter.iteration > 0 ? iter.a1 : '-'}</TableCell>
                  <TableCell>{iter.iteration > 0 ? iter.a2 : '-'}</TableCell>
                  <TableCell>{iter.iteration > 0 ? iter.r1.toFixed(4) : '-'}</TableCell>
                  <TableCell>{iter.iteration > 0 ? iter.r2.toFixed(4) : '-'}</TableCell>
                  <TableCell>{iter.iteration > 0 ? iter.rMax.toFixed(4) : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SubtractiveAlgorithmVisualizer;
