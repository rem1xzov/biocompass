/* Проверка плагина без Figma: заглушка API + рендер превью в SVG.
 *
 *   node scripts/test-plugin.mjs
 *
 * Запускает figma-plugin/code.js в песочнице Node с мок-объектом `figma`,
 * собирает сцену (фреймы, карточки, коннекторы), проверяет инварианты и
 * сохраняет preview/figma-plugin-architecture.svg + отчёт reports/figma-plugin-scene.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const CODE = path.join(SITE, 'figma-plugin', 'code.js');
const OUT_SVG = path.join(SITE, 'preview', 'figma-plugin-architecture.svg');
const OUT_JSON = path.join(SITE, 'reports', 'figma-plugin-scene.json');

let idCounter = 0;
const nextId = () => 'n' + (++idCounter);

class MockNode {
  constructor(type) {
    this.id = nextId();
    this.type = type;
    this.children = [];
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.fills = [];
    this.strokes = [];
    this.strokeWeight = 1;
    this.strokeDashes = [];
    this.text = '';
    this.characters = '';
    this.name = type;
    this.fontSize = 12;
    this.textAutoResize = 'NONE';
    this.cornerRadius = 0;
    this.fontName = { family: 'Inter', style: 'Regular' };
  }
  appendChild(child) { this.children.push(child); return child; }
  resize(w, h) { this.width = w; this.height = h; }
}

const page = new MockNode('PAGE');
const notifications = [];
const figma = {
  currentPage: page,
  viewport: { scrollAndZoomIntoView: () => {} },
  notify: (msg) => notifications.push(String(msg)),
  closePlugin: () => {},
  loadFontAsync: async () => {},
  createFrame: () => new MockNode('FRAME'),
  createText: () => new MockNode('TEXT'),
  createShapeWithText: () => new MockNode('SHAPE_WITH_TEXT'),
  createConnector: () => {
    const c = new MockNode('CONNECTOR');
    c.connectorStart = null;
    c.connectorEnd = null;
    c.connectorLineType = 'ELBOWED';
    c.text = '';
    c.textFontName = null;
    return c;
  }
};

const code = fs.readFileSync(CODE, 'utf8');
vm.runInNewContext(code, { figma, console, setTimeout, Promise });

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const paintColor = (paints, fallback) => {
  if (!Array.isArray(paints) || !paints.length) return fallback;
  const p = paints[0];
  if (!p || !p.color) return fallback;
  const to = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + to(p.color.r) + to(p.color.g) + to(p.color.b);
};
const charW = (ch) => (/[А-Яа-яЁё]/.test(ch) ? 0.60 : ch === ' ' ? 0.30 : 0.55);
const measure = (text, size) => [...String(text)].reduce((acc, ch) => acc + charW(ch) * size, 0);
function wrapText(value, size, maxWidth) {
  const words = String(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? line + ' ' + word : word;
    if (measure(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

setTimeout(() => {
  const frames = page.children.filter((n) => n.type === 'FRAME');
  const connectors = page.children.filter((n) => n.type === 'CONNECTOR');
  const all = [];
  const walk = (node, ox, oy) => {
    for (const c of node.children || []) {
      const x = ox + (c.x || 0);
      const y = oy + (c.y || 0);
      all.push({ node: c, x, y });
      walk(c, x, y);
    }
  };
  frames.forEach((f) => walk(f, f.x, f.y));

  const shapes = all.filter((i) => i.node.type === 'SHAPE_WITH_TEXT');
  const texts = all.filter((i) => i.node.type === 'TEXT' && i.node.characters);
  const titles = texts.map((t) => t.node.characters);

  const problems = [];
  if (frames.length !== 6) problems.push(`ожидалось 6 фреймов, получено ${frames.length}`);
  if (connectors.length < 40) problems.push(`мало связей: ${connectors.length}`);
  if (shapes.length < 80) problems.push(`мало карточек: ${shapes.length}`);
  for (const word of ['Функциональная архитектура', 'Общие функции', 'Функциональный сценарий',
    'Матрица: раздел × компонент', 'Слой данных', 'Цикл статей']) {
    if (!titles.some((t) => t.includes(word))) problems.push(`нет заголовка «${word}»`);
  }
  const ids = new Set(all.map((i) => i.node.id));
  for (const c of connectors) {
    const s = c.connectorStart && c.connectorStart.endpointNodeId;
    const e = c.connectorEnd && c.connectorEnd.endpointNodeId;
    if (!ids.has(s) || !ids.has(e)) problems.push(`связь ${c.id} ссылается на отсутствующий узел`);
  }

  // пересечения карточек (контейнеры секций не считаем)
  const cards = shapes.filter((s) => s.node.width < 700 && s.node.name !== 'section' && s.node.name !== 'container');
  let overlaps = 0;
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const a = cards[i];
      const b = cards[j];
      const ox = Math.min(a.x + a.node.width, b.x + b.node.width) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.node.height, b.y + b.node.height) - Math.max(a.y, b.y);
      if (ox > 4 && oy > 4) overlaps += 1;
    }
  }
  if (overlaps) problems.push(`пересечения карточек: ${overlaps}`);

  console.log('FRAMES', frames.map((f) => `${f.name} ${Math.round(f.width)}x${Math.round(f.height)}`));
  console.log('SHAPES', shapes.length, 'TEXTS', texts.length, 'CONNECTORS', connectors.length);
  console.log('NOTIFY', JSON.stringify(notifications));
  console.log(problems.length ? 'PROBLEMS ' + JSON.stringify(problems) : 'CHECKS ok');

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify({
    frames: frames.map((f) => ({
      name: f.name, x: f.x, y: f.y, width: f.width, height: f.height,
      shapes: f.children.filter((c) => c.type === 'SHAPE_WITH_TEXT').length,
      texts: f.children.filter((c) => c.type === 'TEXT').length
    })),
    connectors: connectors.length,
    notifications, problems
  }, null, 2) + '\n', 'utf8');

  /* ------------------------------ SVG ------------------------------ */
  const W = Math.max(...frames.map((f) => f.x + f.width));
  const H = Math.max(...frames.map((f) => f.y + f.height));
  const parts = [];

  frames.forEach((f) => {
    const fill = paintColor(f.fills, '#FCFAF5');
    parts.push(`<rect x="${f.x}" y="${f.y}" width="${f.width}" height="${f.height}" fill="${fill}"/>`);
    parts.push(`<rect x="${f.x + 0.5}" y="${f.y + 0.5}" width="${f.width - 1}" height="${f.height - 1}" fill="none" stroke="#E4DDCD"/>`);
  });

  const byId = {};
  all.forEach((i) => { byId[i.node.id] = i; });

  for (const c of connectors) {
    const s = byId[c.connectorStart && c.connectorStart.endpointNodeId];
    const e = byId[c.connectorEnd && c.connectorEnd.endpointNodeId];
    if (!s || !e) continue;
    const sx = s.x + s.node.width / 2;
    const sy = s.y + s.node.height / 2;
    const ex = e.x + e.node.width / 2;
    const ey = e.y + e.node.height / 2;
    const mx = (sx + ex) / 2;
    parts.push(`<path d="M${sx.toFixed(1)},${sy.toFixed(1)} L${mx.toFixed(1)},${sy.toFixed(1)} L${mx.toFixed(1)},${ey.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)}" ` +
      `fill="none" stroke="${paintColor(c.strokes, '#B3BDB6')}" stroke-width="${c.strokeWeight || 1.2}" opacity="0.8"/>`);
  }

  shapes.forEach(({ node, x, y }) => {
    const fill = paintColor(node.fills, 'none');
    const stroke = paintColor(node.strokes, '#D8D0C0');
    const dash = node.strokeDashes && node.strokeDashes.length ? ' stroke-dasharray="5 5"' : '';
    const radius = node.cornerRadius || 0;
    if (node.shapeType === 'DIAMOND') {
      const cx = x + node.width / 2;
      const cy = y + node.height / 2;
      parts.push(`<polygon points="${cx},${y} ${x + node.width},${cy} ${cx},${y + node.height} ${x},${cy}" fill="${fill}" stroke="${stroke}"/>`);
    } else {
      parts.push(`<rect x="${x}" y="${y}" width="${node.width}" height="${node.height}" rx="${radius}" fill="${fill}" stroke="${stroke}"${dash}/>`);
    }
  });

  texts.forEach(({ node, x, y }) => {
    const size = node.fontSize || 12;
    const fill = paintColor(node.fills, '#14231C');
    const bold = /Bold|Semi Bold|Medium/.test((node.fontName && node.fontName.style) || '');
    const maxWidth = node.textAutoResize === 'HEIGHT' && node.width ? node.width : 2000;
    const lines = wrapText(node.characters, size, maxWidth);
    lines.forEach((line, i) => {
      const ly = y + size + i * size * 1.32;
      parts.push(`<text x="${x.toFixed(1)}" y="${ly.toFixed(1)}" font-family="Inter, Segoe UI, Arial, sans-serif" ` +
        `font-size="${size}" font-weight="${bold ? 700 : 400}" fill="${fill}">${esc(line)}</text>`);
    });
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(W)}" height="${Math.ceil(H)}" ` +
    `viewBox="0 0 ${Math.ceil(W)} ${Math.ceil(H)}">` +
    `<rect width="${Math.ceil(W)}" height="${Math.ceil(H)}" fill="#F1ECE0"/>` + parts.join('\n') + '</svg>';
  fs.mkdirSync(path.dirname(OUT_SVG), { recursive: true });
  fs.writeFileSync(OUT_SVG, svg, 'utf8');
  console.log('SVG', OUT_SVG, `${Math.ceil(W)}x${Math.ceil(H)}`);
}, 300);
