import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { SystemSettings, User } from "@/lib/types"

interface SystemState {
  settings: SystemSettings
  user: User | null
  connected: boolean
  loading: boolean
  error: string | null

  // Actions
  updateSettings: (updates: Partial<SystemSettings>) => void
  resetSettings: () => void
  setUser: (user: User | null) => void
  setConnectionStatus: (connected: boolean) => void
  testConnection: (type: "backend" | "pi-controller" | "websocket" | "mqtt") => Promise<boolean>
}

const defaultSettings: SystemSettings = {
  apiEndpoints: {
    backend: "http://localhost:5000",
    piController: "http://192.168.1.100:8000",
    websocket: "ws://localhost:8080/ws",
    mqtt: "mqtt://localhost:1883",
  },
  map: {
    provider: "openstreetmap",
    defaultZoom: 15,
    showTrails: true,
    trailDuration: 24,
    refreshRate: 5,
  },
  robots: {
    defaultAltitude: 10,
    defaultSpeed: 2.0,
    safetyRadius: 50,
    batteryWarning: 25,
    batteryLow: 15,
  },
  notifications: {
    email: true,
    push: true,
    sound: true,
    types: {
      battery: true,
      mission: true,
      system: true,
      communication: true,
    },
  },
  security: {
    sessionTimeout: 60,
    requireAuth: true,
    twoFactorAuth: false,
  },
}

export const useSystemStore = create<SystemState>()(
  devtools(
    persist(
      (set, get) => ({
        settings: defaultSettings,
        user: null,
        connected: true,
        loading: false,
        error: null,

        updateSettings: (updates: Partial<SystemSettings>) => {
          const { settings } = get()
          const newSettings = { ...settings, ...updates }
          set({ settings: newSettings })
        },

        resetSettings: () => {
          set({ settings: defaultSettings })
        },

        setUser: (user: User | null) => {
          set({ user })
        },

        setConnectionStatus: (connected: boolean) => {
          set({ connected })
        },

        testConnection: async (type: "backend" | "pi-controller" | "websocket" | "mqtt"): Promise<boolean> => {
          set({ loading: true, error: null })
          try {
            // Mock connection test
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Simulate random success/failure for demo
            const success = Math.random() > 0.3

            if (!success) {
              set({ error: `Failed to connect to ${type}`, loading: false })
            } else {
              set({ loading: false })
            }

            return success
          } catch (error) {
            set({ error: `Connection test failed for ${type}`, loading: false })
            return false
          }
        },
      }),
      {
        name: "system-store",
        partialize: (state) => ({ settings: state.settings, user: state.user }),
      },
    ),
    {
      name: "system-store",
    },
  ),
)
