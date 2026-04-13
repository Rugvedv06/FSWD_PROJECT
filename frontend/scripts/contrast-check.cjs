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

function parseVarsFromCssBlock(block) {
  const map = {};
  let mm;
  while ((mm = varRegex.exec(block))) {
    map[mm[1]] = mm[2].trim();
  }
  return map;
}

// capture theme blocks (dark and warm). If not found, fall back to whole file.
const darkMatch = content.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/i);
const warmMatch = content.match(/\[data-theme="warm"\]\s*\{([\s\S]*?)\n\}/i);
const varsAll = parseVarsFromCssBlock(content);
const varsDark = darkMatch ? parseVarsFromCssBlock(darkMatch[1]) : varsAll;
const varsWarm = warmMatch ? parseVarsFromCssBlock(warmMatch[1]) : varsAll;

function parseColor(v) {
  if (!v) return null;
  v = v.replace(/;$/, '').trim();
  if (v.startsWith('#')) return hexToRgb(v);
  if (v.startsWith('rgba')) return rgbaToRgb(v);
  if (v.startsWith('rgb(')) return rgbaToRgb(v);
  // fallback try to resolve var(...) by looking up in map
  const varRef = v.match(/var\((--[a-z0-9-]+)\)/i);
  if (varRef) {
    const name = varRef[1].replace(/^--/, '');
    // try dark then warm then all
    const val = varsDark[name] || varsWarm[name] || varsAll[name];
    if (val) return parseColor(val);
  }
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
  {name: 'Text on Background', fg: 'brand-text', bg: 'brand-bg', threshold: 4.5},
  {name: 'Muted on Background', fg: 'brand-muted', bg: 'brand-bg', threshold: 4.5},
  {name: 'Accent on Background', fg: 'brand-primary', bg: 'brand-bg', threshold: 4.5},
  {name: 'Accent-dark on Background', fg: 'brand-primary-dark', bg: 'brand-bg', threshold: 4.5},
  {name: 'Text on Surface', fg: 'brand-text', bg: 'brand-surface', threshold: 4.5},
  {name: 'Muted on Surface', fg: 'brand-muted', bg: 'brand-surface', threshold: 4.5}
];

console.log('Running programmatic contrast checks using CSS variables from', cssPath);

function runChecksFor(varsMap, label) {
  console.log('\nTheme:', label);
  console.log('  sample:', {
    'brand-primary': varsMap['brand-primary'],
    'brand-primary-dark': varsMap['brand-primary-dark'],
    'brand-bg': varsMap['brand-bg'],
    'brand-text': varsMap['brand-text']
  });
  const res = [];
  for (const c of checks) {
    const fgRaw = varsMap[c.fg] || varsAll[c.fg];
    const bgRaw = varsMap[c.bg] || varsAll[c.bg];
    const fg = parseColor(fgRaw);
    const bg = parseColor(bgRaw);
    if (!fg || !bg) {
      res.push({name: c.name, pass: false, ratio: null, reason: `Missing or unsupported color for ${c.fg} or ${c.bg}`});
      continue;
    }
    const ratio = contrast(fg, bg);
    const pass = ratio >= c.threshold;
    res.push({name: c.name, ratio: fmt(ratio), pass});
  }
  res.forEach(r => {
    if (r.pass) console.log(`  ✓ ${r.name}: ${r.ratio}:1`);
    else console.log(`  ✗ ${r.name}: ${r.ratio ? r.ratio+':1' : 'N/A'}  (fail)`);
  });
  return res;
}

const darkResults = runChecksFor(varsDark, 'dark');
const warmResults = runChecksFor(varsWarm, 'warm');

const darkFail = darkResults.filter(r => !r.pass);
const warmFail = warmResults.filter(r => !r.pass);

if (darkFail.length === 0 && warmFail.length === 0) {
  console.log('\nAll checked pairs meet the target thresholds for both themes.');
  process.exit(0);
}

console.log(`\nSummary: dark theme failures: ${darkFail.length}, warm theme failures: ${warmFail.length}`);
process.exit(2);
