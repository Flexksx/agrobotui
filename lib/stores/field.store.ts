import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Field, Position } from "@/lib/types"
import { mockFields } from "@/lib/mock/fields"

interface FieldState {
  fields: Field[]
  selectedField: Field | null
  loading: boolean
  error: string | null

  // Actions
  fetchFields: () => Promise<void>
  selectField: (fieldId: string | null) => void
  createField: (field: Omit<Field, "id" | "coverage" | "missions">) => Promise<void>
  updateField: (fieldId: string, updates: Partial<Field>) => Promise<void>
  deleteField: (fieldId: string) => Promise<void>
  updateFieldBoundaries: (fieldId: string, boundaries: Position[]) => Promise<void>
  calculateFieldArea: (boundaries: Position[]) => Promise<number>
}

export const useFieldStore = create<FieldState>()(
  devtools(
    (set, get) => ({
      fields: [],
      selectedField: null,
      loading: false,
      error: null,

      fetchFields: async () => {
        set({ loading: true, error: null })
        try {
          // For now, use mock data
          // const response = await fieldService.getFields()
          // if (response.success && response.data) {
          //   set({ fields: response.data, loading: false })
          // } else {
          //   set({ error: response.error || 'Failed to fetch fields', loading: false })
          // }

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300))
          set({ fields: mockFields, loading: false })
        } catch (error) {
          set({ error: "Failed to fetch fields", loading: false })
        }
      },

      selectField: (fieldId: string | null) => {
        const { fields } = get()
        const field = fieldId ? fields.find((f) => f.id === fieldId) || null : null
        set({ selectedField: field })
      },

      createField: async (fieldData: Omit<Field, "id" | "coverage" | "missions">) => {
        try {
          // const response = await fieldService.createField(fieldData)
          // if (response.success && response.data) {
          //   const { fields } = get()
          //   set({ fields: [...fields, response.data] })
          // } else {
          //   set({ error: response.error || 'Failed to create field' })
          // }

          // Mock creation
          const newField: Field = {
            ...fieldData,
            id: `field-${Date.now()}`,
            coverage: 0,
            missions: [],
          }

          const { fields } = get()
          set({ fields: [...fields, newField] })
        } catch (error) {
          set({ error: "Failed to create field" })
        }
      },

      updateField: async (fieldId: string, updates: Partial<Field>) => {
        try {
          // const response = await fieldService.updateField(fieldId, updates)
          // if (response.success && response.data) {
          //   const { fields, selectedField } = get()
          //   const updatedFields = fields.map(field =>
          //     field.id === fieldId ? response.data! : field
          //   )
          //   set({
          //     fields: updatedFields,
          //     selectedField: selectedField?.id === fieldId ? response.data! : selectedField
          //   })
          // }

          // Mock update
          const { fields, selectedField } = get()
          const updatedFields = fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field))
          set({
            fields: updatedFields,
            selectedField: selectedField?.id === fieldId ? { ...selectedField, ...updates } : selectedField,
          })
        } catch (error) {
          set({ error: "Failed to update field" })
        }
      },

      deleteField: async (fieldId: string) => {
        try {
          // const response = await fieldService.deleteField(fieldId)
          // if (response.success) {
          //   const { fields, selectedField } = get()
          //   const updatedFields = fields.filter(field => field.id !== fieldId)
          //   set({
          //     fields: updatedFields,
          //     selectedField: selectedField?.id === fieldId ? null : selectedField
          //   })
          // }

          // Mock deletion
          const { fields, selectedField } = get()
          const updatedFields = fields.filter((field) => field.id !== fieldId)
          set({
            fields: updatedFields,
            selectedField: selectedField?.id === fieldId ? null : selectedField,
          })
        } catch (error) {
          set({ error: "Failed to delete field" })
        }
      },

      updateFieldBoundaries: async (fieldId: string, boundaries: Position[]) => {
        try {
          // const response = await fieldService.updateFieldBoundaries(fieldId, boundaries)
          // if (response.success && response.data) {
          //   get().updateField(fieldId, { boundaries })
          // }

          // Mock boundary update
          get().updateField(fieldId, { boundaries })
        } catch (error) {
          set({ error: "Failed to update field boundaries" })
        }
      },

      calculateFieldArea: async (boundaries: Position[]): Promise<number> => {
        try {
          // const response = await fieldService.calculateFieldArea(boundaries)
          // if (response.success && response.data) {
          //   return response.data
          // }
          // return 0

          // Mock area calculation using shoelace formula
          if (boundaries.length < 3) return 0

          let area = 0
          for (let i = 0; i < boundaries.length; i++) {
            const j = (i + 1) % boundaries.length
            area += boundaries[i].lat * boundaries[j].lng
            area -= boundaries[j].lat * boundaries[i].lng
          }
          area = Math.abs(area) / 2

          // Convert to hectares (rough approximation)
          return (area * 111320 * 111320) / 10000
        } catch (error) {
          set({ error: "Failed to calculate field area" })
          return 0
        }
      },
    }),
    {
      name: "field-store",
    },
  ),
)
