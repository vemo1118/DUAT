import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';
import { writeFileSync } from 'node:fs';
import { createPreorderWindow } from '../src/domain/preorderSchedule.js';

const timestamp = process.argv[2];
if (!timestamp || !/T.*(?:Z|[+-]\d\d:\d\d)$/.test(timestamp)) {
  throw new Error('Usage: node scripts/open-preorder.mjs <release ISO timestamp with timezone>');
}
const window = createPreorderWindow(timestamp);
writeFileSync(new URL('../src/domain/preorderWindow.js', import.meta.url),
  `// Fixed campaign dates; do not reset on rebuild or per visitor.\nexport const PREORDER_WINDOW = ${JSON.stringify(window, null, 2)};\n`);
console.log(window);
