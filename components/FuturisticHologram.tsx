'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LayerMaterial, Fresnel, Noise, Depth } from 'lamina';
import { EffectComposer, Bloom, ChromaticAberration, Glitch, GodRays } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface HolographicDisplayProps {
  theme?: 'heat' | 'eq' | 'saturation' | 'pitch' | 'verb';
  variant?: 'fireOrb' | 'lighterFlame' | 'floatingMatch' | 'abstractHeat' | 'heatWave';
  intensity?: number;
  audioIntensity?: number;
}

function HologramObject({ theme = 'heat', variant = 'fireOrb', intensity = 1, audioIntensity = 0 }: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const sunRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.18;
      const pulse = Math.sin(state.clock.elapsedTime * 1.4) * 0.1 * intensity + audioIntensity * 0.2;
      coreRef.current.scale.setScalar(0.85 + pulse);
    }
  });

  const color = theme === 'heat' ? '#FF4500' : theme === 'eq' ? '#00F0FF' : theme === 'saturation' ? '#FF00AA' : '#FFD700';

  const HoloMaterial = () => (
    <LayerMaterial color={color} emissive={color} emissiveIntensity={0.25 * intensity}>
      <Fresnel />
      <Noise scale={3.5} />
      <Depth />
    </LayerMaterial>
  );

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2.25]} />
        <HoloMaterial />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.28, 1]} />
        <meshPhongMaterial color="#fff" emissive={color} emissiveIntensity={1.1 * intensity + audioIntensity * 0.8} shininess={110} transparent opacity={0.45} />
      </mesh>

      <mesh rotation={[1.5, 0, 0]}>
        <torusGeometry args={[2.75, 0.032, 16, 150]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {(variant === 'fireOrb' || variant === 'heatWave' || theme === 'heat') && (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={90} array={new Float32Array(270).map(() => (Math.random() - 0.5) * 4.5)} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.04 * intensity} color={color} transparent opacity={0.9} sizeAttenuation depthWrite={false} />
        </points>
      )}

      {(variant === 'heatWave' || theme === 'heat') && (
        <mesh>
          <planeGeometry args={[16, 16, 80, 80]} />
          <meshPhongMaterial color="#0A0A0F" emissive="#1A0500" emissiveIntensity={0.45 * intensity} shininess={2} transparent opacity={0.55} />
        </mesh>
      )}

      <mesh ref={sunRef} position={[0, 10, -15]} visible={false}>
        <sphereGeometry args={[1.5]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export default function FuturisticHologram({ theme = 'heat', variant = 'fireOrb', intensity = 1.25, audioIntensity = 0 }: HolographicDisplayProps) {
  return (
    <div className="w-full h-[540px] md:h-[680px] relative rounded-3xl overflow-hidden border border-white/10">
      <Canvas camera={{ position: [0, 2.5, 7.5], fov: 36 }} style={{ background: 'transparent' }} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.08} />
        <pointLight position={[4, 16, 4]} intensity={1.5} color="#fff" />
        <pointLight position={[-4, -1, -6]} intensity={0.55} color={theme === 'heat' ? '#FF4500' : '#00F0FF'} />

        <HologramObject theme={theme} variant={variant} intensity={intensity} audioIntensity={audioIntensity} />

        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.08} luminanceSmoothing={0.7} height={550} intensity={2.0 * intensity} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0028 * intensity, 0.0018 * intensity]} />
          <Glitch delay={[0.6, 3.8]} duration={[0.12, 0.5]} strength={[0.12, 0.5]} mode="sporadic" active />
          <GodRays sun={null} blendFunction={BlendFunction.Screen} samples={70} density={0.97} decay={0.88} weight={0.45 * intensity} exposure={0.65} clampMax={1} />
        </EffectComposer>

        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} autoRotate autoRotateSpeed={0.15} minDistance={2.8} maxDistance={15} />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[4.5px] text-white/20 pointer-events-none z-10 font-mono">
        DRAG • {variant.toUpperCase().replace(/([A-Z])/g, ' $1').trim()} • LAMINA + GODRAYS + AUDIO REACTIVE • SOTA
      </div>
    </div>
  );
}