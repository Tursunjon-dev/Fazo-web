"use client";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { useTheme } from "next-themes";
import { DarkCinematicScene } from "./DarkCinematicScene";
import { LightEditorialScene } from "./LightEditorialScene";
import { SCENE } from "./config/heroScenePresets";

export function HeroScene() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLight = resolvedTheme === "light";
  const bgColor = isLight ? "#F8FAFF" : "#0B0324";

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, SCENE.camera.z], fov: SCENE.camera.fov }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
      >
        <color attach="background" args={[bgColor]} />
        {mounted && (isLight ? <LightEditorialScene /> : <DarkCinematicScene />)}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}
