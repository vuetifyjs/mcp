import isWsl from 'is-wsl'
import which from 'which'
import { platform } from 'std-env'

type ResolvedNpx = {
  path: string
  wsl: boolean
  pure: boolean
}

const macPaths = [
  '/usr/local/bin',
  '/opt/homebrew/bin',
  '/opt/local/bin',
  '/usr/bin',
]

const detectPureProgram = async (program: 'node' | 'npx'): Promise<boolean> => {
  if (platform !== 'darwin') {
    return true
  }
  return !!(await which(program, { nothrow: true, path: macPaths.join(':') }))
}

export async function detectProgram (program: 'node' | 'npx'): Promise<ResolvedNpx | null> {
  if (isWsl) {
    const { x } = await import('tinyexec')
    let windowsPath: string | undefined
    try {
      windowsPath = (await x('where.exe', [program], { throwOnError: true, nodeOptions: { shell: true } })).stdout
    } catch { /** */ }
    if (windowsPath) {
      return {
        path: windowsPath,
        wsl: false,
        pure: true,
      }
    } else {
      let wslPath: string | undefined
      try {
        wslPath = await which(program)
      } catch {
        return null
      }
      return wslPath
        ? {
            path: wslPath,
            wsl: true,
            pure: true,
          }
        : null
    }
  } else {
    let programPath: string | undefined
    try {
      programPath = await which(program)
    } catch {
      return null
    }
    return programPath
      ? {
          path: programPath,
          wsl: false,
          pure: await detectPureProgram(program),
        }
      : null
  }
}
