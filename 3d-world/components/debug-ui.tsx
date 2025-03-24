"use client"

import { useState, useEffect } from "react"
import { useKeyboardControls } from "@react-three/drei"

export function DebugUI() {
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const [keyState, setKeyState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  useEffect(() => {
    const unsubscribeForward = subscribeKeys(
      (state) => state.forward,
      (value) => {
        setKeyState((prev) => ({ ...prev, forward: value }))
      },
    )

    const unsubscribeBackward = subscribeKeys(
      (state) => state.backward,
      (value) => {
        setKeyState((prev) => ({ ...prev, backward: value }))
      },
    )

    const unsubscribeLeft = subscribeKeys(
      (state) => state.left,
      (value) => {
        setKeyState((prev) => ({ ...prev, left: value }))
      },
    )

    const unsubscribeRight = subscribeKeys(
      (state) => state.right,
      (value) => {
        setKeyState((prev) => ({ ...prev, right: value }))
      },
    )

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        setKeyState((prev) => ({ ...prev, jump: value }))
      },
    )

    return () => {
      unsubscribeForward()
      unsubscribeBackward()
      unsubscribeLeft()
      unsubscribeRight()
      unsubscribeJump()
    }
  }, [subscribeKeys])

  return (
    <div className="absolute top-4 right-4 bg-black/70 text-white p-4 rounded-lg z-10">
      <h2 className="text-xl font-bold mb-2">Debug Info</h2>
      <div className="grid grid-cols-2 gap-2">
        <div>Forward:</div>
        <div className={keyState.forward ? "text-green-500" : "text-red-500"}>
          {keyState.forward ? "PRESSED" : "not pressed"}
        </div>

        <div>Backward:</div>
        <div className={keyState.backward ? "text-green-500" : "text-red-500"}>
          {keyState.backward ? "PRESSED" : "not pressed"}
        </div>

        <div>Left:</div>
        <div className={keyState.left ? "text-green-500" : "text-red-500"}>
          {keyState.left ? "PRESSED" : "not pressed"}
        </div>

        <div>Right:</div>
        <div className={keyState.right ? "text-green-500" : "text-red-500"}>
          {keyState.right ? "PRESSED" : "not pressed"}
        </div>

        <div>Jump:</div>
        <div className={keyState.jump ? "text-green-500" : "text-red-500"}>
          {keyState.jump ? "PRESSED" : "not pressed"}
        </div>
      </div>
    </div>
  )
}

