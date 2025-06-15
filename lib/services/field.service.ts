import { BaseService } from "./base.service"
import type { Field, Position, ApiResponse } from "@/lib/types"

export class FieldService extends BaseService {
  constructor() {
    super()
  }

  async getFields(): Promise<ApiResponse<Field[]>> {
    return this.get<Field[]>("/api/fields")
  }

  async getField(id: string): Promise<ApiResponse<Field>> {
    return this.get<Field>(`/api/fields/${id}`)
  }

  async createField(field: Omit<Field, "id" | "coverage" | "missions">): Promise<ApiResponse<Field>> {
    return this.post<Field>("/api/fields", field)
  }

  async updateField(id: string, updates: Partial<Field>): Promise<ApiResponse<Field>> {
    return this.put<Field>(`/api/fields/${id}`, updates)
  }

  async deleteField(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/fields/${id}`)
  }

  async updateFieldBoundaries(id: string, boundaries: Position[]): Promise<ApiResponse<Field>> {
    return this.put<Field>(`/api/fields/${id}/boundaries`, { boundaries })
  }

  async calculateFieldArea(boundaries: Position[]): Promise<ApiResponse<number>> {
    return this.post<number>("/api/fields/calculate-area", { boundaries })
  }

  async getFieldCoverage(
    id: string,
    timeRange?: { start: string; end: string },
  ): Promise<ApiResponse<{ coverage: number; heatmap: any[] }>> {
    const params = timeRange ? { start: timeRange.start, end: timeRange.end } : undefined
    return this.get<{ coverage: number; heatmap: any[] }>(`/api/fields/${id}/coverage`, { params })
  }
}

export const fieldService = new FieldService()
