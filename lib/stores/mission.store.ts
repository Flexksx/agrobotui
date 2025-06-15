import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Mission, Waypoint } from "@/lib/types"
import { mockMissions, mockMissionTemplates } from "@/lib/mock/missions"
import { realtimeService } from "@/lib/services/realtime.service"

interface MissionState {
  missions: Mission[]
  templates: Mission[]
  selectedMission: Mission | null
  activeMissions: Mission[]
  loading: boolean
  error: string | null

  // Actions
  fetchMissions: (params?: { status?: string; robotId?: string }) => Promise<void>
  fetchTemplates: () => Promise<void>
  selectMission: (missionId: string | null) => void
  createMission: (mission: Omit<Mission, "id" | "createdAt" | "progress">) => Promise<void>
  updateMission: (missionId: string, updates: Partial<Mission>) => Promise<void>
  deleteMission: (missionId: string) => Promise<void>
  cloneMission: (missionId: string, name: string) => Promise<void>

  // Waypoint management
  addWaypoint: (missionId: string, waypoint: Omit<Waypoint, "id">) => Promise<void>
  updateWaypoint: (missionId: string, waypointId: string, updates: Partial<Waypoint>) => Promise<void>
  deleteWaypoint: (missionId: string, waypointId: string) => Promise<void>
  reorderWaypoints: (missionId: string, waypoints: { id: string; order: number }[]) => Promise<void>

  // Mission control
  startMission: (missionId: string, robotId: string) => Promise<void>
  pauseMission: (missionId: string) => Promise<void>
  resumeMission: (missionId: string) => Promise<void>
  stopMission: (missionId: string) => Promise<void>

  // Real-time subscriptions
  subscribeToUpdates: () => void
  unsubscribeFromUpdates: () => void
}

