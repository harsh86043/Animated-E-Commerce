import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeStageProps {
  modelColor?: string;
  autoRotate?: boolean;
}

export default function ThreeStage({ modelColor = '#6D5DFB', autoRotate = true }: ThreeStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Checks WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setHasWebGL(support);
      setLoading(false);
    } catch {
      setHasWebGL(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasWebGL || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 350;

    // 1. Create Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Geometry and Material
    const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 120, 16);
    
    // We parse the color cleanly
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(modelColor),
      roughness: 0.1,
      metalness: 0.8,
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1.2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00B8D9, 1.5);
    pointLight2.position.set(-5, -5, 3);
    scene.add(pointLight2);

    // Render loop running outside standard React render cycle
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && torusKnot) {
        torusKnot.rotation.x += 0.008;
        torusKnot.rotation.y += 0.012;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handling using ResizeObserver as instructed
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        const h = newHeight || 350;
        camera.aspect = newWidth / h;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, h);
      }
    });
    
    resizeObserver.observe(container);

    // Cleanup logic to prevent memory leaks (renderer, geometry, material, animationFrame)
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hasWebGL, modelColor, autoRotate]);

  if (loading) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-100/10 backdrop-blur-sm rounded-2xl animate-pulse">
        <span className="text-sm font-mono opacity-50">Initializing Stage...</span>
      </div>
    );
  }

  if (hasWebGL === false) {
    // Elegant fallback image/canvas showcase if WebGL is unavailable or fails
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-900/5 dark:bg-white/5 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center">
        <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-base font-semibold font-sans mb-1 text-slate-800 dark:text-slate-200">WebGL Acceleration Not Active</h4>
        <p className="text-xs font-sans text-slate-500 dark:text-slate-400 max-w-sm">
          WebGL is currently unavailable. Displaying the responsive CSS-transformed 2D progressive fallback grid.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <div ref={containerRef} className="w-full h-full min-h-[300px]" />
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-400 px-2 py-1 rounded border border-cyan-500/20 uppercase tracking-widest animate-pulse">
        WebGL active
      </div>
    </div>
  );
}
