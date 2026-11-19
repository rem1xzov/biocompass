/* «Биокомпас» — плагин FigJam: рисует функциональную архитектуру продукта.
 *
 * Подход взят из цикла Павла Шерера «Функциональная архитектура цифровых
 * продуктов» (ч. 1–2): функции — это события, они вкладываются в разделы,
 * общие функции выносятся отдельно, у функций есть типы и зависимости.
 * Содержание адаптировано под бизнес «Биокомпаса»: открытая платформа о
 * протезировании, справочник без рекламы, медицинская срочность только после
 * клинической редактуры.
 *
 * Код рисует шесть фреймов:
 *   1. Функциональная модель: разделы и функции
 *   2. Общие функции и блокировки
 *   3. Функциональный сценарий (пример: подбор центра)
 *   4. Матрица «раздел × компонент»
 *   5. Слой данных: сущности и связи
 *   6. Цикл статей по типовым входам
 */

const C = {
  ink: '#14231C',
  paper: '#FCFAF5',
  bg: '#F6F1E6',
  accent: '#F45B2A',
  accentSoft: '#FDE7E1',
  muted: '#6B7A72',
  line: '#D8D0C0',
  green: '#2B5B43',
  greenSoft: '#E7F0EA',
  amber: '#8A5314',
  amberSoft: '#FDF0DA',
  blue: '#2F5D8A',
  blueSoft: '#E3ECF5',
  white: '#FFFFFF',
  red: '#9B2C10'
};

function rgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255
  };
}
const solid = (hex) => ({ type: 'SOLID', color: rgb(hex) });

let F_REG = { family: 'Inter', style: 'Regular' };
let F_MED = { family: 'Inter', style: 'Medium' };
let F_BOLD = { family: 'Inter', style: 'Bold' };

async function loadFonts() {
  for (const style of ['Regular', 'Medium', 'Semi Bold', 'Bold']) {
    try {
      await figma.loadFontAsync({ family: 'Inter', style });
      if (style === 'Semi Bold') F_MED = { family: 'Inter', style };
      if (style === 'Bold') F_BOLD = { family: 'Inter', style };
      if (style === 'Regular') F_REG = { family: 'Inter', style };
    } catch (e) { /* остаёмся на доступных */ }
  }
}

function text(parent, x, y, value, opts) {
  const o = opts || {};
  const node = figma.createText();
  node.fontName = o.bold ? F_BOLD : o.medium ? F_MED : F_REG;
  node.characters = String(value == null ? '' : value);
  node.fontSize = o.size || 13;
  node.x = x;
  node.y = y;
  node.fills = [solid(o.color || C.ink)];
  if (o.width) {
    node.resize(o.width, node.height);
    node.textAutoResize = 'HEIGHT';
  } else {
    node.textAutoResize = 'WIDTH_AND_HEIGHT';
  }
  parent.appendChild(node);
  return node;
}

function rect(parent, x, y, w, h, opts) {
  const o = opts || {};
  const node = figma.createShapeWithText();
  node.shapeType = o.shapeType || 'ROUNDED_RECTANGLE';
  node.resize(w, h);
  node.x = x;
  node.y = y;
  node.fills = o.fill ? [solid(o.fill)] : [];
  node.strokes = o.stroke ? [solid(o.stroke)] : [];
  node.strokeWeight = o.strokeWidth || 1;
  if (node.cornerRadius !== undefined) node.cornerRadius = o.radius == null ? 14 : o.radius;
  if (o.dashed) node.strokeDashes = [5, 5];
  node.text = '';
  parent.appendChild(node);
  return node;
}

