/* «Биокомпас» — генератор функциональной архитектуры приложения в FigJam.
 *
 * Плагин строит две доски:
 *   1. «Функциональная архитектура»: входы → разделы приложения → цикл статей по этапам,
 *      каталог по категориям, слой доказательств (утверждения → источники → политика).
 *   2. «Цикл статей»: типовые входы из маршрутов базы знаний, шаг за шагом, с пометкой
 *      состояния статьи (опубликована / в проверке).
 *
 * Данные приходят из window-независимого объекта KB_DATA, который собирает
 * scripts/build-plugin-data.mjs из публикационной выгрузки сайта.
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
  white: '#FFFFFF'
};

function rgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255
  };
}
function solid(hex) { return { type: 'SOLID', color: rgb(hex) }; }

let FONT_REGULAR = { family: 'Inter', style: 'Regular' };
let FONT_BOLD = { family: 'Inter', style: 'Bold' };
let FONT_MEDIUM = { family: 'Inter', style: 'Medium' };

async function loadFonts() {
  const pairs = [
    ['Inter', 'Regular'], ['Inter', 'Medium'], ['Inter', 'Semi Bold'], ['Inter', 'Bold']
  ];
  for (const [family, style] of pairs) {
    try {
      await figma.loadFontAsync({ family, style });
      if (style === 'Semi Bold') FONT_MEDIUM = { family, style };
      if (style === 'Bold') FONT_BOLD = { family, style };
      if (style === 'Regular') FONT_REGULAR = { family, style };
    } catch (err) {
      // шрифт недоступен — остаёмся на Inter Regular/Bold
    }
  }
}

function text(parent, x, y, value, opts) {
  const o = opts || {};
  const node = figma.createText();
  node.fontName = o.bold ? FONT_BOLD : o.medium ? FONT_MEDIUM : FONT_REGULAR;
  node.characters = String(value == null ? '' : value);
  node.fontSize = o.size || 14;
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
  if (node.cornerRadius !== undefined) node.cornerRadius = o.radius == null ? 16 : o.radius;
  if (o.dashed) {
    node.strokeDashes = [4, 4];
  }
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
  text(parent, x + 14, y + 12, title, { bold: true, size: o.titleSize || 13, width: w - 28 });
  if (subtitle) {
    text(parent, x + 14, y + 12 + (o.titleSize || 13) + 8, subtitle, {
      size: o.subtitleSize || 11, color: o.subtitleColor || C.muted, width: w - 28
    });
  }
  return box;
}

function section(parent, x, y, w, h, title, hint) {
  const box = rect(parent, x, y, w, h, { fill: C.bg, stroke: C.line, radius: 28 });
  text(parent, x + 20, y + 18, title.toUpperCase(), { bold: true, size: 12, color: C.muted });
  if (hint) text(parent, x + 20, y + 38, hint, { size: 11, color: C.muted, width: w - 40 });
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
    if (c.textFontName !== undefined) {
      try { c.textFontName = FONT_REGULAR; } catch (e) { /* остаётся по умолчанию */ }
    }
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

/* ------------------------------------------------------------ архитектура */

