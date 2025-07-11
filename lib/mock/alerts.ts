import type { Alert } from "@/lib/types"

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    robotId: "agrobot-03",
    type: "battery",
    severity: "warning",
    title: "Low Battery Warning",
    message: "Battery level has dropped to 23%. Consider returning to base for charging.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-2",
    robotId: "agrobot-02",
    type: "gps",
    severity: "error",
    title: "GPS Signal Lost",
    message: "GPS signal quality degraded. Robot switched to backup navigation.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-3",
    robotId: "agrobot-01",
    type: "mission",
    severity: "info",
    title: "Mission Completed Successfully",
    message: "Field Survey Alpha mission completed with 98% coverage achieved.",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    acknowledged: true,
    resolvedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-4",
    type: "weather",
    severity: "warning",
    title: "Weather Alert",
    message: "High wind conditions detected. Consider suspending outdoor operations.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-5",
    robotId: "agrobot-04",
    type: "maintenance",
    severity: "info",
    title: "Maintenance Due",
    message: "Scheduled maintenance is due for AgroBot-04. Please schedule downtime.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-6",
    robotId: "agrobot-02",
    type: "communication",
    severity: "error",
    title: "Communication Timeout",
    message: "Lost communication with robot for 30 seconds. Connection restored.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    acknowledged: true,
    resolvedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-7",
    robotId: "agrobot-01",
    type: "system",
    severity: "warning",
    title: "High CPU Temperature",
    message: "CPU temperature reached 78°C. Monitoring thermal conditions.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
]