function card(parent, x, y, w, h, title, subtitle, opts) {
  const o = opts || {};
  const box = rect(parent, x, y, w, h, {
    fill: o.fill || C.white,
    stroke: o.stroke || C.line,
    dashed: o.dashed,
    radius: o.radius == null ? 18 : o.radius
  });
  text(parent, x + 16, y + 12, title, { bold: true, size: o.titleSize || 14, width: w - 32 });
  if (subtitle) {
    text(parent, x + 16, y + 12 + (o.titleSize || 14) + 8, subtitle, {
      size: o.subtitleSize || 11, color: o.subtitleColor || C.muted, width: w - 32
    });
  }
  return box;
}

function section(parent, x, y, w, h, title, hint) {
  const box = rect(parent, x, y, w, h, { fill: C.bg, stroke: C.line, radius: 26 });
  box.name = 'section';
  text(parent, x + 20, y + 16, title.toUpperCase(), { bold: true, size: 11, color: C.muted });
  if (hint) text(parent, x + 20, y + 34, hint, { size: 11, color: C.muted, width: w - 40 });
  return box;
}

function connect(from, to, label, opts) {
  const o = opts || {};
  const c = figma.createConnector();
  c.connectorStart = { endpointNodeId: from.id, magnet: 'AUTO' };
  c.connectorEnd = { endpointNodeId: to.id, magnet: 'AUTO' };
  if (c.connectorLineType !== undefined) c.connectorLineType = o.lineType || 'ELBOWED';
  if (c.strokes !== undefined) c.strokes = [solid(o.color || C.muted)];
  if (c.strokeWeight !== undefined) c.strokeWeight = o.weight || 1.5;
  if (label && c.text !== undefined) {
    c.text = String(label);
    if (c.textFontName !== undefined) { try { c.textFontName = F_REG; } catch (e) {} }
    if (c.fontSize !== undefined) c.fontSize = 10;
  }
  figma.currentPage.appendChild(c);
  return c;
}

function frame(name, w, h) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.fills = [solid(C.paper)];
  figma.currentPage.appendChild(f);
  return f;
}

const TYPE_STYLE = {
  'П': { color: C.blue, label: 'польз.' },
  'С': { color: C.muted, label: 'сист.' },
  'У': { color: C.amber, label: 'условие' },
  'Н': { color: C.red, label: 'негатив' },
  '+': { color: C.green, label: 'позитив' }
};

function functionRow(parent, x, y, w, type, label) {
  const style = TYPE_STYLE[type] || TYPE_STYLE['С'];
  const badge = rect(parent, x, y + 1, 22, 18, { fill: C.white, stroke: style.color, radius: 6, strokeWidth: 1 });
  text(parent, x + 4, y + 3, type, { size: 10, bold: true, color: style.color });
  text(parent, x + 30, y, label, { size: 11, color: C.ink, width: w - 30 });
}

/* ------------------------------------------------------- 1. модель */

function buildModel(arch, originY) {
  const W = 3500;
  const H = 1180;
  const f = frame('ФА 1 · Функциональная модель: разделы и функции', W, H);
  f.x = 0;
  f.y = originY;

  text(f, 60, 40, arch.title, { bold: true, size: 40 });
  text(f, 60, 96, arch.subtitle, { size: 13, color: C.muted, width: 2200 });

  // уровни
  let lx = 60;
  arch.levels.forEach((lvl) => {
    card(f, lx, 150, 800, 96, `${lvl.code} · ${lvl.label}`, lvl.value, { fill: C.white, stroke: C.line, titleSize: 13, subtitleSize: 11 });
    lx += 820;
  });

  // разделы: 5 в ряд, 2 ряда
  const cardW = 620;
  const cardH = 360;
  const gapX = 40;
  const gapY = 40;
  const startY = 290;
  arch.sections.forEach((sec, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 60 + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    const box = card(f, x, y, cardW, cardH, `${sec.code}. ${sec.name}`, sec.role, {
      fill: C.white, stroke: C.line, titleSize: 16, subtitleSize: 11
    });
    box.name = 'container';
    let fy = y + 74;
    sec.functions.forEach(([type, label]) => {
      functionRow(f, x + 18, fy, cardW - 36, type, label);
      fy += 27;
    });
  });

  const legendY = startY + 2 * (cardH + gapY) + 10;
  text(f, 60, legendY,
    'Типы функций: П — пользовательская, С — системная, У — проверка условия, Н — негативная ветка, + — позитивная ветка. ' +
    'Общие функции (поиск, фильтры, карточка, цитата-источник) вынесены в отдельный фрейм и переиспользуются разделами.',
    { size: 11, color: C.muted, width: 2400 });

  return f;
}

