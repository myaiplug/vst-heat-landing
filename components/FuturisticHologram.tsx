'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface HolographicDisplayProps {
  theme?: 'heat' | 'eq' | 'saturation' | 'pitch' | 'verb';
  intensity?: number;
}

function HologramObject({ theme = 'heat', intensity = 1 }: { theme?: string; intensity?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.4;
      innerRef.current.scale.setScalar(0.85 + Math.sin(state.clock.elapsedTime * 2) * 0.05 * intensity);
    }
  });

  const getColor = () => {
    switch (theme) {
      case 'heat': return '#FF4500';
      case 'eq': return '#00F0FF';
      case 'saturation': return '#FF00AA';
      case 'pitch': return '#FFD700';
      case 'verb': return '#00F0FF';
      default: return '#00F0FF';
    }
  };

  const color = getColor();

  return (
    <group ref={groupRef}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.8]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4 * intensity}
          shininess={100}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshPhongMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={0.8 * intensity}
          shininess={80}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <torusGeometry args={[2.4, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI * 0.3, Math.PI * 0.2, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>

      <Stars 
        radius={4} 
        depth={10} 
        count={theme === 'heat' ? 80 : 40} 
        factor={0.6} 
        saturation={0} 
        fade 
        speed={0.5} 
      />
    </group>
  );
}

export default function FuturisticHologram({ theme = 'heat', intensity = 1 }: HolographicDisplayProps) {
  return (
    <div className="w-full h-[420px] md:h-[520px] relative">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.4} color={theme === 'heat' ? '#FF4500' : '#00F0FF'} />

        <HologramObject theme={theme} intensity={intensity} />

        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            height={300} 
            intensity={1.2 * intensity} 
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={[0.0015 * intensity, 0.001 * intensity]} 
          />
        </EffectComposer>

        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={true}
          autoRotate 
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI * 0.4}
          maxPolarAngle={Math.PI * 1.6}
        />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[2px] text-white/40 pointer-events-none">
        DRAG TO ORBIT • ANTI-GRAVITY HOLOGRAPHIC DISPLAY
      </div>
    </div>
  );
}