import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Compiling TypeScript for @ui5-inspector/vite...');
execSync('npx tsc -p tsconfig.json', { cwd: __dirname, stdio: 'inherit' });
console.log('packages/vite built successfully!');