/* ------------------------------------------- 2. общие функции и блокировки */

function buildShared(arch, originY) {
  const W = 3500;
  const H = 900;
  const f = frame('ФА 2 · Общие функции и блокировки', W, H);
  f.x = 0;
  f.y = originY;

  text(f, 60, 40, 'Общие функции и зависимости', { bold: true, size: 40 });
  text(f, 60, 96, 'Один раз спроектированные функции, которые используют несколько разделов, и правила, которые блокируют выпуск.',
    { size: 13, color: C.muted, width: 2200 });

  section(f, 60, 160, 1640, 660, 'Общие функции (переиспользуются)', 'выносим вовне, чтобы не дублировать в разделах');
  let y = 230;
  arch.shared.forEach(([name, used]) => {
    card(f, 100, y, 720, 34, name, '', { fill: C.white, stroke: C.line, titleSize: 12 });
    text(f, 840, y + 10, 'используют: ' + used, { size: 10, color: C.muted });
    y += 48;
  });

  section(f, 1740, 160, 1700, 660, 'Блокировки и зависимости', 'функция не выполняется, пока не снято условие');
  let by = 230;
  arch.blocks.forEach(([what, why]) => {
    card(f, 1780, by, 1620, 56, what, why, { fill: C.amberSoft, stroke: C.line, titleSize: 12, subtitleSize: 11 });
    by += 68;
  });

  return f;
}

/* ------------------------------------------------------- 3. сценарий */

function buildScenario(arch, originY) {
  const sc = arch.scenario;
  const nodeW = 320;
  const nodeH = 84;
  const diamondW = 300;
  const diamondH = 120;
  const gapX = 70;
  const gapY = 74;
  const headerH = 180;

  // глубины: расстояние от старта
  const depth = {};
  const byId = {};
  sc.nodes.forEach((n) => { byId[n.id] = n; });
  depth[sc.nodes[0].id] = 0;
  let changed = true;
  while (changed) {
    changed = false;
    sc.edges.forEach(([from, to]) => {
      if (depth[from] !== undefined && depth[to] === undefined) {
        depth[to] = depth[from] + 1;
        changed = true;
      }
    });
  }
  const levels = {};
  sc.nodes.forEach((n) => {
    const d = depth[n.id] == null ? 0 : depth[n.id];
    (levels[d] = levels[d] || []).push(n);
  });
  const maxDepth = Math.max(...Object.keys(levels).map(Number));
  const maxWidth = Math.max(...Object.values(levels).map((l) => l.length));
  const W = Math.max(1400, 200 + maxWidth * (nodeW + gapX));
  const H = headerH + (maxDepth + 1) * (diamondH + gapY) + 120;

  const f = frame('ФА 3 · Функциональный сценарий', W, H);
  f.x = 0;
  f.y = originY;

  text(f, 60, 40, sc.title, { bold: true, size: 30, width: W - 120 });
  text(f, 60, 92, 'Пользовательские и системные действия, проверки условий и негативные ветки. Ромб — проверка условия.',
    { size: 12, color: C.muted, width: W - 120 });

  const positions = {};
  Object.keys(levels).sort((a, b) => Number(a) - Number(b)).forEach((d) => {
    const list = levels[d];
    const rowWidth = list.length * nodeW + (list.length - 1) * gapX;
    const startX = Math.max(100, (W - rowWidth) / 2);
    list.forEach((n, i) => {
      const isCond = n.type === 'cond';
      const w = isCond ? diamondW : nodeW;
      const h = isCond ? diamondH : nodeH;
      const x = startX + i * (nodeW + gapX) + (nodeW - w) / 2;
      const y = headerH + Number(d) * (diamondH + gapY);
      positions[n.id] = { x, y, w, h, isCond };
    });
  });

  const palette = {
    user: { fill: C.blueSoft, stroke: C.blue },
    system: { fill: C.white, stroke: C.line },
    cond: { fill: C.amberSoft, stroke: C.amber },
    negative: { fill: C.accentSoft, stroke: C.red },
    positive: { fill: C.greenSoft, stroke: C.green }
  };

  sc.nodes.forEach((n) => {
    const pos = positions[n.id];
    const style = palette[n.type] || palette.system;
    const shape = rect(f, pos.x, pos.y, pos.w, pos.h, {
      shapeType: pos.isCond ? 'DIAMOND' : 'ROUNDED_RECTANGLE',
      fill: style.fill,
      stroke: style.stroke,
      dashed: n.type === 'negative',
      radius: 14
    });
    if (pos.isCond) {
      text(f, pos.x + pos.w / 2 - 92, pos.y + pos.h / 2 - 18, n.text, { size: 11, width: 184 });
    } else {
      text(f, pos.x + 14, pos.y + 16, n.text, { size: 11, width: pos.w - 28 });
    }
    byId[n.id].node = shape;
  });

  sc.edges.forEach(([from, to, label]) => {
    const a = byId[from].node;
    const b = byId[to].node;
    if (a && b) connect(a, b, label || '', { weight: 1.3 });
  });

  text(f, 60, H - 56, 'Синий — действие пользователя, белый — системное, ромб — проверка условия, красный — негативная ветка, зелёный — успешное завершение.',
    { size: 10, color: C.muted, width: W - 120 });

  return f;
}

