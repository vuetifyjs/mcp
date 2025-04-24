import axios from 'axios'

export class AuthService {
  private vuetifyApiUrl: string
  private validationCache: Map<string, { valid: boolean, timestamp: number }>
  private cacheTTL: number

  constructor(vuetifyApiUrl: string, cacheTTL = 300000) { // Default 5 minutes
    this.vuetifyApiUrl = vuetifyApiUrl
    this.validationCache = new Map()
    this.cacheTTL = cacheTTL
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    const cached = this.validationCache.get(apiKey)
    if (cached && (Date.now() - cached.timestamp < this.cacheTTL)) {
      return cached.valid
    }

    try {
      const response = await axios.post(`${this.vuetifyApiUrl}/validate-key`, {
        apiKey
      })

      const isValid = response.data.valid === true

      this.validationCache.set(apiKey, {
        valid: isValid,
        timestamp: Date.now()
      })

      return isValid
    } catch (error) {
      console.error('API key validation error:', error)
      return false
    }
  }

  clearCache(): void {
    this.validationCache.clear()
  }
}