function buildArchitecture(data, originY) {
  const W = 3400;
  const H = 1500;
  const f = frame('Биокомпас · функциональная архитектура', W, H);
  f.x = 0;
  f.y = originY;

  text(f, 60, 48, 'Функциональная архитектура приложения', { bold: true, size: 44 });
  text(f, 60, 108,
    `Собрана из публикационной выгрузки базы знаний: ${data.counts.articles} статей, ` +
    `${data.counts.products} изделий, ${data.counts.norms} норм, ${data.counts.points} проверенных точек. ` +
    `Утверждений: ${data.claims}, источников: ${data.sources}. Политика публикации ${data.policy_version}.`,
    { size: 15, color: C.muted, width: 1700 });
  text(f, W - 560, 60, 'обновлено ' + (data.generated_at || '').slice(0, 10), { size: 12, color: C.muted });

  // 1. Входы
  const colA = section(f, 60, 220, 420, 1080, '1. Входы', 'с какой ситуацией приходит человек');
  const entryY = [300, 460, 620, 780];
  const entries = [
    ['Узнал об ампутации', 'операция впереди · тревога', C.amberSoft],
    ['Готовится к протезу', 'документы, ИПРА, центр', C.greenSoft],
    ['Уже протезируется', 'посадка, уход, замена', C.accentSoft],
    ['Близкий помогает', 'родственник рядом', C.bg]
  ].map((e, i) => card(f, 100, entryY[i], 340, 110, e[0], e[1], { fill: e[2], stroke: C.line }));

  // 2. Разделы
  const colB = section(f, 560, 220, 460, 1080, '2. Разделы приложения', 'экраны и сервисы');
  const agent = card(f, 600, 300, 380, 96, 'Агент', 'диалог, контекст, ссылки на источники',
    { fill: C.white, stroke: C.accent, radius: 20 });
  const menu = card(f, 600, 424, 380, 76, 'Меню и навигация', 'чат · маршрут · база · каталог · организации',
    { fill: C.white, stroke: C.line });
  const knowledge = card(f, 600, 528, 380, 96, 'База знаний', 'этапы пути, статьи, следующий шаг',
    { fill: C.white, stroke: C.accent, radius: 20 });
  const catalog = card(f, 600, 652, 380, 96, 'Каталог протезов и комплектующих', 'протезы рук и ног, МПУ, комплектующие',
    { fill: C.white, stroke: C.accent, radius: 20 });
  const product = card(f, 600, 776, 380, 96, 'Карточка изделия', 'срок эксплуатации, критерии подбора, где подходит',
    { fill: C.white, stroke: C.line });
  const orgs = card(f, 600, 900, 380, 96, 'Организации', 'только проверенные точки и профили',
    { fill: C.white, stroke: C.line });
  const account = card(f, 600, 1024, 380, 96, 'Профиль и регистрация', 'имя, телефон, email, согласия',
    { fill: C.white, stroke: C.line, dashed: true });
  const route = card(f, 600, 1148, 380, 76, 'Маршрут пользователя', 'пять этапов, прогресс, следующий шаг',
    { fill: C.white, stroke: C.line });

  // 3. Цикл статей
  const colC = section(f, 1120, 220, 760, 1080, '3. Цикл статей по этапам', 'линейка этапов: каждая статья — шаг пути');
  const stageNodes = [];
  let sy = 280;
  data.stages.forEach((stage, idx) => {
    const h = 72;
    const published = stage.published || 0;
    const total = stage.total || published;
    const label = `${idx}. ${stage.label}`;
    const sub = total
      ? `${published} опубликовано · ${total - published} в проверке`
      : 'материалы готовятся';
    const node = card(f, 1160, sy, 680, h, label, sub, {
      fill: published ? C.white : C.bg,
      stroke: published ? C.line : C.line,
      dashed: !published,
      titleSize: 13,
      subtitleSize: 11
    });
    stageNodes.push(node);
    sy += h + 22;
  });

  // 4. Каталог
  const colD = section(f, 1960, 220, 640, 700, '4. Каталог по категориям', 'что уже подтверждено источником');
  let cy = 300;
  data.catalog.slice(0, 9).forEach((cat) => {
    card(f, 2000, cy, 560, 52, cat.label, `${cat.count} изделий с доказательствами`, {
      fill: C.white, stroke: C.line, titleSize: 12, subtitleSize: 10
    });
    cy += 66;
  });

  // 5. Данные
  const colE = section(f, 1960, 950, 640, 350, '5. Данные и доказательства', 'откуда берётся ответ');
  const claims = card(f, 2000, 1010, 560, 80, 'Утверждения (claims)', `${data.claims} подтверждённых фактов с местом в источнике`,
    { fill: C.white, stroke: C.line });
  const sources = card(f, 2000, 1114, 560, 80, 'Источники (sources)', `${data.sources} документов и страниц с датой проверки`,
    { fill: C.white, stroke: C.line });
  const policy = card(f, 2000, 1218, 560, 80, 'Политика публикации', 'что попадает в продукт, а что остаётся в проверке',
    { fill: C.white, stroke: C.line });

  // 6. Правовой контур
  const norms = card(f, 2680, 300, 660, 96, 'Правовые нормы', `${data.norms} норм с применимой редакцией`,
    { fill: C.white, stroke: C.line });
  const insurance = card(f, 2680, 420, 660, 96, 'Оплата и обеспечение', 'ИПРА · электронный сертификат · платно',
    { fill: C.white, stroke: C.line });
  const gate = card(f, 2680, 540, 660, 96, 'Клиническая редактура', 'срочность публикуется только после проверки',
    { fill: C.amberSoft, stroke: C.line });

  // Связи
  entries.forEach((e) => connect(e, agent, 'запрос'));
  connect(agent, knowledge, 'объясняет');
  connect(agent, catalog, 'подбирает');
  connect(agent, orgs, 'направляет');
  connect(menu, knowledge, 'раздел');
  connect(menu, catalog, 'раздел');
  connect(menu, account, 'вход');
  connect(knowledge, stageNodes[0], 'этапы пути');
  for (let i = 0; i < stageNodes.length - 1; i++) {
    connect(stageNodes[i], stageNodes[i + 1], 'дальше');
  }
  connect(catalog, product, 'карточка');
  connect(product, agent, 'вопрос по изделию', { lineType: 'ELBOWED' });
  connect(stageNodes[stageNodes.length - 1], catalog, 'выбор изделия');
  connect(knowledge, claims, 'факты');
  connect(catalog, claims, 'характеристики');
  connect(orgs, claims, 'профиль точки');
  connect(claims, sources, 'подтверждение');
  connect(policy, claims, 'допуск');
  connect(norms, claims, 'норма');
  connect(insurance, claims, 'оплата');
  connect(gate, claims, 'срочность');
  connect(route, stageNodes[3], 'этап пользователя');

  return f;
}

