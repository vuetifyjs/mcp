import { homedir } from 'node:os'
import path from 'pathe'

export type IDEType = 'code' | 'trae' | 'cursor' | 'code-insiders'
export type OperatingSystem = 'win32' | 'darwin' | 'linux'
export type PathGetter = () => string
export type IDEPathSettings = Record<OperatingSystem, PathGetter[] | PathGetter>

export const code = {
  darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Code', 'User'),
  win32: () => path.join(process.env.APPDATA!, 'Code', 'User'),
  linux: () => path.join(homedir(), '.config', 'Code', 'User'),
}

export const trae = {
  darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Trae', 'User'),
  win32: () => path.join(process.env.APPDATA!, 'Trae', 'User'),
  linux: () => path.join(homedir(), '.config', 'Trae', 'User'),
}

export const cursor = {
  darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Cursor', 'User'),
  win32: () => path.join(process.env.APPDATA!, 'Cursor', 'User'),
  linux: () => path.join(homedir(), '.config', 'Cursor', 'User'),
}

export const codeInsiders = {
  darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Code - Insiders', 'User'),
  win32: () => path.join(process.env.APPDATA!, 'Code - Insiders', 'User'),
  linux: () => path.join(homedir(), '.config', 'Code - Insiders', 'User'),
}

export const idePathConfigs = {
  code,
  trae,
  cursor,
  'code-insiders': codeInsiders,
} as const
