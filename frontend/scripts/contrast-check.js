#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '..', 'src', 'index.css');
if (!fs.existsSync(cssPath)) {
  console.error('index.css not found at', cssPath);
  process.exit(1);
}

const content = fs.readFileSync(cssPath, 'utf8');

// extract CSS vars like --brand-text: #f8f7f1;
const varRegex = /--([a-z0-9-]+)\s*:\s*([^;\n]+)/gi;
const vars = {};
let m;
while ((m = varRegex.exec(content))) {
  vars[m[1]] = m[2].trim();
}

function parseColor(v) {
  if (!v) return null;
  v = v.replace(/;$/, '').trim();
  if (v.startsWith('#')) return hexToRgb(v);
  if (v.startsWith('rgba')) return rgbaToRgb(v);
  if (v.startsWith('rgb(')) return rgbaToRgb(v);
  // fallback try to strip var(...) or color-mix - return null
  return null;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbaToRgb(str) {
  const nums = str.replace(/rgba?\(|\)|\s/g,'').split(',').map(n => parseFloat(n));
  return nums.slice(0,3);
}

function lum(rgb) {
  const s = rgb.map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}

function contrast(a, b) {
  const La = lum(a);
  const Lb = lum(b);
  const L1 = Math.max(La, Lb);
  const L2 = Math.min(La, Lb);
  return (L1 + 0.05) / (L2 + 0.05);
}

function fmt(n) { return Number(n.toFixed(2)); }

const checks = [
  {name: 'Text on Background', fg: 'brand-text', bg: 'brand-bg', level: 'AA', threshold: 4.5},
  {name: 'Muted on Background', fg: 'brand-muted', bg: 'brand-bg', level: 'AA', threshold: 4.5},
  {name: 'Accent on Background', fg: 'brand-primary', bg: 'brand-bg', level: 'AA', threshold: 4.5},
  {name: 'Accent-dark on Background', fg: 'brand-primary-dark', bg: 'brand-bg', level: 'AA', threshold: 4.5},
  {name: 'Text on Surface', fg: 'brand-text', bg: 'brand-surface', level: 'AA', threshold: 4.5},
  {name: 'Muted on Surface', fg: 'brand-muted', bg: 'brand-surface', level: 'AA', threshold: 4.5}
];

console.log('Running programmatic contrast checks using CSS variables from', cssPath);
const results = [];
for (const c of checks) {
  const fgRaw = vars[c.fg];
  const bgRaw = vars[c.bg];
  const fg = parseColor(fgRaw);
  const bg = parseColor(bgRaw);
  if (!fg || !bg) {
    results.push({name: c.name, ok: false, reason: `Missing or unsupported color for ${c.fg} or ${c.bg}`});
    continue;
  }
  const ratio = contrast(fg, bg);
  const pass = ratio >= c.threshold;
  results.push({name: c.name, ratio: fmt(ratio), pass});
}

console.log('\nContrast results:');
results.forEach(r => {
  if (r.pass) console.log(`  ✓ ${r.name}: ${r.ratio}:1`);
  else console.log(`  ✗ ${r.name}: ${r.ratio ? r.ratio+':1' : 'N/A'}  (fail)`);
});

const failing = results.filter(r => !r.pass);
if (failing.length === 0) {
  console.log('\nAll checked pairs meet the target thresholds.');
  process.exit(0);
} else {
  console.log(`\n${failing.length} checks failed. Consider adjusting colors (e.g., darker muted or brighter text).`);
  process.exit(2);
}
