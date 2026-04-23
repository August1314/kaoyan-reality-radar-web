import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomInt } from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isEntitlementLevel, normalizeCode, type CodeRecord } from '../api/_lib/entitlements.ts'
import { kvSet } from '../api/_lib/kv.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const privateDir = path.join(rootDir, 'private')
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

interface CreateCodesOptions {
  level: 'survey' | 'paid'
  count: number
}

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function parseOptions(): CreateCodesOptions {
  const level = readArg('level')
  const count = Number(readArg('count') ?? '0')

  if (!level || !isEntitlementLevel(level) || level === 'free') {
    throw new Error('请使用 --level survey 或 --level paid')
  }

  if (!Number.isInteger(count) || count <= 0 || count > 500) {
    throw new Error('请使用 --count 指定 1-500 之间的整数')
  }

  return { level, count }
}

function randomGroup(size: number): string {
  let value = ''
  for (let index = 0; index < size; index += 1) {
    value += ALPHABET[randomInt(ALPHABET.length)]
  }
  return value
}

function createCode(level: 'survey' | 'paid'): string {
  const prefix = level === 'paid' ? 'KR-P' : 'KR-S'
  return normalizeCode(`${prefix}-${randomGroup(4)}-${randomGroup(4)}-${randomGroup(4)}`)
}

function toCsv(rows: string[][]): string {
  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
}

export async function createCodes(options: CreateCodesOptions): Promise<string> {
  const createdAt = new Date().toISOString()
  const codes = new Set<string>()

  while (codes.size < options.count) {
    codes.add(createCode(options.level))
  }

  for (const code of codes) {
    const record: CodeRecord = {
      level: options.level,
      status: 'unused',
      createdAt,
    }
    await kvSet(`code:${code}`, record)
  }

  await mkdir(privateDir, { recursive: true })
  const fileName = `codes-${options.level}-${createdAt.replace(/[:.]/g, '-')}.csv`
  const outputPath = path.join(privateDir, fileName)
  const rows = [
    ['code', 'level', 'status', 'createdAt'],
    ...Array.from(codes).map((code) => [code, options.level, 'unused', createdAt]),
  ]
  await writeFile(outputPath, `${toCsv(rows)}\n`, 'utf-8')
  return outputPath
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createCodes(parseOptions())
    .then((outputPath) => {
      console.log(`Created codes CSV: ${outputPath}`)
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error)
      process.exit(1)
    })
}
