import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, 'dist', 'index.html');

if (!fs.existsSync(filePath)) {
  console.error('dist/index.html not found. Please run build first.');
  process.exit(1);
}

let html = fs.readFileSync(filePath, 'utf-8');

html = html.replace(/\s+rel\s*=\s*["']preload["']/gi, '');

fs.writeFileSync(filePath, html, 'utf-8');

console.log('✅ All `rel="preload"` attributes have been removed.');