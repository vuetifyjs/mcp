import { x } from 'tinyexec'
import { isWindows } from 'std-env'

export async function getRunningProcesses (): Promise<string[]> {
  try {
    if (isWindows) {
      const { stdout } = await x('wmic', ['process', 'get', 'commandline'])
      return stdout.split('\r\n')
    } else {
      const { stdout } = await x('ps', ['-A', '-o', 'command'])
      return stdout.split('\n')
    }
  } catch {
    return []
  }
}

export async function findRunningIDEInstances (ideName: string): Promise<string[]> {
  const processes = await getRunningProcesses()
  const instances = new Set<string>()

  for (const cmd of processes) {
    if (cmd.toLowerCase().includes(ideName.toLowerCase())) {
      try {
        // Use regex to capture user-data-dir as arguments might contain spaces not properly quoted in ps output
        // Logic: match --user-data-dir, optionally followed by = or space, then optional quote, then content until the same quote or (if no quote) until next flag or end
        const match = cmd.match(/--user-data-dir[=\s](["']?)(.*?)\1(?:\s+--|$)/)
        if (match) {
          const userDataDir = match[2]
          if (userDataDir) {
            instances.add(userDataDir)
          }
        }
      } catch {
        // ignore parsing errors
      }
    }
  }

  return Array.from(instances)
}
