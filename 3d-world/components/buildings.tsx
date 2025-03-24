"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"

export function Buildings() {
  return (
    <group>
      <Building position={[5, 0, 5]} height={3} width={2} depth={2} color="#d4a373" />
      <Building position={[8, 0, 3]} height={5} width={1.5} depth={1.5} color="#ccd5ae" />
      <Building position={[3, 0, 8]} height={4} width={2} depth={2} color="#e9edc9" />
      <Building position={[-5, 0, -5]} height={6} width={2} depth={2} color="#fefae0" />
      <Building position={[-8, 0, -3]} height={2} width={3} depth={1.5} color="#faedcd" />
      <Building position={[-3, 0, -8]} height={4} width={1.5} depth={3} color="#d4a373" />
      <Building position={[-6, 0, 6]} height={3.5} width={2} depth={2} color="#ccd5ae" />
      <Building position={[6, 0, -6]} height={5} width={1.5} depth={1.5} color="#e9edc9" />
    </group>
  )
}

function Building({ position, height, width, depth, color }) {
  const buildingRef = useRef()
  const windowsRef = useRef()

  useFrame(({ clock }) => {
    if (windowsRef.current) {
      const t = clock.getElapsedTime()
      // Make windows glow with a pulsing effect
      windowsRef.current.material.emissiveIntensity = 0.5 + Math.sin(t) * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Building structure with physics */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh ref={buildingRef} position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Windows (no physics) */}
      <mesh ref={windowsRef} position={[0, height / 2, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.8, height * 0.8]} />
        <meshStandardMaterial
          color="#ffffe0"
          emissive="#ffffe0"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Roof with physics */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, height + 0.25, 0]} castShadow>
          <coneGeometry args={[width / 1.5, 1, 4]} />
          <meshStandardMaterial color="#8B4513" roughness={1} />
        </mesh>
      </RigidBody>
    </group>
  )
}

