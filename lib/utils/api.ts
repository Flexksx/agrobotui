export function createApiUrl(endpoint: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  return `${base.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`
}

export function handleApiError(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return "An unexpected error occurred"
}

export function isApiError(error: any): boolean {
  return error.response && error.response.status >= 400
}

export function getApiErrorStatus(error: any): number | null {
  return error.response?.status || null
}

export function createQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

export function retryApiCall<T>(apiCall: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const attempt = async () => {
      try {
        const result = await apiCall()
        resolve(result)
      } catch (error) {
        attempts++

        if (attempts >= maxRetries) {
          reject(error)
          return
        }

        // Exponential backoff
        const retryDelay = delay * Math.pow(2, attempts - 1)
        setTimeout(attempt, retryDelay)
      }
    }

    attempt()
  })
}
