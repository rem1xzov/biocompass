/* Сборка бандла базы знаний для статического хостинга.
 *
 * Единственный источник данных — публикационная выгрузка базы знаний
 * (`dist/public`: только записи, допущенные publication-policy.json).
 * Служебные поля времени сборки не переносятся, поэтому повторная сборка
 * даёт байт-в-байт одинаковый `kb/kb.json` и деплой не шумит пустыми разницами.
 *
 *   node scripts/build-kb.mjs [путь-к-публикационной-выгрузке]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const PUBLIC_DIR = path.resolve(process.argv[2] || path.join(SITE, '..', 'bio-kb', 'dist', 'public'));
const OUT_DIR = path.join(SITE, 'kb');

const STAGE_LABEL = {
  pre_amputation: 'Подготовка', early_postop: 'Ранний период', mse_ipra: 'Документы',
  choosing_center: 'Выбор центра', manufacturing: 'Изготовление', delivery: 'Получение',
  training: 'Реабилитация', daily_use: 'Жизнь с протезом', maintenance: 'Обслуживание',
  replacement: 'Замена'
};
const STAGE_CATEGORY = {
  pre_amputation: 'docs', early_postop: 'rehab', mse_ipra: 'docs',
  choosing_center: 'clinic', manufacturing: 'clinic', delivery: 'clinic',
  training: 'rehab', daily_use: 'life', maintenance: 'life', replacement: 'docs'
};
const CATEGORY_LABEL = {
  knee_module: 'Коленный модуль', foot: 'Стопа', liner: 'Лайнер',
  suspension: 'Подвеска', socket_system: 'Гильзовая система',
  modular_prosthesis_lower: 'Модульный протез н/к', modular_prosthesis_upper: 'Модульный протез в/к',
  mech_hand: 'Механическая кисть', bionic_hand: 'Бионическая кисть',
  cosmetic_prosthesis: 'Косметический протез', pediatric_prosthesis: 'Детский протез',
  sport_prosthesis: 'Спортивный протез', swim_prosthesis: 'Протез для плавания',
  hygiene_prosthesis: 'Гигиенический протез', adapter_connector: 'Адаптер',
  cosmetic_glove: 'Косметическая перчатка', cover: 'Оболочка', accessory: 'Аксессуар',
  orthosis: 'Ортез', other: 'Прочее'
};

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
}

function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return [{}, raw];
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return [{}, raw];
  const block = raw.slice(3, end);
  const body = raw.slice(end + 4).replace(/^\n+/, '');
  return [parseYaml(block), body];
}

/* Небольшой разборщик YAML-подмножества frontmatter: блоки-словари по отступу,
 * списки словарей (в т.ч. узлы, где первым идёт скалярный ключ, а вложенный
 * список идёт на том же отступе: `- when: …` + `target: …`), скаляры.
 * Полный YAML в Node без зависимостей недоступен, а формат frontmatter в базе
 * ограничен этим подмножеством. */
