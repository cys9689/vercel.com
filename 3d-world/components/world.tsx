"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Stars, Cloud, Float } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { Terrain } from "./terrain"
import { Buildings } from "./buildings"
import { Trees } from "./trees"
import { Character } from "./character"
import { KeyboardControlsWrapper } from "./keyboard-controls"
import { ControlsUI } from "./controls-ui"
import { DebugUI } from "./debug-ui"
import posthog from "posthog-js"

// Helper function to safely capture events
const captureEvent = (eventName, properties = {}) => {
  if (posthog.__loaded) {
    posthog.capture(eventName, properties)
  }
}

export default function World() {
  return (
    <>
      <KeyboardControlsWrapper>
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <color attach="background" args={["#87ceeb"]} />
          <fog attach="fog" args={["#87ceeb", 30, 100]} />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />

          {/* Environment */}
          <Environment preset="sunset" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          {/* Clouds */}
          <Cloud position={[0, 15, -10]} speed={0.2} opacity={0.7} />
          <Cloud position={[10, 15, 0]} speed={0.1} opacity={0.5} />
          <Cloud position={[-10, 15, 10]} speed={0.3} opacity={0.6} />

          {/* Physics World */}
          <Physics gravity={[0, -9.81, 0]}>
            {/* Character */}
            <Character position={[0, 5, 0]} />

            {/* World Elements */}
            <Terrain />
            <Buildings />
            <Trees />

            {/* Floating Objects */}
            <FloatingCrystal position={[5, 5, 0]} color="#ff5555" />
            <FloatingCrystal position={[-5, 7, 3]} color="#55ff55" />
            <FloatingCrystal position={[0, 6, -5]} color="#5555ff" />
          </Physics>
        </Canvas>

        {/* UI Elements */}
        <ControlsUI />
        <DebugUI />
      </KeyboardControlsWrapper>
    </>
  )
}

function FloatingCrystal({ position, color }) {
  const meshRef = useRef()

  const handleClick = () => {
    captureEvent("crystal_clicked", {
      color: color,
      position: position,
    })
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t / 2) / 4
    meshRef.current.rotation.y = t / 2
    meshRef.current.position.y = position[1] + Math.sin(t) / 2
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} castShadow onClick={handleClick}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </Float>
  )
}

