import fs from 'fs'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'

function readJSON(path) {
  return JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }))
}

function buildMetaString(meta) {
  const lines = []
  for (const [key, value] of Object.entries(meta)) {
    if (typeof value === 'string') {
      lines.push(`// @${key} ${value}`)
    } else if (Array.isArray(value)) {
      value.forEach((item) => lines.push(`// @${key} ${item}`))
    }
  }
  return `// ==UserScript==\n${lines.join('\n')}\n// ==/UserScript==\n`
}

const pkg = readJSON('package.json')

// clean dist
if (fs.existsSync('dist')) {
  fs.readdirSync('dist').forEach((file) => fs.rmSync(`dist/${file}`))
}

export default fs
  .readdirSync('src', { withFileTypes: true })
  .filter((ent) => ent.isDirectory)
  .map((ent) => {
    const meta = readJSON(`src/${ent.name}/meta.json`)
    meta.namespace = pkg.namespace
    meta.author = pkg.author
    meta.license = pkg.license
    meta.homepage = `${pkg.namespace}/tree/main/src/${ent.name}`

    const metaStr = buildMetaString(meta)

    return {
      input: `src/${ent.name}/index.ts`,
      output: {
        file: `dist/${ent.name}.user.js`,
        format: 'iife',
        banner: metaStr,
      },
      plugins: [
        resolve({
          browser: true,
        }),
        json(),
        typescript(),
        commonjs(),
        // terser({
        //   format: {
        //     preamble: metaStr,
        //   },
        // }),
      ],
    }
  })
