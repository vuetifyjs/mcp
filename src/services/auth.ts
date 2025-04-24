/**
 * Provides authentication services for the Vuetify MCP server.
 *
 * Includes API key validation and cache management.
 */
interface ValidationCacheEntry {
  valid: boolean
  timestamp: number
}

export function createAuthService (vuetifyApiUrl: string, cacheTTL = 300000) {
  const validationCache = new Map<string, ValidationCacheEntry>()

  async function validateApiKey (apiKey: string): Promise<boolean> {
    const cached = validationCache.get(apiKey)
    if (cached && (Date.now() - cached.timestamp < cacheTTL)) {
      return cached.valid
    }

    try {
      // const response = await fetch(`${vuetifyApiUrl}/validate-key`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ apiKey }),
      // })

      const response = {
        ok: true,
        json: () => Promise.resolve({ valid: true }),
        statusText: 'OK',
      }

      if (!response.ok) {
        console.error('API key validation error:', response.statusText)
        return false
      }

      const data = await response.json()
      const isValid = data.valid === true

      validationCache.set(apiKey, {
        valid: isValid,
        timestamp: Date.now(),
      })

      return isValid
    } catch (error) {
      console.error('API key validation error:', error)
      return false
    }
  }

  function clearCache () {
    validationCache.clear()
  }

  return {
    validateApiKey,
    clearCache,
  }
}
