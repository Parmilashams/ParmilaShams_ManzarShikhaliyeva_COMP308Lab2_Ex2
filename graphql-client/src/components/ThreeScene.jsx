import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function GameController() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += 0.01;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
  });

  return (
    <group ref={groupRef} scale={1.3}>
      
      <mesh>
        <boxGeometry args={[3.2, 1.2, 1.1]} />
        <meshStandardMaterial color="red" metalness={0.3} roughness={0.5} />
      </mesh>

      <mesh position={[-1.5, -0.55, 0]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[1.5, -0.55, 0]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[-0.95, 0.05, 0.58]}>
        <boxGeometry args={[0.45, 0.12, 0.12]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      <mesh position={[-0.95, 0.05, 0.58]}>
        <boxGeometry args={[0.12, 0.45, 0.12]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      <mesh position={[0.95, 0.2, 0.58]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[1.18, 0.02, 0.58]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
      <mesh position={[0.72, 0.02, 0.58]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.95, -0.16, 0.58]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#a855f7" />
      </mesh>

      <mesh position={[-0.35, -0.12, 0.58]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0.3, -0.28, 0.58]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <div
      style={{
        width: '500px',
        height: '420px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        displey: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      
    }}
    >
      <Canvas camera={{ position: [0, 0.3, 7], fov: 45 }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 4, 5]} intensity={2} />
        <pointLight position={[-4, 2, 3]} intensity={1.5} />
        <GameController />
      </Canvas>
    </div>
  );
}