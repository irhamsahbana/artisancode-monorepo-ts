import { mkdir, readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'

import { env } from '@/config/env'

const ICON_BASENAME = 'icon'

export const ICON_EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'image/webp': 'webp',
}

export const MAX_ICON_SIZE_BYTES = 2 * 1024 * 1024 // favicons should be tiny

async function removeExistingIcon(): Promise<void> {
  const files = await readdir(env.BRANDING_STORAGE_DIR).catch(() => [] as string[])
  await Promise.all(
    files
      .filter((f) => f.startsWith(`${ICON_BASENAME}.`))
      .map((f) => unlink(join(env.BRANDING_STORAGE_DIR, f)).catch(() => undefined)),
  )
}

// Single-tenant — only one icon exists at a time, so a new upload (possibly a
// different extension) replaces whatever was there before.
export async function saveIcon(file: File, ext: string): Promise<string> {
  await mkdir(env.BRANDING_STORAGE_DIR, { recursive: true })
  await removeExistingIcon()
  const filename = `${ICON_BASENAME}.${ext}`
  await Bun.write(join(env.BRANDING_STORAGE_DIR, filename), file)
  return filename
}

export async function deleteIcon(): Promise<void> {
  await removeExistingIcon()
}
