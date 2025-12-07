
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GlassCard } from './GlassCard';
import { Box, Layers, Rotate3d, MousePointer } from 'lucide-react';

export const DeviceVisualizer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    // Transparent background to blend with app
    scene.background = null; 

    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // --- LIGHTS (NEON) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00FFFF, 2, 50);
    cyanLight.position.set(10, 10, 10);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xFF00FF, 2, 50);
    magentaLight.position.set(-10, -10, 10);
    scene.add(magentaLight);

    // --- PROCEDURAL PHONE MODEL ---
    const phoneGroup = new THREE.Group();
    
    // Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1A1F3A,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.2, // Glass-like
      transparent: true,
      opacity: 0.9
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x00FFFF,
      metalness: 1.0,
      roughness: 0.3,
    });

    const screenMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });

    const activeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00FF41,
      emissive: 0x00FF41,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });

    // 1. Body (OnePlus 7 Pro approx shape)
    const bodyGeometry = new THREE.BoxGeometry(4, 8.5, 0.5);
    const bodyMesh = new THREE.Mesh(bodyGeometry, glassMaterial);
    bodyMesh.name = "Chassis";
    phoneGroup.add(bodyMesh);

    // 2. Wireframe Overlay (Holographic Effect)
    const wireframe = new THREE.WireframeGeometry(bodyGeometry);
    const line = new THREE.LineSegments(wireframe);
    // @ts-ignore - LineBasicMaterial typing
    line.material.depthTest = false;
    // @ts-ignore
    line.material.opacity = 0.1;
    // @ts-ignore
    line.material.transparent = true;
    // @ts-ignore
    line.material.color = new THREE.Color(0x00FFFF);
    phoneGroup.add(line);

    // 3. Screen (Curved-ish representation via simple plane slightly forward)
    const screenGeometry = new THREE.PlaneGeometry(3.8, 8.3);
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.z = 0.26;
    screenMesh.name = "AMOLED Display";
    phoneGroup.add(screenMesh);

    // 4. Pop-up Camera Module
    const popupGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.4);
    const popupMesh = new THREE.Mesh(popupGeometry, frameMaterial);
    popupMesh.position.set(-1, 4.3, 0); // Top left-ish
    popupMesh.name = "Pop-up Camera";
    phoneGroup.add(popupMesh);

    // 5. Battery (Internal visualization - Ghost)
    const batteryGeometry = new THREE.BoxGeometry(2.5, 5, 0.2);
    const batteryMaterial = new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true, transparent: true, opacity: 0.3 });
    const batteryMesh = new THREE.Mesh(batteryGeometry, batteryMaterial);
    batteryMesh.position.z = 0;
    batteryMesh.name = "Battery (4000mAh)";
    phoneGroup.add(batteryMesh);

    scene.add(phoneGroup);
    setLoading(false);

    // --- CONTROLS ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;

    // --- INTERACTION (RAYCASTER) ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // --- ANIMATION LOOP ---
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();

      // Auto rotation if not interacting
      phoneGroup.rotation.y += 0.002;

      // Raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(phoneGroup.children);

      if (intersects.length > 0) {
        // Find first mesh that isn't a line
        const hit = intersects.find(i => i.object.type === 'Mesh');
        if (hit) {
          const object = hit.object as THREE.Mesh;
          setHoveredPart(object.name);
          
          // Temporary highlight effect (this is simple; for prod, swap materials properly)
           // @ts-ignore
          if (object.material.emissive) {
             // @ts-ignore
            object.material.emissiveIntensity = 0.8;
          }
        } else {
          setHoveredPart(null);
        }
      } else {
        setHoveredPart(null);
        // Reset intensities
        phoneGroup.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
             // @ts-ignore
            if (child.material.emissive) {
               // @ts-ignore
              child.material.emissiveIntensity = 0.5; // Back to base
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="h-full w-full p-2 overflow-y-auto custom-scrollbar flex flex-col">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col pb-4">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4 shrink-0">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
              DEVICE <span className="text-neon-cyan text-glow">VISUALIZER</span>
            </h2>
            <p className="text-text-comment font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <Box size={12} className="text-neon-magenta" />
              Holographic Component Inspector
            </p>
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-mono text-text-secondary flex items-center gap-2">
               <Rotate3d size={14} className="text-neon-cyan" /> Drag to Rotate
             </div>
             <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-mono text-text-secondary flex items-center gap-2">
               <MousePointer size={14} className="text-neon-magenta" /> Hover to Inspect
             </div>
          </div>
        </div>

        {/* 3D Canvas Container */}
        <GlassCard glowColor="cyan" className="flex-1 relative overflow-hidden p-0 border-neon-cyan/30">
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-deep z-20">
               <div className="text-neon-cyan font-mono animate-pulse">Initializing Neural Renderer...</div>
            </div>
          )}

          {/* Hover Info Overlay */}
          <div className={`absolute top-8 left-8 z-10 transition-all duration-300 ${hoveredPart ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="p-4 bg-deep/80 backdrop-blur-md border border-neon-cyan/50 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.2)]">
              <div className="text-[10px] text-neon-cyan uppercase font-bold tracking-widest mb-1">Component Detected</div>
              <div className="text-2xl font-black text-white">{hoveredPart}</div>
              <div className="flex items-center gap-2 mt-2">
                 <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
                 <span className="text-xs text-text-secondary font-mono">Status: INTEGRITY_OK</span>
              </div>
            </div>
          </div>

          {/* Canvas Mount Point */}
          <div ref={mountRef} className="w-full h-full cursor-move" />
          
          {/* Decorative Overlay */}
          <div className="absolute bottom-4 right-4 pointer-events-none">
             <Layers className="text-white/10 w-24 h-24" />
          </div>

        </GlassCard>

      </div>
    </div>
  );
};
