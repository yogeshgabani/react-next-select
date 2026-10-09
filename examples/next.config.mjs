import path from 'node:path'
import { fileURLToPath } from 'node:url'

// The library lives one folder up. `file:../` in package.json normally links it
// into node_modules, but on drives without symlink support (e.g. exFAT) npm
// leaves an empty folder there, so point webpack at the built files directly.
// Run `npm run build` (or `npm run dev` to watch) in the root to refresh dist/.
const libDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-next-select'],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-next-select$': path.join(libDist, 'index.js'),
      'react-next-select/style.css$': path.join(libDist, 'style.css'),
    }
    return config
  },
}

export default nextConfig
