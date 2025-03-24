"use client"

import type React from "react"

import { PostHogProvider as BasePostHogProvider } from "posthog-js/react"
import { usePathname } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import posthog from "posthog-js"

// Separate component for page view tracking
function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname && posthog.__loaded) {
      // Capture pageview with current URL
      const url = window.location.origin + pathname
      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname, posthog.__loaded])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize PostHog by fetching config from the server
  useEffect(() => {
    const initPostHog = async () => {
      try {
        // Only initialize once
        if (typeof window !== "undefined" && !posthog.__loaded) {
          const response = await fetch("/api/posthog-config")
          const { apiKey, apiHost } = await response.json()

          posthog.init(apiKey, {
            api_host: apiHost,
            capture_pageview: false,
          })

          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Failed to initialize PostHog:", error)
      }
    }

    initPostHog()
  }, [])

  return (
    <BasePostHogProvider client={posthog}>
      {isInitialized && (
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
      )}
      {children}
    </BasePostHogProvider>
  )
}