/* ------------------------------------------------------------ цикл статей */

function buildRoutes(data, originY) {
  const rows = data.routes.length;
  const rowH = 190;
  const W = 3400;
  const H = 220 + rows * rowH + 120;
  const f = frame('Биокомпас · цикл статей по типовым входам', W, H);
  f.x = 0;
  f.y = originY;

  text(f, 60, 48, 'Цикл статей: типовые входы', { bold: true, size: 40 });
  text(f, 60, 104, 'Каждая цепочка — маршрут из базы знаний. Заливка = статья опубликована, пунктир = материал в проверке.',
    { size: 14, color: C.muted, width: 1800 });

  const byId = {};
  data.articles.forEach((a) => { byId[a.id] = a; });

  let y = 190;
  data.routes.forEach((route, idx) => {
    text(f, 60, y + 6, `${idx + 1}. ${route.title}`, { bold: true, size: 15, width: 270 });
    text(f, 60, y + 30, route.when || '', { size: 11, color: C.muted, width: 270 });

    let x = 360;
    const cardW = 196;
    const cardH = 96;
    const gap = 74;
    const nodes = [];
    route.steps.forEach((step) => {
      const a = byId[step];
      const published = !!a;
      const title = a ? a.title : step.replace(/^art-/, '');
      const sub = a ? `${a.claims} утв. · ${a.next ? '→ ' + a.next.replace(/^art-/, '') : 'конец'}` : 'в проверке';
      const node = card(f, x, y + 4, cardW, cardH, title, sub, {
        fill: published ? C.white : C.bg,
        stroke: published ? C.line : C.line,
        dashed: !published,
        titleSize: 11,
        subtitleSize: 9
      });
      nodes.push(node);
      x += cardW + gap;
    });
    for (let i = 0; i < nodes.length - 1; i++) {
      connect(nodes[i], nodes[i + 1], i === 0 ? 'следующий шаг' : '', { weight: 1.2 });
    }
    y += rowH;
  });

  return f;
}

/* ------------------------------------------------------------ вход */

async function main() {
  const data = KB_DATA;
  if (!data || !data.stages) {
    figma.notify('Нет данных: пересоберите data.js (scripts/build-plugin-data.mjs).');
    figma.closePlugin();
    return;
  }
  await loadFonts();

  const arch = buildArchitecture(data, 0);
  const routes = buildRoutes(data, arch.height + 200);

  const legend = text(routes, 60, routes.height - 80,
    'Собрано автоматически из Knowledge Base Data · публикационная выгрузка · ' +
    (data.generated_at || '').slice(0, 10), { size: 11, color: C.muted });

  figma.viewport.scrollAndZoomIntoView([arch, routes]);
  figma.notify(`Готово: ${data.articles.length} статей, ${data.stages.length} этапов, ${data.routes.length} маршрутов.`);
  figma.closePlugin();
}

main().catch((err) => {
  figma.notify('Ошибка плагина: ' + (err && err.message ? err.message : String(err)));
  figma.closePlugin();
});
