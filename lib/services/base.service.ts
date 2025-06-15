import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import type { ApiResponse, PaginatedResponse } from "@/lib/types"

export class BaseService {
  protected api: AxiosInstance
  protected baseURL: string
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map()

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") {
    this.baseURL = baseURL
    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem("auth_token")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem("auth_token")
          window.location.href = "/login"
        }
        return Promise.reject(error)
      },
    )
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.get(url, config)
      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, data, config)
      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.put(url, data, config)
      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(url, config)
      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  protected async getPaginated<T>(
    url: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      const response: AxiosResponse<PaginatedResponse<T>> = await this.api.get(url, { params })
      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  protected startPolling(key: string, callback: () => Promise<void>, interval = 5000): void {
    this.stopPolling(key)
    const intervalId = setInterval(callback, interval)
    this.pollingIntervals.set(key, intervalId)
  }

  protected stopPolling(key: string): void {
    const intervalId = this.pollingIntervals.get(key)
    if (intervalId) {
      clearInterval(intervalId)
      this.pollingIntervals.delete(key)
    }
  }

  protected stopAllPolling(): void {
    this.pollingIntervals.forEach((intervalId) => clearInterval(intervalId))
    this.pollingIntervals.clear()
  }
}
