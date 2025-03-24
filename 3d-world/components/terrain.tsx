"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshWobbleMaterial } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

export function Terrain() {
  const terrainRef = useRef()

  useFrame(({ clock }) => {
    if (terrainRef.current) {
      terrainRef.current.rotation.z = Math.sin(clock.getElapsedTime() / 10) / 50
    }
  })

  return (
    <group>
      {/* Main terrain */}
      <RigidBody type="fixed" colliders="trimesh">
        <mesh ref={terrainRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100, 64, 64]} />
          <MeshWobbleMaterial color="#4a7c59" factor={0.2} speed={0.5} roughness={1} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Water */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#3a85cc" roughness={0.1} metalness={0.8} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

