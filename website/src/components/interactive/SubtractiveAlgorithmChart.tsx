'use client';

import React, { useRef, useEffect } from 'react';
import { IterationState } from './SubtractiveAlgorithmVisualizer';

interface SubtractiveAlgorithmChartProps {
  iterations: IterationState[];
  currentStep: number;
  periodDetected: number | null;
  periodStart: number | null;
}

const SubtractiveAlgorithmChart: React.FC<SubtractiveAlgorithmChartProps> = ({
  iterations,
  currentStep,
  periodDetected,
  periodStart
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw visualization
  useEffect(() => {
    if (!canvasRef.current || iterations.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up coordinate system
    const padding = 40;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    // Draw coordinate axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // x-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // y-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Iteration', canvas.width / 2, canvas.height - 10);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Value', 0, 0);
    ctx.restore();
    
    // Find max values for scaling
    let maxVal = 0;
    for (let i = 0; i <= currentStep; i++) {
      const iter = iterations[i];
      maxVal = Math.max(maxVal, iter.v1, iter.v2, iter.v3);
    }
    
    // Scale factor
    const xScale = width / Math.max(20, iterations.length);
    const yScale = height / (maxVal * 1.1);
    
    // Draw grid lines
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = canvas.height - padding - (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
      
      // Add y-axis labels
      ctx.fillStyle = '#666';
      ctx.textAlign = 'right';
      ctx.fillText((i / 10 * maxVal).toFixed(1), padding - 5, y + 4);
    }
    
    // Vertical grid lines
    for (let i = 0; i <= Math.min(20, iterations.length); i++) {
      const x = padding + (i / Math.min(20, iterations.length)) * width;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
      
      // Add x-axis labels
      if (i % 2 === 0) {
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(i.toString(), x, canvas.height - padding + 15);
      }
    }
    
    // Draw period region if detected
    if (periodDetected !== null && periodStart !== null) {
      const startX = padding + periodStart * xScale;
      const endX = padding + (periodStart + periodDetected) * xScale;
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.fillRect(startX, padding, endX - startX, height);
      
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      // Start line
      ctx.beginPath();
      ctx.moveTo(startX, padding);
      ctx.lineTo(startX, canvas.height - padding);
      ctx.stroke();
      
      // End line
      ctx.beginPath();
      ctx.moveTo(endX, padding);
      ctx.lineTo(endX, canvas.height - padding);
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Period label
      ctx.fillStyle = 'rgba(59, 130, 246, 1)';
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`Period: ${periodDetected}`, (startX + endX) / 2, padding - 10);
    }
    
    // Draw v1 line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= currentStep; i++) {
      const iter = iterations[i];
      const x = padding + i * xScale;
      const y = canvas.height - padding - iter.v1 * yScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw v2 line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= currentStep; i++) {
      const iter = iterations[i];
      const x = padding + i * xScale;
      const y = canvas.height - padding - iter.v2 * yScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw v3 line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= currentStep; i++) {
      const iter = iterations[i];
      const x = padding + i * xScale;
      const y = canvas.height - padding - iter.v3 * yScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw current point markers
    if (currentStep > 0) {
      const iter = iterations[currentStep];
      const x = padding + currentStep * xScale;
      
      // v1 marker
      const y1 = canvas.height - padding - iter.v1 * yScale;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y1, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // v2 marker
      const y2 = canvas.height - padding - iter.v2 * yScale;
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y2, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // v3 marker
      const y3 = canvas.height - padding - iter.v3 * yScale;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x, y3, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Draw legend
    const legendX = canvas.width - padding - 100;
    const legendY = padding + 20;
    
    // v1
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(legendX, legendY, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.fillText('v₁', legendX + 10, legendY + 4);
    
    // v2
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(legendX, legendY + 20, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillText('v₂', legendX + 10, legendY + 24);
    
    // v3
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(legendX, legendY + 40, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillText('v₃', legendX + 10, legendY + 44);
    
  }, [currentStep, iterations, periodDetected, periodStart]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-[300px] border rounded bg-white"
    />
  );
};

export default SubtractiveAlgorithmChart;