function parseYaml(text) {
  const entries = [];
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    entries.push({ indent: raw.length - raw.trimStart().length, text: raw.trim() });
  }

  function skipBlock(start, indent) {
    let i = start;
    while (i < entries.length && entries[i].indent > indent) {
      i += 1;
      if (i < entries.length && entries[i].indent === indent && entries[i].text.startsWith('- ') && indent > 0) break;
    }
    return i;
  }

  function isListOfObjects(start, indent) {
    if (start >= entries.length) return false;
    const e = entries[start];
    if (e.indent !== indent || !e.text.startsWith('- ')) return false;
    const item = e.text.slice(2).trim();
    if (!item.includes(':')) return false;
    const nested = start + 1 < entries.length && entries[start + 1].indent > indent;
    return !nested && item.endsWith(':') || !item.endsWith(':') && nested;
  }

  function parseItems(start, indent) {
    const out = [];
    let i = start;
    while (i < entries.length && entries[i].indent === indent && entries[i].text.startsWith('- ')) {
      const item = entries[i].text.slice(2).trim();
      i += 1;
      if (!item.includes(':')) {
        out.push(parseScalar(item));
        i = skipBlock(i, indent);
        continue;
      }
      const [firstKey, ...firstRest] = item.split(':');
      const obj = {};
      let cursor = i;
      let seenNestedList = false;
      while (cursor < entries.length) {
        const child = entries[cursor];
        const isSibling = child.indent === indent && child.text.startsWith('- ');
        const isDeeper = child.indent > indent;
        if (isSibling && seenNestedList) break;
        if (!isDeeper && !isSibling) break;
        if (child.indent === indent && seenNestedList) break;
        if (child.text.startsWith('- ') && isDeeper) {
          const [arr, next] = parseItems(cursor, child.indent);
          obj[firstKey.trim()] = obj[firstKey.trim()] ? obj[firstKey.trim()].concat(arr) : arr;
          seenNestedList = true;
          cursor = next;
          continue;
        }
        if (!child.text.includes(':')) { cursor += 1; continue; }
        const [k, ...r] = child.text.split(':');
        const value = r.join(':').trim();
        cursor += 1;
        if (value === '' && cursor < entries.length && entries[cursor].indent > child.indent) {
          const [sub, next] = parseMap(cursor, entries[cursor].indent);
          obj[k.trim()] = sub;
          cursor = next;
        } else if (value === '' && cursor < entries.length && entries[cursor].indent === child.indent && entries[cursor].text.startsWith('- ')) {
          const [arr, next] = parseItems(cursor, child.indent);
          obj[k.trim()] = arr;
          cursor = next;
        } else {
          obj[k.trim()] = parseScalar(value);
          cursor = skipBlock(cursor, child.indent);
        }
      }
      if (!('when' in obj) && firstRest.join(':').trim()) {
        obj[firstKey.trim()] = parseScalar(firstRest.join(':').trim());
      } else if (!(firstKey.trim() in obj)) {
        obj[firstKey.trim()] = firstRest.join(':').trim() ? parseScalar(firstRest.join(':').trim()) : null;
      }
      out.push(obj);
      i = cursor;
    }
    return [out, i];
  }

  function parseMap(start, indent) {
    const out = {};
    let i = start;
    while (i < entries.length && entries[i].indent === indent && !entries[i].text.startsWith('- ')) {
      const [k, ...r] = entries[i].text.split(':');
      const value = r.join(':').trim();
      i += 1;
      if (value === '') {
        if (i < entries.length && entries[i].indent > indent) {
          if (entries[i].text.startsWith('- ')) {
            const [arr, next] = parseItems(i, entries[i].indent);
            out[k.trim()] = arr;
            i = next;
          } else {
            const [child, next] = parseMap(i, entries[i].indent);
            out[k.trim()] = child;
            i = next;
          }
        } else if (i < entries.length && entries[i].indent === indent && entries[i].text.startsWith('- ')) {
          const [arr, next] = parseItems(i, indent);
          out[k.trim()] = arr;
          i = next;
        } else {
          out[k.trim()] = null;
        }
      } else {
        out[k.trim()] = parseScalar(value);
        i = skipBlock(i, indent);
      }
    }
    return [out, i];
  }

  if (!entries.length) return {};
  const startIndent = entries[0].indent;
  if (entries[0].text.startsWith('- ')) {
    const [arr] = parseItems(0, startIndent);
    return arr;
  }
  const [map] = parseMap(0, startIndent);
  return map;
}