export const useMissionStore = create<MissionState>()(
  devtools(
    (set, get) => ({
      missions: [],
      templates: [],
      selectedMission: null,
      activeMissions: [],
      loading: false,
      error: null,

      fetchMissions: async (params) => {
        set({ loading: true, error: null })
        try {
          // For now, use mock data
          // const response = await missionService.getMissions(params)
          // if (response.success && response.data) {
          //   set({
          //     missions: response.data.data,
          //     activeMissions: response.data.data.filter(m => m.status === 'active'),
          //     loading: false
          //   })
          // } else {
          //   set({ error: response.error || 'Failed to fetch missions', loading: false })
          // }

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300))
          const filteredMissions = params?.status
            ? mockMissions.filter((m) => m.status === params.status)
            : mockMissions

          set({
            missions: filteredMissions,
            activeMissions: mockMissions.filter((m) => m.status === "active"),
            loading: false,
          })
        } catch (error) {
          set({ error: "Failed to fetch missions", loading: false })
        }
      },

      fetchTemplates: async () => {
        try {
          // const response = await missionService.getMissionTemplates()
          // if (response.success && response.data) {
          //   set({ templates: response.data })
          // }

          set({ templates: mockMissionTemplates })
        } catch (error) {
          set({ error: "Failed to fetch templates" })
        }
      },

      selectMission: (missionId: string | null) => {
        const { missions } = get()
        const mission = missionId ? missions.find((m) => m.id === missionId) || null : null
        set({ selectedMission: mission })
      },

      createMission: async (missionData) => {
        try {
          // const response = await missionService.createMission(missionData)
          // if (response.success && response.data) {
          //   const { missions } = get()
          //   set({ missions: [...missions, response.data] })
          // } else {
          //   set({ error: response.error || 'Failed to create mission' })
          // }

          // Mock creation
          const newMission: Mission = {
            ...missionData,
            id: `mission-${Date.now()}`,
            createdAt: new Date().toISOString(),
            progress: 0,
          }

          const { missions } = get()
          set({ missions: [...missions, newMission] })
        } catch (error) {
          set({ error: "Failed to create mission" })
        }
      },

      updateMission: async (missionId: string, updates: Partial<Mission>) => {
        try {
          // const response = await missionService.updateMission(missionId, updates)
          // if (response.success && response.data) {
          //   const { missions, selectedMission } = get()
          //   const updatedMissions = missions.map(mission =>
          //     mission.id === missionId ? response.data! : mission
          //   )
          //   set({
          //     missions: updatedMissions,
          //     selectedMission: selectedMission?.id === missionId ? response.data! : selectedMission
          //   })
          // }

          // Mock update
          const { missions, selectedMission } = get()
          const updatedMissions = missions.map((mission) =>
            mission.id === missionId ? { ...mission, ...updates } : mission,
          )
          set({
            missions: updatedMissions,
            selectedMission: selectedMission?.id === missionId ? { ...selectedMission, ...updates } : selectedMission,
            activeMissions: updatedMissions.filter((m) => m.status === "active"),
          })
        } catch (error) {
          set({ error: "Failed to update mission" })
        }
      },

      deleteMission: async (missionId: string) => {
        try {
          // const response = await missionService.deleteMission(missionId)
          // if (response.success) {
          //   const { missions, selectedMission } = get()
          //   const updatedMissions = missions.filter(mission => mission.id !== missionId)
          //   set({
          //     missions: updatedMissions,
          //     selectedMission: selectedMission?.id === missionId ? null : selectedMission
          //   })
          // }

          // Mock deletion
          const { missions, selectedMission } = get()
          const updatedMissions = missions.filter((mission) => mission.id !== missionId)
          set({
            missions: updatedMissions,
            selectedMission: selectedMission?.id === missionId ? null : selectedMission,
            activeMissions: updatedMissions.filter((m) => m.status === "active"),
          })
        } catch (error) {
          set({ error: "Failed to delete mission" })
        }
      },

      cloneMission: async (missionId: string, name: string) => {
        try {
          // const response = await missionService.cloneMission(missionId, name)
          // if (response.success && response.data) {
          //   const { missions } = get()
          //   set({ missions: [...missions, response.data] })
          // }

          // Mock cloning
          const { missions } = get()
          const originalMission = missions.find((m) => m.id === missionId)
          if (originalMission) {
            const clonedMission: Mission = {
              ...originalMission,
              id: `mission-${Date.now()}`,
              name,
              status: "draft",
              progress: 0,
              assignedRobot: undefined,
              createdAt: new Date().toISOString(),
              startedAt: undefined,
              completedAt: undefined,
              actualTime: undefined,
            }
            set({ missions: [...missions, clonedMission] })
          }
        } catch (error) {
          set({ error: "Failed to clone mission" })
        }
      },

      addWaypoint: async (missionId: string, waypointData: Omit<Waypoint, "id">) => {
        try {
          // const response = await missionService.addWaypoint(missionId, waypointData)
          // if (response.success && response.data) {
          //   const { missions, selectedMission } = get()
          //   const updatedMissions = missions.map(mission =>
          //     mission.id === missionId
          //       ? { ...mission, waypoints: [...mission.waypoints, response.data!] }
          //       : mission
          //   )
          //   set({
          //     missions: updatedMissions,
          //     selectedMission: selectedMission?.id === missionId
          //       ? { ...selectedMission, waypoints: [...selectedMission.waypoints, response.data!] }
          //       : selectedMission
          //   })
          // }

          // Mock waypoint addition
          const newWaypoint: Waypoint = {
            ...waypointData,
            id: `wp-${Date.now()}`,
          }

          const { missions, selectedMission } = get()
          const updatedMissions = missions.map((mission) =>
            mission.id === missionId ? { ...mission, waypoints: [...mission.waypoints, newWaypoint] } : mission,
          )
          set({
            missions: updatedMissions,
            selectedMission:
              selectedMission?.id === missionId
                ? { ...selectedMission, waypoints: [...selectedMission.waypoints, newWaypoint] }
                : selectedMission,
          })
        } catch (error) {
          set({ error: "Failed to add waypoint" })
        }
      },

      updateWaypoint: async (missionId: string, waypointId: string, updates: Partial<Waypoint>) => {
        try {
          // const response = await missionService.updateWaypoint(missionId, waypointId, updates)
          // if (response.success && response.data) {
          //   const { missions, selectedMission } = get()
          //   const updatedMissions = missions.map(mission =>
          //     mission.id === missionId
          //       ? {
          //           ...mission,
          //           waypoints: mission.waypoints.map(wp =>
          //             wp.id === waypointId ? response.data! : wp
          //           )
          //         }
          //       : mission
          //   )
          //   set({
          //     missions: updatedMissions,
          //     selectedMission: selectedMission?.id === missionId
          //       ? {
          //           ...selectedMission,
          //           waypoints: selectedMission.waypoints.map(wp =>
          //             wp.id === waypointId ? response.data! : wp
          //           )
          //         }
          //       : selectedMission
          //   })
          // }

          // Mock waypoint update
          const { missions, selectedMission } = get()
          const updatedMissions = missions.map((mission) =>
            mission.id === missionId
              ? {
                  ...mission,
                  waypoints: mission.waypoints.map((wp) => (wp.id === waypointId ? { ...wp, ...updates } : wp)),
                }
              : mission,
          )
          set({
            missions: updatedMissions,
            selectedMission:
              selectedMission?.id === missionId
                ? {
                    ...selectedMission,
                    waypoints: selectedMission.waypoints.map((wp) =>
                      wp.id === waypointId ? { ...wp, ...updates } : wp,
                    ),
                  }
                : selectedMission,
          })
        } catch (error) {
          set({ error: "Failed to update waypoint" })
        }
      },

      deleteWaypoint: async (missionId: string, waypointId: string) => {
        try {
          // const response = await missionService.deleteWaypoint(missionId, waypointId)
          // if (response.success) {
          //   const { missions, selectedMission } = get()
          //   const updatedMissions = missions.map(mission =>
          //     mission.id === missionId
          //       ? { ...mission, waypoints: mission.waypoints.filter(wp => wp.id !== waypointId) }
          //       : mission
          //   )
          //   set({
          //     missions: updatedMissions,
          //     selectedMission: selectedMission?.id === missionId
          //       ? { ...selectedMission, waypoints: selectedMission.waypoints.filter(wp => wp.id !== waypointId) }
          //       : selectedMission
          //   })
          // }

          // Mock waypoint deletion
          const { missions, selectedMission } = get()
          const updatedMissions = missions.map((mission) =>
            mission.id === missionId
              ? { ...mission, waypoints: mission.waypoints.filter((wp) => wp.id !== waypointId) }
              : mission,
          )
          set({
            missions: updatedMissions,
            selectedMission:
              selectedMission?.id === missionId
                ? { ...selectedMission, waypoints: selectedMission.waypoints.filter((wp) => wp.id !== waypointId) }
                : selectedMission,
          })
        } catch (error) {
          set({ error: "Failed to delete waypoint" })
        }
      },

      reorderWaypoints: async (missionId: string, waypoints: { id: string; order: number }[]) => {
        try {
          // const response = await missionService.reorderWaypoints(missionId, waypoints)
          // if (response.success) {
          //   const { missions, selectedMission } = get()
          //   const updatedMissions = missions.map(mission =>
          //     mission.id === missionId
          //       ? {
          //           ...mission,
          //           waypoints: mission.waypoints
          //             .map(wp => {
          //               const newOrder = waypoints.find(w => w.id === wp.id)?.order
          //               return newOrder !== undefined ? { ...wp, order: newOrder } : wp
          //             })
          //             .sort((a, b) => a.order - b.order)
          //         }
          //       : mission
          //   )
          //   set({
          //     missions: updatedMissions,
          //     selectedMission: selectedMission?.id === missionId
          //       ? updatedMissions.find(m => m.id === missionId) || selectedMission
          //       : selectedMission
          //   })
          // }

          // Mock waypoint reordering
          const { missions, selectedMission } = get()
          const updatedMissions = missions.map((mission) =>
            mission.id === missionId
              ? {
                  ...mission,
                  waypoints: mission.waypoints
                    .map((wp) => {
                      const newOrder = waypoints.find((w) => w.id === wp.id)?.order
                      return newOrder !== undefined ? { ...wp, order: newOrder } : wp
                    })
                    .sort((a, b) => a.order - b.order),
                }
              : mission,
          )
          set({
            missions: updatedMissions,
            selectedMission:
              selectedMission?.id === missionId
                ? updatedMissions.find((m) => m.id === missionId) || selectedMission
                : selectedMission,
          })
        } catch (error) {
          set({ error: "Failed to reorder waypoints" })
        }
      },

      startMission: async (missionId: string, robotId: string) => {
        try {
          // const response = await missionService.startMission(missionId, robotId)
          // if (response.success) {
          //   get().updateMission(missionId, {
          //     status: 'active',
          //     assignedRobot: robotId,
          //     startedAt: new Date().toISOString()
          //   })
          // }

          // Mock mission start
          get().updateMission(missionId, {
            status: "active",
            assignedRobot: robotId,
            startedAt: new Date().toISOString(),
          })
        } catch (error) {
          set({ error: "Failed to start mission" })
        }
      },

      pauseMission: async (missionId: string) => {
        try {
          // const response = await missionService.pauseMission(missionId)
          // if (response.success) {
          //   get().updateMission(missionId, { status: 'paused' })
          // }

          // Mock mission pause
          get().updateMission(missionId, { status: "paused" })
        } catch (error) {
          set({ error: "Failed to pause mission" })
        }
      },

      resumeMission: async (missionId: string) => {
        try {
          // const response = await missionService.resumeMission(missionId)
          // if (response.success) {
          //   get().updateMission(missionId, { status: 'active' })
          // }

          // Mock mission resume
          get().updateMission(missionId, { status: "active" })
        } catch (error) {
          set({ error: "Failed to resume mission" })
        }
      },

      stopMission: async (missionId: string) => {
        try {
          // const response = await missionService.stopMission(missionId)
          // if (response.success) {
          //   get().updateMission(missionId, {
          //     status: 'completed',
          //     completedAt: new Date().toISOString()
          //   })
          // }

          // Mock mission stop
          get().updateMission(missionId, {
            status: "completed",
            completedAt: new Date().toISOString(),
          })
        } catch (error) {
          set({ error: "Failed to stop mission" })
        }
      },

      subscribeToUpdates: () => {
        realtimeService.subscribeToMissionUpdates((missions: Mission[]) => {
          set({
            missions,
            activeMissions: missions.filter((m) => m.status === "active"),
          })
        })
      },

      unsubscribeFromUpdates: () => {
        // Polling service handles unsubscription internally
      },
    }),
    {
      name: "mission-store",
    },
  ),
)
