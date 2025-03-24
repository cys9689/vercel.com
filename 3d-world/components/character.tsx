"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { RigidBody, CapsuleCollider } from "@react-three/rapier"
import posthog from "posthog-js"

// Helper function to safely capture events
const captureEvent = (eventName, properties = {}) => {
  if (posthog.__loaded) {
    posthog.capture(eventName, properties)
  }
}

export function Character({ position = [0, 2, 0] }) {
  const bodyRef = useRef()
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const [isOnGround, setIsOnGround] = useState(true)
  const jumpVelocity = 5
  const moveSpeed = 3

  // Handle movement and jumping
  useFrame((state) => {
    if (!bodyRef.current) return

    const { forward, backward, left, right, jump } = getKeys()

    // Get current position and velocity
    const position = bodyRef.current.translation()
    const velocity = bodyRef.current.linvel()

    // Create a new velocity vector
    const newVelocity = { x: 0, y: velocity.y, z: 0 }

    // Handle forward/backward movement
    if (forward) {
      newVelocity.z = -moveSpeed
    } else if (backward) {
      newVelocity.z = moveSpeed
    }

    // Handle left/right movement
    if (left) {
      newVelocity.x = -moveSpeed
    } else if (right) {
      newVelocity.x = moveSpeed
    }

    // Apply the new velocity
    bodyRef.current.setLinvel(newVelocity)

    // Handle jumping
    if (jump && isOnGround) {
      bodyRef.current.setLinvel({ x: velocity.x, y: jumpVelocity, z: velocity.z })
      setIsOnGround(false)

      // Track jump
      captureEvent("character_jumped", {
        position: [position.x, position.y, position.z],
      })

      // Reset ground state after a short delay
      setTimeout(() => {
        setIsOnGround(true)
      }, 500)
    }

    // Update camera to follow character
    if (position) {
      state.camera.position.x = position.x
      state.camera.position.y = position.y + 5
      state.camera.position.z = position.z + 10
      state.camera.lookAt(position.x, position.y, position.z)
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      enabledRotations={[false, false, false]}
      colliders={false}
      mass={1}
      type="dynamic"
      lockRotations
    >
      <CapsuleCollider args={[0.5, 1]} />
      <group>
        {/* Character body */}
        <mesh castShadow position={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 1, 8, 16]} />
          <meshStandardMaterial color="#ff9500" />
        </mesh>

        {/* Character eyes */}
        <mesh castShadow position={[0.25, 0.5, 0.4]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh castShadow position={[-0.25, 0.5, 0.4]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    </RigidBody>
  )
}

