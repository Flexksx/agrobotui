import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Alert } from "@/lib/types"
import { mockAlerts } from "@/lib/mock/alerts"
import { realtimeService } from "@/lib/services/realtime.service" // Declare the variable here

interface AlertState {
  alerts: Alert[]
  unacknowledgedCount: number
  loading: boolean
  error: string | null

  // Actions
  fetchAlerts: (params?: { severity?: string; type?: string; acknowledged?: boolean }) => Promise<void>
  acknowledgeAlert: (alertId: string) => Promise<void>
  resolveAlert: (alertId: string, resolution?: string) => Promise<void>
  deleteAlert: (alertId: string) => Promise<void>
  addAlert: (alert: Omit<Alert, "id" | "timestamp">) => void

  // Real-time subscriptions
  subscribeToUpdates: () => void
  unsubscribeFromUpdates: () => void
}

export const useAlertStore = create<AlertState>()(
  devtools(
    (set, get) => ({
      alerts: [],
      unacknowledgedCount: 0,
      loading: false,
      error: null,

      fetchAlerts: async (params) => {
        set({ loading: true, error: null })
        try {
          // For now, use mock data
          // const response = await alertService.getAlerts(params)
          // if (response.success && response.data) {
          //   const alerts = response.data.data
          //   const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length
          //   set({ alerts, unacknowledgedCount, loading: false })
          // } else {
          //   set({ error: response.error || 'Failed to fetch alerts', loading: false })
          // }

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 200))
          let filteredAlerts = mockAlerts

          if (params?.severity) {
            filteredAlerts = filteredAlerts.filter((a) => a.severity === params.severity)
          }
          if (params?.type) {
            filteredAlerts = filteredAlerts.filter((a) => a.type === params.type)
          }
          if (params?.acknowledged !== undefined) {
            filteredAlerts = filteredAlerts.filter((a) => a.acknowledged === params.acknowledged)
          }

          const unacknowledgedCount = mockAlerts.filter((a) => !a.acknowledged).length
          set({ alerts: filteredAlerts, unacknowledgedCount, loading: false })
        } catch (error) {
          set({ error: "Failed to fetch alerts", loading: false })
        }
      },

      acknowledgeAlert: async (alertId: string) => {
        try {
          // const response = await alertService.acknowledgeAlert(alertId)
          // if (response.success && response.data) {
          //   const { alerts } = get()
          //   const updatedAlerts = alerts.map(alert =>
          //     alert.id === alertId ? response.data! : alert
          //   )
          //   const unacknowledgedCount = updatedAlerts.filter(a => !a.acknowledged).length
          //   set({ alerts: updatedAlerts, unacknowledgedCount })
          // }

          // Mock acknowledgment
          const { alerts } = get()
          const updatedAlerts = alerts.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert))
          const unacknowledgedCount = updatedAlerts.filter((a) => !a.acknowledged).length
          set({ alerts: updatedAlerts, unacknowledgedCount })
        } catch (error) {
          set({ error: "Failed to acknowledge alert" })
        }
      },

      resolveAlert: async (alertId: string, resolution?: string) => {
        try {
          // const response = await alertService.resolveAlert(alertId, resolution)
          // if (response.success && response.data) {
          //   const { alerts } = get()
          //   const updatedAlerts = alerts.map(alert =>
          //     alert.id === alertId ? response.data! : alert
          //   )
          //   set({ alerts: updatedAlerts })
          // }

          // Mock resolution
          const { alerts } = get()
          const updatedAlerts = alerts.map((alert) =>
            alert.id === alertId ? { ...alert, acknowledged: true, resolvedAt: new Date().toISOString() } : alert,
          )
          const unacknowledgedCount = updatedAlerts.filter((a) => !a.acknowledged).length
          set({ alerts: updatedAlerts, unacknowledgedCount })
        } catch (error) {
          set({ error: "Failed to resolve alert" })
        }
      },

      deleteAlert: async (alertId: string) => {
        try {
          // const response = await alertService.deleteAlert(alertId)
          // if (response.success) {
          //   const { alerts } = get()
          //   const updatedAlerts = alerts.filter(alert => alert.id !== alertId)
          //   const unacknowledgedCount = updatedAlerts.filter(a => !a.acknowledged).length
          //   set({ alerts: updatedAlerts, unacknowledgedCount })
          // }

          // Mock deletion
          const { alerts } = get()
          const updatedAlerts = alerts.filter((alert) => alert.id !== alertId)
          const unacknowledgedCount = updatedAlerts.filter((a) => !a.acknowledged).length
          set({ alerts: updatedAlerts, unacknowledgedCount })
        } catch (error) {
          set({ error: "Failed to delete alert" })
        }
      },

      addAlert: (alertData: Omit<Alert, "id" | "timestamp">) => {
        const newAlert: Alert = {
          ...alertData,
          id: `alert-${Date.now()}`,
          timestamp: new Date().toISOString(),
        }

        const { alerts } = get()
        const updatedAlerts = [newAlert, ...alerts]
        const unacknowledgedCount = updatedAlerts.filter((a) => !a.acknowledged).length
        set({ alerts: updatedAlerts, unacknowledgedCount })
      },

      subscribeToUpdates: () => {
        realtimeService.subscribeToAlerts((alert: Alert) => {
          get().addAlert(alert)
        })
      },

      unsubscribeFromUpdates: () => {
        // Polling service handles unsubscription internally
      },
    }),
    {
      name: "alert-store",
    },
  ),
)
