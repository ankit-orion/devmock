"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const SKIN = "#f3c9a6";
const HAIR = "#2b2320";
const BAND = "#ffffff";
const BAND_DARK = "#dcdce0";
const HOODIE = "#2a2a2e";
const HOODIE_DARK = "#161619";
const DARK = "#1b1b1f";

function Character() {
  const group = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      const targetY = mouse.current.x * 0.6;
      const targetX = mouse.current.y * 0.35;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    }

    // blink ~ every 3.4s
    const phase = t % 3.4;
    let s = 1;
    if (phase > 3.2) s = 1 - Math.sin(((phase - 3.2) / 0.2) * Math.PI);
    s = Math.max(0.1, s);
    if (leftEye.current) leftEye.current.scale.y = s;
    if (rightEye.current) rightEye.current.scale.y = s;
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {/* Head */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} metalness={0} />
      </mesh>

      {/* Hair cap (top + back) */}
      <mesh position={[0, 1.12, -0.05]}>
        <sphereGeometry args={[1.04, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color={HAIR} roughness={0.7} />
      </mesh>

      {/* Headband ring around the forehead */}
      <mesh position={[0, 1.32, 0]} rotation={[Math.PI / 2 + 0.12, 0, 0]}>
        <torusGeometry args={[0.97, 0.13, 16, 48]} />
        <meshStandardMaterial color={BAND} roughness={0.4} />
      </mesh>
      {/* Headband knot + tails at back-left */}
      <mesh position={[-0.7, 1.35, -0.75]} rotation={[0.4, 0.6, 0.2]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={BAND_DARK} roughness={0.4} />
      </mesh>
      <mesh position={[-0.95, 1.05, -0.8]} rotation={[0.2, 0.4, -0.5]}>
        <capsuleGeometry args={[0.06, 0.5, 8, 16]} />
        <meshStandardMaterial color={BAND_DARK} roughness={0.4} />
      </mesh>
      <mesh position={[-0.78, 1.0, -0.95]} rotation={[0.2, 0.4, -0.9]}>
        <capsuleGeometry args={[0.06, 0.42, 8, 16]} />
        <meshStandardMaterial color={BAND_DARK} roughness={0.4} />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEye} position={[-0.34, 1.16, 0.9]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color={DARK} roughness={0.3} />
      </mesh>
      <mesh ref={rightEye} position={[0.34, 1.16, 0.9]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color={DARK} roughness={0.3} />
      </mesh>
      {/* eye highlights */}
      <mesh position={[-0.3, 1.21, 1.0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.38, 1.21, 1.0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Cheeks */}
      <mesh position={[-0.55, 0.92, 0.78]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#ff9bb0" roughness={0.6} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0.55, 0.92, 0.78]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#ff9bb0" roughness={0.6} transparent opacity={0.65} />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 0.82, 0.92]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.2, 0.04, 12, 24, Math.PI]} />
        <meshStandardMaterial color={DARK} roughness={0.4} />
      </mesh>

      {/* Body / hoodie */}
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.6, 0.5, 12, 32]} />
        <meshStandardMaterial color={HOODIE} roughness={0.6} />
      </mesh>
      {/* hoodie collar */}
      <mesh position={[0, 0.35, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.1, 12, 32]} />
        <meshStandardMaterial color={HOODIE_DARK} roughness={0.6} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.68, -0.1, 0.1]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.16, 0.45, 8, 16]} />
        <meshStandardMaterial color={HOODIE} roughness={0.6} />
      </mesh>
      <mesh position={[0.68, -0.1, 0.1]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.16, 0.45, 8, 16]} />
        <meshStandardMaterial color={HOODIE} roughness={0.6} />
      </mesh>
      {/* Hands */}
      <mesh position={[-0.92, 0.18, 0.2]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>
      <mesh position={[0.92, 0.18, 0.2]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>
    </group>
  );
}

export function MascotScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0.35, 6.6], fov: 30 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <pointLight position={[-4, 2, -2]} intensity={2.2} color="#ffffff" />
      <pointLight position={[4, -1, 3]} intensity={1.3} color="#ffffff" />

      <Float speed={1.8} rotationIntensity={0.18} floatIntensity={0.35}>
        <Character />
      </Float>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.3}
        scale={6}
        blur={2.6}
        far={3.5}
      />
    </Canvas>
  );
}