/* ------------------------------------------------------- 4. матрица */

function buildMatrix(arch, originY) {
  const m = arch.matrix;
  const W = 1500;
  const H = 760;
  const f = frame('ФА 4 · Матрица: раздел × компонент', W, H);
  f.x = 0;
  f.y = originY;

  text(f, 60, 40, 'Матрица: раздел × компонент', { bold: true, size: 34 });
  text(f, 60, 92, 'Где живёт функциональность: клиент, API, база, редакция, партнёрский контур. ● — основная реализация, ○ — вспомогательная.',
    { size: 13, color: C.muted, width: 2200 });

  const x0 = 80;
  const y0 = 180;
  const colW = 200;
  const rowH = 44;
  const firstW = 420;

  text(f, x0 + 10, y0 + 10, 'Раздел', { bold: true, size: 11, color: C.muted });
  m.components.forEach((c, i) => {
    text(f, x0 + firstW + i * colW + 10, y0 + 10, c, { bold: true, size: 12 });
  });
  m.rows.forEach(([name, ...cells], ri) => {
    const y = y0 + 40 + ri * rowH;
    rect(f, x0, y, firstW, rowH - 6, { fill: C.white, stroke: C.line, radius: 8 });
    text(f, x0 + 12, y + 10, name, { size: 12 });
    cells.forEach((cell, ci) => {
      const cx = x0 + firstW + ci * colW;
      rect(f, cx, y, colW, rowH - 6, { fill: cell ? C.bg : C.paper, stroke: C.line, radius: 8 });
      if (cell) text(f, cx + 10, y + 10, cell, { size: 13, color: C.ink });
    });
  });

  return f;
}

/* ------------------------------------------------------- 5. данные */

