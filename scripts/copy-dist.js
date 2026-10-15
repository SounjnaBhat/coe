const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../packages/app/dist');
const dest = path.resolve(__dirname, '../dist');

if (fs.existsSync(src)) {
  fs.cpSync(src, dest, { recursive: true });
  console.log('Successfully copied packages/app/dist to dist for Vercel deployment.');
} else {
  console.warn('Warning: packages/app/dist does not exist.');
}
