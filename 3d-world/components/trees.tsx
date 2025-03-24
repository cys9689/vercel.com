"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"

export function Trees() {
  return (
    <group>
      <Tree position={[10, 0, 10]} height={3} />
      <Tree position={[12, 0, 15]} height={4} />
      <Tree position={[15, 0, 8]} height={3.5} />
      <Tree position={[-10, 0, -10]} height={4} />
      <Tree position={[-15, 0, -8]} height={3} />
      <Tree position={[-12, 0, -15]} height={3.5} />
      <Tree position={[-10, 0, 10]} height={3} />
      <Tree position={[10, 0, -10]} height={4} />
      <Tree position={[15, 0, -15]} height={3.5} />
      <Tree position={[-15, 0, 15]} height={4} />
    </group>
  )
}

function Tree({ position, height }) {
  const trunkRef = useRef()
  const leavesRef = useRef()

  useFrame(({ clock }) => {
    if (trunkRef.current && leavesRef.current) {
      const t = clock.getElapsedTime()
      // Gentle swaying motion
      trunkRef.current.rotation.x = Math.sin(t + position[0]) * 0.05
      trunkRef.current.rotation.z = Math.cos(t + position[2]) * 0.05
      leavesRef.current.rotation.x = Math.sin(t + position[0]) * 0.08
      leavesRef.current.rotation.z = Math.cos(t + position[2]) * 0.08
    }
  })

  const trunkHeight = height * 0.4
  const leavesHeight = height * 0.6

  return (
    <group position={position}>
      {/* Trunk with physics */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh ref={trunkRef} position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.3, trunkHeight, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={1} />
        </mesh>
      </RigidBody>

      {/* Leaves with physics */}
      <RigidBody type="fixed" colliders="ball">
        <mesh ref={leavesRef} position={[0, trunkHeight + leavesHeight / 2, 0]} castShadow>
          <coneGeometry args={[1.5, leavesHeight, 8]} />
          <meshStandardMaterial color="#2e7d32" roughness={0.8} />
        </mesh>
      </RigidBody>
    </group>
  )
}

