'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

interface WebGLPreviewProps {
  file: File;
  settings: {
    speed: number;
    pitch: number;
    effect: string;
    colorGrade: string;
    intensity: number;
  };
}

function VideoWithEffects({ file, settings }: WebGLPreviewProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const { scene } = useThree();

  // Create video element and texture
  useEffect(() => {
    if (!file) return;

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.loop = true;
    video.muted = true; // Preview only
    video.play().catch(() => {});

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    videoRef.current = video;
    textureRef.current = texture;

    // Cleanup
    return () => {
      URL.revokeObjectURL(video.src);
      video.pause();
      texture.dispose();
    };
  }, [file]);

  // Custom trippy shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: null },
        time: { value: 0 },
        intensity: { value: settings.intensity },
        speed: { value: settings.speed },
        effectType: { value: 0 }, // 0 = purple double, 1 = glitch, 2 = chromatic
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float time;
        uniform float intensity;
        uniform float speed;
        uniform float effectType;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          float t = time * speed * 2.0;

          // Double vision / ghosting
          float offset = 0.015 * intensity;
          vec4 color1 = texture2D(map, uv);
          vec4 color2 = texture2D(map, vec2(uv.x + offset, uv.y));

          vec4 baseColor = mix(color1, color2, 0.5);

          // Trippy color shift based on effect
          if (effectType < 0.5) {
            // Purple Double Vision
            baseColor.rgb *= vec3(1.0, 0.6, 1.3);
          } else if (effectType < 1.5) {
            // Glitch / Datamosh style
            float glitch = step(0.98, fract(t * 10.0));
            baseColor.rgb = mix(baseColor.rgb, vec3(0.2, 0.8, 0.9), glitch * intensity * 0.6);
          } else {
            // Chromatic Trippy
            baseColor.r = texture2D(map, uv + vec2(0.01 * intensity, 0.0)).r;
            baseColor.b = texture2D(map, uv - vec2(0.01 * intensity, 0.0)).b;
          }

          // Subtle pulsing glow
          float glow = sin(t * 3.0) * 0.1 * intensity + 1.0;
          gl_FragColor = vec4(baseColor.rgb * glow, 1.0);
        }
      `,
    });
  }, []);

  // Update uniforms and texture
  useFrame((state) => {
    if (meshRef.current && textureRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.time.value = state.clock.elapsedTime;
      mat.uniforms.intensity.value = settings.intensity;
      mat.uniforms.speed.value = settings.speed;

      // Map effect type
      if (settings.effect === 'purple-double') mat.uniforms.effectType.value = 0.0;
      else if (settings.effect === 'datamosh') mat.uniforms.effectType.value = 1.0;
      else mat.uniforms.effectType.value = 2.0;

      mat.uniforms.map.value = textureRef.current;
    }
  });

  // Play/pause sync (can be expanded later)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5.2, 2.9]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

export function WebGLPreview({ file, settings }: WebGLPreviewProps) {
  // Only show video preview for video files
  const isVideo = file.type.startsWith('video/');

  if (!isVideo) {
    return (
      <div className="aspect-video bg-black/80 rounded-3xl flex items-center justify-center text-white/50 border border-white/10">
        Audio file detected. Preview will show after adding image support.
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10">
      <Canvas camera={{ position: [0, 0, 4.5] }} style={{ background: '#000' }}>
        <VideoWithEffects file={file} settings={settings} />
        <EffectComposer>
          <Bloom intensity={1.6 * settings.intensity} />
          <ChromaticAberration offset={[0.0025 * settings.intensity, 0.0015]} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
