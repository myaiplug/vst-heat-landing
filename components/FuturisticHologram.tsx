'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface HolographicDisplayProps {
  theme?: 'heat' | 'eq' | 'saturation' | 'pitch' | 'verb';
  variant?: 'fireOrb' | 'lighterFlame' | 'floatingMatch' | 'abstractHeat' | 'heatWave';
  intensity?: number;
}

function EmberParticles({ count = 60, color = '#FF4500', intensity = 1 }: { count?: number; color?: string; intensity?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 3.5;
      pos[i + 1] = Math.random() * 2 - 1;
      pos[i + 2] = (Math.random() - 0.5) * 3.5;
      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = Math.random() * 0.03 + 0.01;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { pos, velocities };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.pos, 3));
    geo.setAttribute('velocity', new THREE.BufferAttribute(positions.velocities, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const velAttr = pointsRef.current.geometry.attributes.velocity as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const velArray = velAttr.array as Float32Array;

    for (let i = 0; i < posArray.length; i += 3) {
      posArray[i] += velArray[i] * intensity;
      posArray[i + 1] += velArray[i + 1] * intensity;
      posArray[i + 2] += velArray[i + 2] * intensity;

      if (posArray[i + 1] > 3 || Math.random() < 0.005) {
        posArray[i] = (Math.random() - 0.5) * 3.5;
        posArray[i + 1] = -1 + Math.random() * 0.5;
        posArray[i + 2] = (Math.random() - 0.5) * 3.5;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035 * intensity}
        color={color}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function HeatwaveGround() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      const positions = (meshRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(x * 2 + state.clock.elapsedTime * 1.5) * 0.08 + 
                           Math.sin(z * 1.8 + state.clock.elapsedTime * 1.2) * 0.06;
      }
      (meshRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.48, 0, 0]} position={[0, -2.2, 0]}>
      <planeGeometry args={[12, 12, 32, 32]} />
      <meshPhongMaterial 
        color="#1A1A20" 
        emissive="#330000" 
        emissiveIntensity={0.3}
        shininess={10}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function HologramObject({ theme = 'heat', variant = 'fireOrb', intensity = 1 }: { theme?: string; variant?: string; intensity?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      coreRef.current.scale.setScalar(0.9 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08 * intensity);
    }
  });

  const color = theme === 'heat' ? '#FF4500' : theme === 'eq' ? '#00F0FF' : theme === 'saturation' ? '#FF00AA' : '#FFD700';

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2.1]} />
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.35 * intensity} shininess={120} transparent opacity={0.12} wireframe />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshPhongMaterial color="#fff" emissive={color} emissiveIntensity={0.9 * intensity} shininess={90} transparent opacity={0.55} />
      </mesh>

      <mesh rotation={[1.6, 0, 0]}>
        <torusGeometry args={[2.6, 0.025, 16, 120]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {(variant === 'fireOrb' || variant === 'heatWave' || theme === 'heat') && (
        <EmberParticles count={theme === 'heat' ? 75 : 45} color={color} intensity={intensity} />
      )}

      {(variant === 'heatWave' || theme === 'heat') && <HeatwaveGround />}

      {theme === 'heat' && variant !== 'abstractHeat' && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={25}
              array={new Float32Array(Array.from({ length: 75 }, () => (Math.random() - 0.5) * 5))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.12} color="#666" transparent opacity={0.15} sizeAttenuation depthWrite={false} />
        </points>
      )}
    </group>
  );
}

export default function FuturisticHologram({ theme = 'heat', variant = 'fireOrb', intensity = 1.1 }: HolographicDisplayProps) {
  return (
    <div className="w-full h-[480px] md:h-[580px] relative rounded-3xl overflow-hidden border border-white/10">
      <Canvas
        camera={{ position: [0, 1.5, 6.5], fov: 42 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[8, 12, 8]} intensity={1.1} color="#ffffff" />
        <pointLight position={[-8, -4, -6]} intensity={0.6} color={theme === 'heat' ? '#FF4500' : '#00F0FF'} />

        <HologramObject theme={theme} variant={variant} intensity={intensity} />

        <EffectComposer>
          <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.85} height={400} intensity={1.4 * intensity} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.002 * intensity, 0.0012 * intensity]} />
        </EffectComposer>

        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} autoRotate autoRotateSpeed={0.25} minDistance={3.5} maxDistance={12} />
      </Canvas>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] tracking-[3px] text-white/35 pointer-events-none z-10">
        DRAG TO ROTATE • {variant.toUpperCase().replace(/([A-Z])/g, ' $1')} • ANTI-GRAVITY HOLOGRAPHIC SYSTEM
      </div>
    </div>
  );
}