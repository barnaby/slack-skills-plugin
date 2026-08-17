import { describe, test, expect } from 'vitest'
import { execFile } from 'node:child_process'
import { join } from 'node:path'

const ENTRY = join(__dirname, '..', '..', 'src', 'index.ts')
const TSX = join(__dirname, '..', '..', 'node_modules', '.bin', 'tsx')

function runServer(env: Record<string, string>): Promise<{ code: number | null; stderr: string }> {
  return new Promise((resolve) => {
    execFile(
      TSX,
      [ENTRY],
      // PATH is needed so the tsx shim can find node; everything else is explicit.
      { env: { PATH: process.env.PATH ?? '', ...env }, timeout: 15_000 },
      (error, _stdout, stderr) => {
        const code = error && typeof error.code === 'number' ? error.code : error ? null : 0
        resolve({ code, stderr })
      },
    )
  })
}

describe('index env validation', () => {
  test('exits 1 when both tokens are missing', async () => {
    const { code, stderr } = await runServer({})
    expect(code).toBe(1)
    expect(stderr).toContain('SLACK_BOT_TOKEN is missing or invalid')
  })

  test('exits 1 when only the bot token is set', async () => {
    const { code, stderr } = await runServer({ SLACK_BOT_TOKEN: 'xoxb-test' })
    expect(code).toBe(1)
    expect(stderr).toContain('SLACK_APP_TOKEN is missing or invalid')
  })

  test('exits 1 when only the app token is set', async () => {
    const { code, stderr } = await runServer({ SLACK_APP_TOKEN: 'xapp-test' })
    expect(code).toBe(1)
    expect(stderr).toContain('SLACK_BOT_TOKEN is missing or invalid')
  })

  test('exits 1 when token prefixes are malformed', async () => {
    const { code, stderr } = await runServer({
      SLACK_BOT_TOKEN: 'xoxp-wrong-kind',
      SLACK_APP_TOKEN: 'xapp-test',
    })
    expect(code).toBe(1)
    expect(stderr).toContain('must start with xoxb-')
  })
})