function parseScalar(value) {
  const v = String(value).trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((x) => parseScalar(x));
  }
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    const body = v.slice(1, -1);
    return v.startsWith('"') ? body.replace(/\\"/g, '"').replace(/\\n/g, '\n') : body.replace(/''/g, "'");
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  return v;
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function mdToHtml(md) {
  const out = [];
  let inList = false;
  let inQuote = false;
  const inline = (t) => escapeHtml(t)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const close = () => {
    if (inList) { out.push('</ul>'); inList = false; }
    if (inQuote) { out.push('</blockquote>'); inQuote = false; }
  };
  for (const raw of md.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { close(); continue; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { close(); const level = Math.min(h[1].length + 2, 6); out.push(`<h${level}>${inline(h[2])}</h${level}>`); continue; }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inQuote) { out.push('</blockquote>'); inQuote = false; }
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    const n = line.match(/^\d+\.\s+(.*)$/);
    if (n) { close(); out.push(`<p class="steps">${inline(n[1])}</p>`); continue; }
    if (line.startsWith('>')) {
      if (inList) { out.push('</ul>'); inList = false; }
      if (!inQuote) { out.push('<blockquote>'); inQuote = true; }
      out.push(`<p>${inline(line.replace(/^>+\s?/, ''))}</p>`);
      continue;
    }
    close();
    out.push(`<p>${inline(line)}</p>`);
  }
  close();
  return out.join('\n');
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`Нет публикационной выгрузки: ${PUBLIC_DIR}`);
    process.exit(1);
  }
  const claims = Object.fromEntries(readJsonl(path.join(PUBLIC_DIR, 'claims.jsonl')).map((c) => [c.claim_id, c]));
  const sources = Object.fromEntries(readJsonl(path.join(PUBLIC_DIR, 'sources.jsonl')).map((s) => [s.source_id, s]));
  const orgs = Object.fromEntries(readJsonl(path.join(PUBLIC_DIR, 'organizations.jsonl')).map((o) => [o.org_id, o]));
  const mfrs = Object.fromEntries(readJsonl(path.join(PUBLIC_DIR, 'manufacturers.jsonl')).map((m) => [m.mfr_id, m]));
  const acts = Object.fromEntries(readJsonl(path.join(PUBLIC_DIR, 'acts.jsonl')).map((a) => [a.doc_id, a]));

  const claimView = (cid) => {
    const c = claims[cid];
    if (!c) return null;
    return {
      claim_id: cid, statement: c.statement, anchor: c.anchor, field: c.field,
      severity: c.severity, topic: c.topic, checked_date: c.checked_date,
      source_id: c.source_id, source_location: c.source_location || '',
      quoted_text: c.quoted_text ?? null, conditions: c.conditions ?? null,
      limits: c.limits ?? null, claim_type: c.claim_type
    };
  };

  const articles = [];
  const articlesDir = path.join(PUBLIC_DIR, 'articles');
  for (const name of fs.existsSync(articlesDir) ? fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md')).sort() : []) {
    const [meta, body] = splitFrontmatter(fs.readFileSync(path.join(articlesDir, name), 'utf8'));
    const anchorIds = (meta.claim_anchors || []).flatMap((a) => a.claim_ids || []);
    articles.push({
      id: meta.id,
      title: meta.title,
      stage: meta.stage,
      stage_label: STAGE_LABEL[meta.stage[0]] || meta.stage[0],
      category: STAGE_CATEGORY[meta.stage[0]] || 'life',
      limb: meta.limb, role: meta.role, events: meta.events || [],
      audience: meta.audience, verified: meta.verified ?? null,
      clinical_review: (meta.clinical_review || {}).status ?? null,
      body_html: mdToHtml(body),
      claim_ids: anchorIds,
      claims: anchorIds.map(claimView).filter(Boolean),
      related: meta.related || [],
      next_step: meta.next_step || {}
    });
  }

  const points = readJsonl(path.join(PUBLIC_DIR, 'points.jsonl')).map((p) => {
    const org = orgs[p.org_id] || {};
    return {
      point_id: p.point_id, org_id: p.org_id, org: org.public_name || p.org_id,
      org_type: org.org_type ?? null, website: org.website || p.website_or_form || null,
      region: p.region, locality: p.locality, address: p.address ?? null,
      phone: p.phone ?? null, booking: p.booking ?? null, format: p.format ?? null,
      services: p.services || [], prosthetics: p.prosthetics || {}, payment: p.payment || {},
      unknown_reason: p.unknown_reason || {},
      evidence: Object.fromEntries(Object.entries(p.field_evidence || {}).map(([f, cid]) => [f, claimView(cid)])),
      sources: p.sources || [], accessed: p.accessed
    };
  });

  const products = readJsonl(path.join(PUBLIC_DIR, 'products.jsonl')).map((p) => {
    const mfr = mfrs[p.manufacturer_id] || {};
    return {
      product_id: p.product_id, name: p.name, name_ru: p.name_ru ?? null,
      category: p.category, category_label: CATEGORY_LABEL[p.category] || p.category,
      object_kind: p.object_kind, parent_id: p.parent_id ?? null, limb: p.limb,
      levels: p.amputation_levels || [], purpose: p.purpose ?? null, specs: p.specs || {},
      spec_evidence: Object.fromEntries(Object.entries(p.spec_evidence || {}).map(([k, e]) => [k, claimView(e.claim_id)])),
      warranty: p.warranty ?? null, service_life_doc: p.service_life_doc ?? null,
      normative_use_period: p.normative_use_period ?? null, price_info: p.price_info ?? null,
      manufacturer: mfr.name || p.manufacturer_id, article_number: p.article_number ?? null,
      sources: p.sources || []
    };
  });

  const norms = readJsonl(path.join(PUBLIC_DIR, 'norms.jsonl')).map((n) => {
    const act = acts[n.doc_id] || {};
    return {
      norm_id: n.norm_id, doc_id: n.doc_id, act_title: act.title || n.doc_id,
      requisites: act.requisites || '', edition: act.edition || n.edition || '',
      locator: n.locator, content: n.content, practical: n.practical ?? null,
      conditions: n.conditions ?? null, exceptions: n.exceptions ?? null,
      valid_from: n.valid_from ?? null, validity_note: n.validity_note ?? null,
      claim: claimView(n.claim_id)
    };
  });

  const usedClaims = new Set();
  const collect = (cv) => { if (cv && cv.claim_id) usedClaims.add(cv.claim_id); };
  for (const a of articles) a.claims.forEach(collect);
  for (const p of products) Object.values(p.spec_evidence || {}).forEach(collect);
  for (const p of points) Object.values(p.evidence || {}).forEach(collect);
  for (const n of norms) collect(n.claim);

  const usedSources = {};
  for (const cid of usedClaims) {
    const c = claims[cid];
    if (!c) continue;
    const s = sources[c.source_id];
    if (s) usedSources[s.source_id] = {
      source_id: s.source_id, title: s.title, url: s.url,
      publisher: s.publisher || '', accessed: s.accessed, kind: s.kind ?? null
    };
  }

  const manifestFile = path.join(PUBLIC_DIR, 'manifest.json');
  const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};

  const bundle = {
    generated_at: manifest.generated_at ?? null,
    policy_version: manifest.policy_version ?? null,
    counts: manifest.counts ?? {},
    articles, points,
    organizations: readJsonl(path.join(PUBLIC_DIR, 'organizations.jsonl')).map((o) => ({
      org_id: o.org_id, public_name: o.public_name, org_type: o.org_type ?? null,
      website: o.website ?? null, network_scope: o.network_scope ?? null
    })),
    products, norms,
    claims: Object.fromEntries([...usedClaims].sort().map((cid) => [cid, claimView(cid)])),
    sources: usedSources
  };

  const payload = JSON.stringify(bundle);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const target = path.join(OUT_DIR, 'kb.json');
  const prev = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (prev === payload) {
    console.log(`kb/kb.json без изменений (${Buffer.byteLength(payload)} байт) — перезапись не нужна`);
  } else {
    fs.writeFileSync(target, payload, 'utf8');
  }
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify({ generated_at: bundle.generated_at, policy_version: bundle.policy_version, counts: bundle.counts }, null, 2) + '\n', 'utf8');

  const sha = crypto.createHash('sha256').update(payload).digest('hex').slice(0, 12);
  console.log(`kb/kb.json ${Buffer.byteLength(payload)} байт, sha256:${sha}`);
  console.log(`статьи ${articles.length}, точки ${points.length}, изделия ${products.length}, нормы ${norms.length}, утверждений ${usedClaims.size}, источников ${Object.keys(usedSources).length}`);
}

main();
