import type { Field } from "@/lib/types"

export const mockFields: Field[] = [
  {
    id: "field-a7",
    name: "Field A-7",
    area: 25.4,
    boundaries: [
      { lat: 40.712, lng: -74.007 },
      { lat: 40.714, lng: -74.007 },
      { lat: 40.714, lng: -74.005 },
      { lat: 40.712, lng: -74.005 },
      { lat: 40.712, lng: -74.007 },
    ],
    coverage: 95,
    lastSurveyed: "2024-01-15T09:15:00Z",
    cropType: "corn",
    missions: ["mission-001", "mission-004"],
  },
  {
    id: "field-b3",
    name: "Field B-3",
    area: 18.7,
    boundaries: [
      { lat: 40.758, lng: -73.986 },
      { lat: 40.76, lng: -73.986 },
      { lat: 40.76, lng: -73.984 },
      { lat: 40.758, lng: -73.984 },
      { lat: 40.758, lng: -73.986 },
    ],
    coverage: 87,
    lastSurveyed: "2024-01-14T14:30:00Z",
    cropType: "soybeans",
    missions: ["mission-002"],
  },
  {
    id: "field-c1",
    name: "Field C-1",
    area: 31.2,
    boundaries: [
      { lat: 40.75, lng: -73.994 },
      { lat: 40.752, lng: -73.994 },
      { lat: 40.752, lng: -73.991 },
      { lat: 40.75, lng: -73.991 },
      { lat: 40.75, lng: -73.994 },
    ],
    coverage: 92,
    lastSurveyed: "2024-01-15T09:08:00Z",
    cropType: "wheat",
    missions: ["mission-003"],
  },
  {
    id: "field-d2",
    name: "Field D-2",
    area: 22.1,
    boundaries: [
      { lat: 40.727, lng: -73.796 },
      { lat: 40.729, lng: -73.796 },
      { lat: 40.729, lng: -73.794 },
      { lat: 40.727, lng: -73.794 },
      { lat: 40.727, lng: -73.796 },
    ],
    coverage: 78,
    lastSurveyed: "2024-01-13T11:20:00Z",
    cropType: "barley",
    missions: [],
  },
  {
    id: "field-e5",
    name: "Field E-5",
    area: 28.9,
    boundaries: [
      { lat: 40.735, lng: -73.98 },
      { lat: 40.737, lng: -73.98 },
      { lat: 40.737, lng: -73.977 },
      { lat: 40.735, lng: -73.977 },
      { lat: 40.735, lng: -73.98 },
    ],
    coverage: 89,
    lastSurveyed: "2024-01-14T16:45:00Z",
    cropType: "oats",
    missions: [],
  },
]
