import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const outputDir = path.join(root, '.vercel', 'output');
const staticDir = path.join(outputDir, 'static');
const configPath = path.join(outputDir, 'config.json');

execSync('npx expo export --platform web', { cwd: root, stdio: 'inherit' });

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(staticDir, { recursive: true });
fs.cpSync(dist, staticDir, { recursive: true });

const config = {
  version: 3,
  images: {
    sizes: [160, 320, 640, 1280],
    domains: [],
    qualities: [75, 80, 90],
    localPatterns: [{ pathname: '^/assets/.*$', search: '' }],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 300,
  },
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Build Output API ready at', path.relative(root, outputDir));
