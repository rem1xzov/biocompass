/* Сборка плагина Figma: данные из базы знаний + логика плагина → один code.js.
 *
 *   node scripts/build-plugin-data.mjs
 *
 * Источники:
 *   kb/kb.json                                   — публикационная выгрузка (что видит продукт)
 *   ../bio-kb/Knowledge Base Data/articles/ru/   — полный цикл статей (включая те, что в проверке)
 *   ../bio-kb/Knowledge Base Data/articles/routes.json — типовые входы
 *
 * Результат: figma-plugin/code.js (данные + plugin-body.js), плагин работает офлайн.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const KB = path.join(SITE, 'kb', 'kb.json');
const ARTICLES_DIR = path.resolve(SITE, '..', 'bio-kb', 'Knowledge Base Data', 'articles', 'ru');
const ROUTES = path.resolve(SITE, '..', 'bio-kb', 'Knowledge Base Data', 'articles', 'routes.json');
const BODY = path.join(SITE, 'figma-plugin', 'plugin-body.js');
const OUT = path.join(SITE, 'figma-plugin', 'code.js');

const STAGE_ORDER = [
  'pre_amputation', 'early_postop', 'mse_ipra', 'choosing_center', 'manufacturing',
  'delivery', 'training', 'daily_use', 'maintenance', 'replacement'
];
const STAGE_LABEL = {
  pre_amputation: 'Подготовка к ампутации', early_postop: 'Ранний период после ампутации',
  mse_ipra: 'МСЭ, инвалидность и ИПРА', choosing_center: 'Выбор центра и вида протеза',
  manufacturing: 'Изготовление и примерки', delivery: 'Получение изделия',
  training: 'Обучение и реабилитация', daily_use: 'Повседневное использование',
  maintenance: 'Обслуживание и ремонт', replacement: 'Замена и повторное протезирование'
};

const bundle = JSON.parse(fs.readFileSync(KB, 'utf8'));
const routesRaw = fs.existsSync(ROUTES) ? JSON.parse(fs.readFileSync(ROUTES, 'utf8')) : { routes: [] };

/* Полный цикл статей: этапы и заголовок берём из frontmatter без YAML-зависимостей. */
const fullCycle = [];
if (fs.existsSync(ARTICLES_DIR)) {
  for (const name of fs.readdirSync(ARTICLES_DIR).filter((n) => n.endsWith('.md')).sort()) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, name), 'utf8');
    const block = (raw.match(/^stage:\s*\n((?:[ \t]*-[ \t]*\S+[ \t]*\n)+)/m) || [])[1] || '';
    const stages = [...block.matchAll(/^[ \t]*-[ \t]*(\S+)/gm)].map((m) => m[1]);
    const titleMatch = raw.match(/^title:\s*(.+)$/m);
    let title = titleMatch ? titleMatch[1].trim() : name.replace(/\.md$/, '');
    if (/^['"].*['"]$/.test(title)) title = title.slice(1, -1);
    fullCycle.push({ id: name.replace(/\.md$/, ''), title, stages });
  }
}

const publishedIds = new Set(bundle.articles.map((a) => a.id));
const articles = bundle.articles.map((a) => ({
  id: a.id,
  title: a.title,
  stage: a.stage[0],
  limb: a.limb,
  role: a.role,
  events: a.events || [],
  claims: (a.claims || []).length,
  verified: a.verified || null,
  next: (a.next_step && a.next_step.primary) || null
}));

const stages = STAGE_ORDER.map((code) => {
  const all = fullCycle.filter((a) => (a.stages || []).includes(code));
  const published = all.filter((a) => publishedIds.has(a.id));
  return {
    code,
    label: STAGE_LABEL[code] || code,
    total: all.length,
    published: published.length,
    titles: published.slice(0, 2).map((a) => a.title),
    articles: published.map((a) => a.id),
    pending: all.filter((a) => !publishedIds.has(a.id)).length
  };
});

const catalog = Object.entries(
  bundle.products.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || { label: p.category_label, count: 0, ids: [] };
    acc[p.category].count += 1;
    if (acc[p.category].ids.length < 3) acc[p.category].ids.push(p.product_id);
    return acc;
  }, {})
).map(([code, v]) => ({ code, label: v.label, count: v.count, ids: v.ids }))
  .sort((a, b) => b.count - a.count);

const data = {
  generated_at: bundle.generated_at,
  counts: bundle.counts,
  policy_version: bundle.policy_version,
  stages,
  articles,
  routes: routesRaw.routes.map((r) => ({ id: r.id, title: r.title, when: r.when, steps: r.steps })),
  catalog,
  points: bundle.points.length,
  norms: bundle.norms.length,
  claims: Object.keys(bundle.claims).length,
  sources: Object.keys(bundle.sources).length,
  coverage: {
    articles_total: fullCycle.length,
    articles_published: articles.length,
    stages_total: stages.length,
    stages_published: stages.filter((s) => s.published > 0).length
  }
};

const banner = '/* Сгенерировано scripts/build-plugin-data.mjs — не редактировать вручную. */\n' +
  `const KB_DATA = ${JSON.stringify(data, null, 2)};\n\n`;
const body = fs.readFileSync(BODY, 'utf8');
fs.writeFileSync(OUT, banner + body, 'utf8');

console.log(
  `figma-plugin/code.js: ${articles.length}/${fullCycle.length} статей опубликовано, ` +
  `${stages.filter((s) => s.published).length}/${stages.length} этапов с материалом, ` +
  `${catalog.length} категорий каталога, ${data.routes.length} маршрутов, ` +
  `${data.claims} утверждений, ${data.sources} источников`
);
