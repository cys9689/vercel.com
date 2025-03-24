"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Use dynamic import to ensure the component only loads on the client
const World = dynamic(() => import("@/components/world"), { ssr: false })

export default function Home() {
  return (
    <main className="w-full h-screen">
      <Suspense fallback={<div className="flex items-center justify-center w-full h-screen">Loading 3D World...</div>}>
        <World />
      </Suspense>
    </main>
  )
}

