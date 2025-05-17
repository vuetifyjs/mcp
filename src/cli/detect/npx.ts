import isWsl from 'is-wsl'
import which from 'which'

type ResolvedNpx = {
  path: string
  wsl: boolean
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
          }
        : null
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
          wsl: false,
        }
      : null
  }
}
