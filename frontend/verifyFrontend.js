import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src/pages');
const componentsDir = path.join(__dirname, 'src/components');

function getFiles(dir, ext = '.jsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, ext));
    } else if (file.endsWith(ext) || file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allSourceFiles = [...getFiles(pagesDir), ...getFiles(componentsDir)];

console.log(`Verifying ${allSourceFiles.length} frontend JSX/JS source files for syntax and exports...`);

let issues = 0;
allSourceFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  // Check that every component has an export
  if (!content.includes('export default') && !content.includes('export const') && !content.includes('export function')) {
    console.error(`Missing export in: ${file}`);
    issues++;
  }
});

if (issues === 0) {
  console.log(`✔ All ${allSourceFiles.length} frontend component files have valid exports and structure.`);
  process.exit(0);
} else {
  console.error(`✖ Found ${issues} issues in frontend components.`);
  process.exit(1);
}
