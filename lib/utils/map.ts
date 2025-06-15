export const DEFAULT_MAP_CENTER = { lat: 40.7128, lng: -74.006 }
export const DEFAULT_MAP_ZOOM = 15

export const MAP_STYLES = {
  robot: {
    active: { color: "#22c55e", fillColor: "#22c55e", radius: 8 },
    idle: { color: "#eab308", fillColor: "#eab308", radius: 8 },
    warning: { color: "#f97316", fillColor: "#f97316", radius: 8 },
    offline: { color: "#ef4444", fillColor: "#ef4444", radius: 8 },
  },
  mission: {
    active: { color: "#3b82f6", weight: 3, opacity: 0.8, dashArray: "10,5" },
    completed: { color: "#22c55e", weight: 2, opacity: 0.6 },
    planned: { color: "#94a3b8", weight: 2, opacity: 0.5, dashArray: "5,5" },
  },
  field: {
    boundary: { color: "#059669", weight: 3, opacity: 0.8, fillOpacity: 0.1 },
  },
  waypoint: {
    default: { color: "#3b82f6", fillColor: "#ffffff", radius: 6 },
    selected: { color: "#ef4444", fillColor: "#ffffff", radius: 8 },
  },
}

export function createRobotIcon(status: string, selected = false) {
  const style = MAP_STYLES.robot[status as keyof typeof MAP_STYLES.robot]
  return {
    ...style,
    radius: selected ? style.radius + 2 : style.radius,
    weight: selected ? 3 : 2,
    fillOpacity: 0.8,
    stroke: true,
    color: selected ? "#ffffff" : style.color,
  }
}

export function createMissionPath(type: "active" | "completed" | "planned") {
  return MAP_STYLES.mission[type]
}
