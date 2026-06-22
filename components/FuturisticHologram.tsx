'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Glitch, GodRays } from '@react-three/postprocessing';
import { BlendFunction, Resizer, KernelSize } from 'postprocessing';

interface HolographicDisplayProps {
  theme?: 'heat' | 'eq' | 'saturation' | 'pitch' | 'verb';
  variant?: 'fireOrb' | 'lighterFlame' | 'floatingMatch' | 'abstractHeat' | 'heatWave';
  intensity?: number;
}

function EmberParticles({ count = 70, color = '#FF4500', intensity = 1 }: { count?: number; color?: string; intensity?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const { pos, velocities } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      p[i] = (Math.random() - 0.5) * 4;
      p[i + 1] = Math.random() * 2.5 - 1.2;
      p[i + 2] = (Math.random() - 0.5) * 4;
      v[i] = (Math.random() - 0.5) * 0.025;
      v[i + 1] = Math.random() * 0.035 + 0.012;
      v[i + 2] = (Math.random() - 0.5) * 0.025;
    }
    return { pos: p, velocities: v };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    return geo;
  }, [pos, velocities]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const velAttr = pointsRef.current.geometry.attributes.velocity as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const velArr = velAttr.array as Float32Array;

    for (let i = 0; i < posArr.length; i += 3) {
      posArr[i] += velArr[i] * intensity;
      posArr[i + 1] += velArr[i + 1] * intensity;
      posArr[i + 2] += velArr[i + 2] * intensity;

      if (posArr[i + 1] > 3.5 || Math.random() < 0.006) {
        posArr[i] = (Math.random() - 0.5) * 4;
        posArr[i + 1] = -1.3 + Math.random() * 0.6;
        posArr[i + 2] = (Math.random() - 0.5) * 4;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.04 * intensity} color={color} transparent opacity={0.95} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function HeatwaveGround({ intensity = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      const pos = (meshRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        const x = pos[i];
        const z = pos[i + 2];
        pos[i + 1] = Math.sin(x * 3.2 + state.clock.elapsedTime * 2.1) * 0.09 * intensity +
                     Math.sin(z * 2.8 + state.clock.elapsedTime * 1.7) * 0.07 * intensity +
                     Math.sin((x + z) * 1.5 + state.clock.elapsedTime * 3) * 0.04 * intensity;
      }
      (meshRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -2.4, 0]}>
      <planeGeometry args={[14, 14, 48, 48]} />
      <meshPhongMaterial 
        color="#0F0F12" 
        emissive="#220000" 
        emissiveIntensity={0.35 * intensity}
        shininess={5}
        transparent
        opacity={0.65}
      />
    </mesh>
  );
}

function HologramObject({ theme = 'heat', variant = 'fireOrb', intensity = 1 }: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.11;
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.22;
      coreRef.current.scale.setScalar(0.88 + Math.sin(state.clock.elapsedTime * 1.6) * 0.1 * intensity);
    }
  });

  const color = theme === 'heat' ? '#FF4500' : theme === 'eq' ? '#00F0FF' : theme === 'saturation' ? '#FF00AA' : '#FFD700';

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2.15]} />
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.3 * intensity} shininess={130} transparent opacity={0.1} wireframe />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshPhongMaterial color="#fff" emissive={color} emissiveIntensity={0.95 * intensity} shininess={95} transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[1.55, 0, 0]}>
        <torusGeometry args={[2.65, 0.028, 16, 130]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>

      {(variant === 'fireOrb' || variant === 'heatWave' || theme === 'heat') && (
        <EmberParticles count={theme === 'heat' ? 85 : 50} color={color} intensity={intensity} />
      )}

      {(variant === 'heatWave' || theme === 'heat') && <HeatwaveGround intensity={intensity} />}

      {theme === 'heat' && variant !== 'abstractHeat' && (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={30} array={new Float32Array(90).map(() => (Math.random() - 0.5) * 6)} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.15} color="#555" transparent opacity={0.12} sizeAttenuation depthWrite={false} />
        </points>
      )}
    </group>
  );
}

export default function FuturisticHologram({ theme = 'heat', variant = 'fireOrb', intensity = 1.15 }: HolographicDisplayProps) {
  return (
    <div className="w-full h-[500px] md:h-[620px] relative rounded-3xl overflow-hidden border border-white/10 bg-black/20">
      <Canvas
        camera={{ position: [0, 2, 7], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.12} />
        <pointLight position={[6, 14, 6]} intensity={1.3} color="#fff" />
        <pointLight position={[-6, -3, -8]} intensity={0.5} color={theme === 'heat' ? '#FF4500' : '#00F0FF'} />

        <HologramObject theme={theme} variant={variant} intensity={intensity} />

        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.12} luminanceSmoothing={0.8} height={450} intensity={1.6 * intensity} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0022 * intensity, 0.0014 * intensity]} />
          <Glitch 
            delay={[1.2, 3.5]} 
            duration={[0.2, 0.6]} 
            strength={[0.2, 0.6]} 
            mode="sporadic" 
            active 
          />
        </EffectComposer>

        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} autoRotate autoRotateSpeed={0.2} minDistance={3.2} maxDistance={13} />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[3.5px] text-white/30 pointer-events-none z-10 font-mono">
        DRAG • {variant.toUpperCase().replace(/([A-Z])/g, ' $1').trim()} • VJ/X HOLOGRAPHIC SYSTEM • GLITCH + GODRAY ENERGY
      </div>
    </div>
  );
}