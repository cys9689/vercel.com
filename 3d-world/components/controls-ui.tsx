"use client"

export function ControlsUI() {
  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-4 rounded-lg z-10 text-lg">
      <h2 className="text-xl font-bold mb-2">Controls</h2>
      <ul className="space-y-2">
        <li>⬆️ W / Up Arrow: Move Forward</li>
        <li>⬇️ S / Down Arrow: Move Backward</li>
        <li>⬅️ A / Left Arrow: Move Left</li>
        <li>➡️ D / Right Arrow: Move Right</li>
        <li>Space: Jump</li>
      </ul>
    </div>
  )
}