function buildEntities(arch, originY) {
  const W = 2240;
  const H = 900;
  const f = frame('ФА 5 · Слой данных: сущности и связи', W, H);
  f.x = 0;
  f.y = originY;

  text(f, 60, 40, 'Слой данных: сущности и связи', { bold: true, size: 34 });
  text(f, 60, 92, 'Что хранится и на что опирается функциональность. Утверждение — минимальная единица доказательства, публикация — фильтр допуска.',
    { size: 13, color: C.muted, width: 2200 });

  const cardW = 300;
  const cardH = 84;
  const gapX = 40;
  const gapY = 40;
  const startX = 80;
  const startY = 180;
  const nodes = {};
  arch.entities.forEach(([name, desc], i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    nodes[name] = card(f, x, y, cardW, cardH, name, desc, { fill: C.white, stroke: C.line, titleSize: 13, subtitleSize: 10 });
  });

  arch.entityEdges.forEach(([from, to, label]) => {
    if (nodes[from] && nodes[to]) connect(nodes[from], nodes[to], label, { weight: 1.2 });
  });

  return f;
}

/* ------------------------------------------------------- 6. цикл статей */

function buildRoutes(data, originY) {
  const rows = data.routes.length;
  const rowH = 190;
  const W = 3500;
  const H = 220 + rows * rowH + 120;
  const f = frame('ФА 6 · Цикл статей по типовым входам', W, H);
  f.x = 0;
  f.y = originY;

  text(f, 60, 44, 'Цикл статей: типовые входы', { bold: true, size: 36 });
  text(f, 60, 98, 'Каждая цепочка — маршрут из базы знаний. Заливка — статья опубликована, пунктир — материал в проверке.',
    { size: 13, color: C.muted, width: 1800 });

  const byId = {};
  data.articles.forEach((a) => { byId[a.id] = a; });

  let y = 180;
  data.routes.forEach((route, idx) => {
    text(f, 60, y + 6, `${idx + 1}. ${route.title}`, { bold: true, size: 14, width: 270 });
    text(f, 60, y + 30, route.when || '', { size: 10, color: C.muted, width: 270 });

    let x = 360;
    const cardW = 196;
    const cardH = 92;
    const gap = 74;
    const nodes = [];
    route.steps.forEach((step) => {
      const a = byId[step];
      const title = a ? a.title : step.replace(/^art-/, '');
      const sub = a ? `${a.claims} утв.` : 'в проверке';
      nodes.push(card(f, x, y + 4, cardW, cardH, title, sub, {
        fill: a ? C.white : C.bg,
        stroke: C.line,
        dashed: !a,
        titleSize: 11,
        subtitleSize: 9
      }));
      x += cardW + gap;
    });
    for (let i = 0; i < nodes.length - 1; i++) {
      connect(nodes[i], nodes[i + 1], i === 0 ? 'следующий шаг' : '', { weight: 1.2 });
    }
    y += rowH;
  });

  return f;
}

/* ------------------------------------------------------- запуск */

async function main() {
  if (!ARCH || !ARCH.sections || !KB_DATA || !KB_DATA.routes) {
    figma.notify('Нет данных архитектуры: пересоберите плагин (node scripts/build-plugin-data.mjs).');
    figma.closePlugin();
    return;
  }
  await loadFonts();

  const frames = [];
  let offset = 0;
  const place = (fn, ...args) => {
    const frameNode = fn(...args, offset);
    offset = frameNode.y + frameNode.height + 160;
    frames.push(frameNode);
  };

  place(buildModel, ARCH);
  place(buildShared, ARCH);
  place(buildScenario, ARCH);
  place(buildMatrix, ARCH);
  place(buildEntities, ARCH);
  place(buildRoutes, KB_DATA);

  figma.viewport.scrollAndZoomIntoView(frames);
  figma.notify(`Готово: 6 фреймов, ${ARCH.sections.length} разделов, ` +
    `${ARCH.sections.reduce((n, s) => n + s.functions.length, 0)} функций, ` +
    `${KB_DATA.routes.length} маршрутов.`);
  figma.closePlugin();
}

main().catch((err) => {
  figma.notify('Ошибка плагина: ' + (err && err.message ? err.message : String(err)));
  figma.closePlugin();
});
