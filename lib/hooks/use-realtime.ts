"use client"

import { useEffect } from "react"
import { useRobotStore } from "@/lib/stores/robot.store"
import { useMissionStore } from "@/lib/stores/mission.store"
import { useAlertStore } from "@/lib/stores/alert.store"

export function useRealtime() {
  const robotStore = useRobotStore()
  const missionStore = useMissionStore()
  const alertStore = useAlertStore()

  useEffect(() => {
    console.log("Starting real-time updates with REST API polling...")

    // Subscribe to real-time updates
    robotStore.subscribeToUpdates()
    missionStore.subscribeToUpdates()
    alertStore.subscribeToUpdates()

    // Start polling
    robotStore.startRealTimeUpdates()

    // Cleanup on unmount
    return () => {
      robotStore.unsubscribeFromUpdates()
      missionStore.unsubscribeFromUpdates()
      alertStore.unsubscribeFromUpdates()
      robotStore.stopRealTimeUpdates()
    }
  }, [])

  return {
    connected: true, // Always connected with REST API
    refresh: {
      robots: robotStore.refreshRobots,
      missions: () => missionStore.fetchMissions(),
      alerts: () => alertStore.fetchAlerts(),
    },
  }
}
