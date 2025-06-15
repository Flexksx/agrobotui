import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Robot, Telemetry, Position } from "@/lib/types"
import { realtimeService } from "@/lib/services/realtime.service"
import { mockRobots } from "@/lib/mock/robots"

interface RobotState {
  robots: Robot[]
  selectedRobot: Robot | null
  loading: boolean
  error: string | null
  lastUpdated: string | null

  // Actions
  fetchRobots: () => Promise<void>
  refreshRobots: () => Promise<void>
  selectRobot: (robotId: string | null) => void
  updateRobot: (robotId: string, updates: Partial<Robot>) => Promise<void>
  updateRobotPosition: (robotId: string, position: Position) => void
  updateRobotTelemetry: (robotId: string, telemetry: Telemetry) => void
  sendCommand: (robotId: string, command: string, parameters?: Record<string, any>) => Promise<void>

  // Real-time subscriptions
  startRealTimeUpdates: () => void
  stopRealTimeUpdates: () => void
}

export const useRobotStore = create<RobotState>()(
  devtools(
    (set, get) => ({
      robots: [],
      selectedRobot: null,
      loading: false,
      error: null,
      lastUpdated: null,

      fetchRobots: async () => {
        set({ loading: true, error: null })
        try {
          // For now, use mock data
          // const response = await robotService.getRobots()
          // if (response.success && response.data) {
          //   set({ robots: response.data, loading: false, lastUpdated: new Date().toISOString() })
          // } else {
          //   set({ error: response.error || 'Failed to fetch robots', loading: false })
          // }

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500))
          set({ robots: mockRobots, loading: false, lastUpdated: new Date().toISOString() })
        } catch (error) {
          set({ error: "Failed to fetch robots", loading: false })
        }
      },

      refreshRobots: async () => {
        try {
          // const response = await realtimeService.refreshRobots()
          // if (response.success && response.data) {
          //   set({ robots: response.data, lastUpdated: new Date().toISOString() })
          // }

          // Mock refresh with slight data changes
          const { robots } = get()
          const updatedRobots = robots.map((robot) => ({
            ...robot,
            battery: Math.max(0, robot.battery + (Math.random() - 0.5) * 2),
            lastUpdate: new Date().toISOString(),
          }))
          set({ robots: updatedRobots, lastUpdated: new Date().toISOString() })
        } catch (error) {
          console.error("Failed to refresh robots:", error)
        }
      },

      selectRobot: (robotId: string | null) => {
        const { robots } = get()
        const robot = robotId ? robots.find((r) => r.id === robotId) || null : null
        set({ selectedRobot: robot })
      },

      updateRobot: async (robotId: string, updates: Partial<Robot>) => {
        try {
          // const response = await robotService.updateRobot(robotId, updates)
          // if (response.success && response.data) {
          //   const { robots, selectedRobot } = get()
          //   const updatedRobots = robots.map(robot =>
          //     robot.id === robotId ? response.data! : robot
          //   )
          //   set({
          //     robots: updatedRobots,
          //     selectedRobot: selectedRobot?.id === robotId ? response.data! : selectedRobot
          //   })
          // }

          // Mock update
          const { robots, selectedRobot } = get()
          const updatedRobots = robots.map((robot) =>
            robot.id === robotId ? { ...robot, ...updates, lastUpdate: new Date().toISOString() } : robot,
          )
          set({
            robots: updatedRobots,
            selectedRobot: selectedRobot?.id === robotId ? { ...selectedRobot, ...updates } : selectedRobot,
          })
        } catch (error) {
          set({ error: "Failed to update robot" })
        }
      },

      updateRobotPosition: (robotId: string, position: Position) => {
        const { robots, selectedRobot } = get()
        const updatedRobots = robots.map((robot) =>
          robot.id === robotId ? { ...robot, position, lastUpdate: new Date().toISOString() } : robot,
        )
        set({
          robots: updatedRobots,
          selectedRobot: selectedRobot?.id === robotId ? { ...selectedRobot, position } : selectedRobot,
        })
      },

      updateRobotTelemetry: (robotId: string, telemetry: Telemetry) => {
        const { robots, selectedRobot } = get()
        const updatedRobots = robots.map((robot) =>
          robot.id === robotId
            ? {
                ...robot,
                telemetry,
                battery: telemetry.battery.level,
                position: telemetry.position,
                lastUpdate: new Date().toISOString(),
              }
            : robot,
        )
        set({
          robots: updatedRobots,
          selectedRobot:
            selectedRobot?.id === robotId
              ? { ...selectedRobot, telemetry, battery: telemetry.battery.level, position: telemetry.position }
              : selectedRobot,
        })
      },

      sendCommand: async (robotId: string, command: string, parameters?: Record<string, any>) => {
        try {
          // const response = await robotService.sendCommand(robotId, command, parameters)
          // if (!response.success) {
          //   set({ error: response.error || 'Failed to send command' })
          // }

          // Mock command execution
          console.log(`Sending command ${command} to robot ${robotId}`, parameters)

          // Update robot status based on command
          const { updateRobot } = get()
          switch (command) {
            case "arm":
              await updateRobot(robotId, { status: "active" })
              break
            case "disarm":
              await updateRobot(robotId, { status: "idle" })
              break
            case "emergency_stop":
              await updateRobot(robotId, { status: "error" })
              break
          }
        } catch (error) {
          set({ error: "Failed to send command" })
        }
      },

      startRealTimeUpdates: () => {
        realtimeService.subscribeToRobotUpdates((robots: Robot[]) => {
          set({ robots, lastUpdated: new Date().toISOString() })
        })

        realtimeService.subscribeToTelemetry((telemetry: Telemetry) => {
          get().updateRobotTelemetry(telemetry.robotId, telemetry)
        })

        realtimeService.startPolling()
      },

      stopRealTimeUpdates: () => {
        realtimeService.stopPolling()
      },
    }),
    {
      name: "robot-store",
    },
  ),
)
