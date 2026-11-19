/* Рендер превью фреймов плагина в PNG.
 *
 *   node scripts/render-plugin-preview.mjs
 *
 * Требуется Chrome (путь: переменная CHROME_PATH или стандартный путь Windows).
 * Берёт preview/figma-plugin-architecture.svg, для каждого фрейма из
 * reports/figma-plugin-scene.json делает отдельный SVG с viewBox фрейма и снимает PNG
 * в preview/figma-plugin-frame-<n>.png.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const SVG = path.join(SITE, 'preview', 'figma-plugin-architecture.svg');
const REPORT = path.join(SITE, 'reports', 'figma-plugin-scene.json');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCALE = 0.62;

if (!fs.existsSync(SVG) || !fs.existsSync(REPORT)) {
  console.error('Нет preview/figma-plugin-architecture.svg или отчёта — сначала node scripts/test-plugin.mjs');
  process.exit(1);
}
if (!fs.existsSync(CHROME)) {
  console.error(`Chrome не найден: ${CHROME}. Укажите CHROME_PATH.`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
const baseSvg = fs.readFileSync(SVG, 'utf8');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fa-frames-'));

const inner = baseSvg
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');

const perFrame = report.frames.map((f, i) => {
  const w = f.width;
  const h = f.height;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w * SCALE)}" height="${Math.round(h * SCALE)}" ` +
    `viewBox="${f.x || 0} ${f.y} ${w} ${h}">` +
    `<rect x="${f.x || 0}" y="${f.y}" width="${w}" height="${h}" fill="#FCFAF5"/>` + inner + '</svg>';
  const file = path.join(tmp, `frame-${i + 1}.svg`);
  fs.writeFileSync(file, svg, 'utf8');
  return { file, name: `figma-plugin-frame-${i + 1}.png`, w: Math.round(w * SCALE), h: Math.round(h * SCALE) };
});

const PORT = 9371;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const child = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', '--disable-extensions', '--lang=ru-RU',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(tmp, 'udd')}`,
  '--window-size=1800,1200', 'about:blank',
], { stdio: 'ignore' });
function finish(code) { try { child.kill(); } catch {} process.exit(code); }

let target = null;
for (let i = 0; i < 80; i++) {
  await sleep(250);
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === 'page');
    if (target) break;
  } catch {}
}
if (!target) { console.error('Chrome не открыл страницу'); finish(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
let seq = 0; const pending = new Map();
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result ?? msg.error); pending.delete(msg.id); }
});
const send = (method, params = {}) => {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res) => pending.set(id, res));
};
await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
await send('Page.enable');

for (const frame of perFrame) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: frame.w, height: frame.h, deviceScaleFactor: 1, mobile: false,
  });
  await send('Page.navigate', { url: pathToFileURL(frame.file).href });
  await sleep(700);
  const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  if (!r?.data) { console.error('Нет скриншота', frame.name); continue; }
  fs.writeFileSync(path.join(SITE, 'preview', frame.name), Buffer.from(r.data, 'base64'));
  console.log('SHOT', frame.name, `${frame.w}x${frame.h}`);
}

ws.close();
finish(0);
