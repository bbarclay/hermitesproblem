'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Play, Pause, RotateCcw, SkipForward, 
  ZoomIn, ZoomOut, Maximize2, Minimize2 
} from 'lucide-react';

interface ProjectiveSpaceVisualizerProps {
  initialAlpha?: number;
  className?: string;
}

const ProjectiveSpaceVisualizer: React.FC<ProjectiveSpaceVisualizerProps> = ({ 
  initialAlpha = Math.pow(2, 1/3), // Default to cube root of 2
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.Line | null>(null);
  const frameIdRef = useRef<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [alpha, setAlpha] = useState(initialAlpha);
  const [iterations, setIterations] = useState<number[]>([]);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [maxIterations, setMaxIterations] = useState(20);
  const [periodDetected, setPeriodDetected] = useState<number | null>(null);

  // HAPD algorithm implementation
  const runHAPDAlgorithm = (alpha: number, maxIter: number) => {
    const points: THREE.Vector3[] = [];
    const history: [number, number, number][] = [];
    let v1 = alpha;
    let v2 = alpha * alpha;
    let v3 = 1;
    
    // Add initial point
    points.push(new THREE.Vector3(v1, v2, v3));
    history.push([v1, v2, v3]);
    
    for (let i = 0; i < maxIter; i++) {
      // Compute integer parts
      const a1 = Math.floor(v1 / v3);
      const a2 = Math.floor(v2 / v3);
      
      // Calculate remainders
      const r1 = v1 - a1 * v3;
      const r2 = v2 - a2 * v3;
      
      // Update values
      const newV3 = v3 - a1 * r1 - a2 * r2;
      v1 = r1;
      v2 = r2;
      v3 = newV3;
      
      // Normalize to prevent overflow
      const norm = Math.sqrt(v1*v1 + v2*v2 + v3*v3);
      v1 /= norm;
      v2 /= norm;
      v3 /= norm;
      
      // Add point to trajectory
      points.push(new THREE.Vector3(v1, v2, v3));
      history.push([v1, v2, v3]);
      
      // Check for periodicity
      for (let j = 0; j < i; j++) {
        const [prevV1, prevV2, prevV3] = history[j];
        const dotProduct = v1 * prevV1 + v2 * prevV2 + v3 * prevV3;
        const angle = Math.acos(Math.min(1, Math.max(-1, dotProduct)));
        
        // If points are very close in projective space
        if (angle < 0.01) {
          setPeriodDetected(i - j);
          return points;
        }
      }
    }
    
    setPeriodDetected(null);
    return points;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 2;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;
    
    // Add coordinate axes
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
    
    // Add projective plane at infinity
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x2563eb, 
      transparent: true, 
      opacity: 0.1,
      side: THREE.DoubleSide 
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    scene.add(plane);
    
    // Add grid
    const gridHelper = new THREE.GridHelper(2, 20);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);
  
  // Run algorithm when alpha changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Remove previous points and lines
    if (pointsRef.current) {
      sceneRef.current.remove(pointsRef.current);
    }
    if (linesRef.current) {
      sceneRef.current.remove(linesRef.current);
    }
    
    // Run algorithm
    const points = runHAPDAlgorithm(alpha, maxIterations);
    setIterations(Array.from({ length: points.length }, (_, i) => i));
    setCurrentIteration(0);
    
    // Create points geometry
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    
    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create points material
    const pointsMaterial = new THREE.PointsMaterial({ 
      color: 0xe11d48, 
      size: 0.05,
      sizeAttenuation: true
    });
    
    // Create points
    const pointsObject = new THREE.Points(pointsGeometry, pointsMaterial);
    sceneRef.current.add(pointsObject);
    pointsRef.current = pointsObject;
    
    // Create line geometry
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create line material
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x64748b });
    
    // Create line
    const line = new THREE.Line(lineGeometry, lineMaterial);
    sceneRef.current.add(line);
    linesRef.current = line;
    
  }, [alpha, maxIterations]);
  
  // Update visualization based on current iteration
  useEffect(() => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const pointsGeometry = pointsRef.current.geometry as THREE.BufferGeometry;
    const lineGeometry = linesRef.current.geometry as THREE.BufferGeometry;
    
    const pointsPositions = pointsGeometry.attributes.position.array as Float32Array;
    const linePositions = lineGeometry.attributes.position.array as Float32Array;
    
    // Show only up to current iteration
    for (let i = 0; i < pointsPositions.length / 3; i++) {
      const visible = i <= currentIteration;
      
      // For points, we set invisible points far away
      if (!visible) {
        pointsPositions[i * 3] = 1000;
        pointsPositions[i * 3 + 1] = 1000;
        pointsPositions[i * 3 + 2] = 1000;
      }
    }
    
    // For lines, we only show connections up to current iteration
    for (let i = 0; i < linePositions.length / 3; i++) {
      const visible = i <= currentIteration;
      
      if (!visible) {
        linePositions[i * 3] = linePositions[(currentIteration) * 3];
        linePositions[i * 3 + 1] = linePositions[(currentIteration) * 3 + 1];
        linePositions[i * 3 + 2] = linePositions[(currentIteration) * 3 + 2];
      }
    }
    
    pointsGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;
    
  }, [currentIteration]);
  
  // Animation effect
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIteration(prev => {
        if (prev >= iterations.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isPlaying, iterations.length]);
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // Play/pause animation
  const togglePlay = () => {
    if (currentIteration >= iterations.length - 1) {
      setCurrentIteration(0);
    }
    setIsPlaying(!isPlaying);
  };
  
  // Reset animation
  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentIteration(0);
  };
  
  // Skip to end
  const skipToEnd = () => {
    setIsPlaying(false);
    setCurrentIteration(iterations.length - 1);
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
  
  // Zoom in/out
  const handleZoom = (zoomIn: boolean) => {
    if (!cameraRef.current) return;
    
    if (zoomIn) {
      cameraRef.current.position.z *= 0.8;
    } else {
      cameraRef.current.position.z *= 1.2;
    }
  };

  return (
    <div className={`projective-space-visualizer ${className} border rounded-lg overflow-hidden`}>
      <div className="p-4 bg-slate-100 border-b">
        <h3 className="text-lg font-semibold mb-2">Projective Space Visualizer</h3>
        <p className="text-sm text-gray-600 mb-4">
          Visualize the HAPD algorithm in projective space for cubic irrationals.
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
              value={[currentIteration]}
              min={0}
              max={iterations.length - 1}
              step={1}
              onValueChange={(value) => setCurrentIteration(value[0])}
              disabled={iterations.length <= 1}
            />
            <div className="text-xs text-center mt-1">
              Iteration: {currentIteration} / {iterations.length - 1}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleZoom(true)}
            className="flex items-center gap-1"
          >
            <ZoomIn size={16} />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleZoom(false)}
            className="flex items-center gap-1"
          >
            <ZoomOut size={16} />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-1"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full h-[400px] bg-gray-900"
      />
      
      <div className="p-4 bg-slate-50 border-t text-sm">
        <p className="mb-2">
          <strong>How to use:</strong> Drag to rotate, scroll to zoom, right-click to pan.
        </p>
        <p>
          <strong>What you're seeing:</strong> The red points represent the trajectory of the HAPD algorithm in projective space. 
          When a point returns close to a previous point, periodicity is detected, indicating a cubic irrational.
        </p>
      </div>
    </div>
  );
};

export default ProjectiveSpaceVisualizer;
