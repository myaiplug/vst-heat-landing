'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

function TrippyMaterial({ settings }: any) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: settings.intensity },
        speed: { value: settings.speed },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform float speed;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv;
          float glitch = sin(time * 15.0 * speed) * intensity * 0.03;
          uv.x += glitch;
          float r = 0.5 + 0.5 * sin(time * 2.0 + uv.x * 20.0);
          float g = 0.2 + 0.3 * sin(time * 3.0 + uv.y * 15.0);
          float b = 0.8 + 0.2 * sin(time * 4.0 + uv.x * 10.0);
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.intensity.value = settings.intensity;
      materialRef.current.uniforms.speed.value = settings.speed;
    }
  });

  return <mesh material={shaderMaterial}><planeGeometry args={[5, 2.8]} /></mesh>;
}

export function WebGLPreview({ file, settings }: any) {
  return (
    <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <TrippyMaterial settings={settings} />
        <EffectComposer>
          <Bloom intensity={1.8 * settings.intensity} />
          <ChromaticAberration offset={[0.003 * settings.intensity, 0.002]} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
