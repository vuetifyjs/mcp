import { platform } from 'std-env'
import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import which from 'which'

export function defaultDetection (name: string) {
  return async () => await which(name).then(() => true).catch(() => false)
}

export async function isProgramInstalled (programName: string): Promise<boolean> {
  const basicCheck = await defaultDetection(programName)()

  if (basicCheck) {
    return true
  }

  if (platform === 'win32') {
    return await checkWindowsApp(programName)
  } else if (platform === 'darwin') {
    return await checkMacOSApp(programName)
  } else {
    return false
  }
}

export async function checkWindowsApp (programName: string) {
  const possibleDirs = [
    process.env['LOCALAPPDATA'],
    process.env['ProgramFiles'],
    process.env['ProgramFiles(x86)'],
  ]

  for (const dir of possibleDirs) {
    if (!dir) {
      continue
    }
    const files = findFileRecursive(dir, `${programName}.exe`)
    if (files.length > 0) {
      return true
    }
  }

  return false
}

export async function checkMacOSApp (programName: string): Promise<boolean> {
  const appPaths = [
    `/Applications/${programName}.app`,
    path.join(os.homedir(), `Applications/${programName}.app`),
  ]

  for (const appPath of appPaths) {
    if (fs.existsSync(appPath)) {
      return true
    }
  }

  return false
}

function findFileRecursive (startPath: string, filter: string) {
  if (!fs.existsSync(startPath)) {
    return []
  }

  let results = [] as string[]

  const files = fs.readdirSync(startPath)
  for (const file of files) {
    const filename = path.join(startPath, file)
    let stat
    try {
      stat = fs.statSync(filename)
    } catch {
      continue
    }

    if (stat.isDirectory()) {
      results = results.concat(findFileRecursive(filename, filter))
    } else if (filename.endsWith(filter)) {
      results.push(filename)
    }
  }

  return results
}
