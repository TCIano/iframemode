#!/usr/bin/env node

import { execSync } from 'child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { join, resolve } from 'path'
import { createInterface } from 'readline'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const TEMPLATE_DIR = resolve(__dirname)

// ── helpers ──────────────────────────────────────────────

function ask(query) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close()
      resolve(answer.trim())
    }),
  )
}

function copy(src, dest, filter) {
  const entries = readdirSync(src, { withFileTypes: true })
  mkdirSync(dest, { recursive: true })
  for (const e of entries) {
    const d = join(dest, e.name),
      s = join(src, e.name)
    if (filter && !filter(s, e)) continue
    if (e.isDirectory()) copy(s, d, filter)
    else writeFileSync(d, readFileSync(s))
  }
}

// ── main ─────────────────────────────────────────────────

async function main() {
  const projectName = process.argv[2] || (await ask('Project name: '))
  if (!projectName) {
    console.error('Project name required.')
    process.exit(1)
  }

  const dest = resolve(process.cwd(), projectName)
  if (existsSync(dest)) {
    console.error(`"${projectName}" already exists.`)
    process.exit(1)
  }

  const IGNORE = new Set([
    '.git',
    '.idea',
    'create.js',
    'dist',
    'node_modules',
    'package-lock.json',
    'pnpm-lock.yaml',
  ])
  const IGNORE_PATHS = new Set([
    join(TEMPLATE_DIR, '.claude', 'settings.local.json'),
  ])

  const filter = (fp, entry) => {
    if (IGNORE.has(entry.name) || IGNORE_PATHS.has(fp)) return false
    if (entry.name.endsWith('.tsbuildinfo')) return false
    return true
  }

  // 1. copy template
  console.log(`\n  Creating project "${projectName}"...`)
  copy(TEMPLATE_DIR, dest, filter)
  console.log('  ✔ Template copied')

  // 2. patch package.json
  const pkgPath = join(dest, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  pkg.name = projectName
  pkg.version = '0.0.0'
  pkg.private = true
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  console.log('  ✔ package.json updated')

  // 3. init git
  console.log('  Initializing git...')
  execSync('git init', { cwd: dest, stdio: 'inherit' })

  // 4. install deps
  console.log('  Installing dependencies...')
  execSync('npm install', { cwd: dest, stdio: 'inherit' })
  console.log('  ✔ Dependencies installed')

  // 5. create the initial commit, including the generated lockfile
  execSync('git add .', { cwd: dest, stdio: 'inherit' })
  execSync('git commit -m "chore: 从模板初始化项目"', {
    cwd: dest,
    stdio: 'inherit',
  })
  console.log('  ✔ Git initialized')

  console.log(`\n  ── Done ──\n  cd ${projectName}\n  npm run dev\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
