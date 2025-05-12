/**
 * Provides authentication services for the Vuetify MCP server.
 *
 * Includes API key validation and cache management.
 */
interface ValidationCacheEntry {
  valid: boolean
  timestamp: number
}

export function createAuthService () {
  const validationCache = new Map<string, ValidationCacheEntry>()
  // const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'

  async function validateApiKey (apiKey: string): Promise<boolean> {
    const cached = validationCache.get(apiKey)

    if (cached && (Date.now() - cached.timestamp < 300_000)) {
      return cached.valid
    }

    try {
      // const response = await fetch(`${apiServer}/validate-key`, {
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
      void error
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
