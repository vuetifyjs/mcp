export type IDEId = 'code' | 'trae' | 'cursor' | 'code-insiders' | 'claude' | 'windsurf'
export type OperatingSystem = 'win32' | 'darwin' | 'linux'

export interface KnownIDE {
  brand: string
  id: IDEId
  detect: {
    darwin?: () => Promise<boolean>
    win32?: () => Promise<boolean>
    linux?: () => Promise<boolean>
  }
  settings: {
    darwin?: () => string
    win32?: () => string
    linux?: () => string
  }
  settingsFile?: {
    darwin?: string
    win32?: string
    linux?: string
  } | string
}

export interface DetectedIDE {
  ide: IDEId
  brand: string
  settingsDir: string
  settingsFile: string
}
