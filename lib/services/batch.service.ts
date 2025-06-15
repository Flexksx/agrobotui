import { BaseService } from "./base.service"
import type { ApiResponse } from "@/lib/types"

interface BatchCommand {
  robotId: string
  command: string
  parameters?: Record<string, any>
}

interface BatchCommandResult {
  robotId: string
  success: boolean
  result?: any
  error?: string
}

export class BatchService extends BaseService {
  constructor() {
    super()
  }

  async executeBatchCommands(commands: BatchCommand[]): Promise<ApiResponse<BatchCommandResult[]>> {
    return this.post<BatchCommandResult[]>("/api/robots/batch-command", { commands })
  }

  async updateMultipleRobots(
    robotIds: string[],
    updates: Record<string, any>,
  ): Promise<ApiResponse<BatchCommandResult[]>> {
    return this.post<BatchCommandResult[]>("/api/robots/batch-update", {
      robotIds,
      updates,
    })
  }

  async startMultipleMissions(
    assignments: { robotId: string; missionId: string }[],
  ): Promise<ApiResponse<BatchCommandResult[]>> {
    return this.post<BatchCommandResult[]>("/api/missions/batch-start", { assignments })
  }

  async emergencyStopAll(): Promise<ApiResponse<BatchCommandResult[]>> {
    return this.post<BatchCommandResult[]>("/api/robots/emergency-stop-all")
  }

  async returnAllToBase(): Promise<ApiResponse<BatchCommandResult[]>> {
    return this.post<BatchCommandResult[]>("/api/robots/return-all-to-base")
  }
}

export const batchService = new BatchService()
