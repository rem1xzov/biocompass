/* «Биокомпас» — клиент базы знаний.
 *
 * Грузит только публикационную выгрузку `kb/kb.json` (то, что разрешено
 * publication-policy.json), рисует базу знаний, каталог, проверенные точки и
 * отвечает в чате со ссылками на утверждения и источники.
 * Если данных нет (открыли index.html файлом), сайт остаётся в демо-режиме.
 */
(function () {
  'use strict';

  const state = {
    loaded: false,
    data: null,
    error: null,
    productLimit: 9
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function plural(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }
  const factsLabel = (n) => `${n} ${plural(n, 'утверждение', 'утверждения', 'утверждений')}`;
  const shortDate = (iso) => (iso ? iso.split('-').reverse().join('.') : '');

  const LIMB = { lower: 'нижняя конечность', upper: 'верхняя конечность', both: 'обе конечности', any: 'любая конечность' };
  const SEVERITY = {
    emergency: { label: 'немедленно', cls: 'is-emergency' },
    urgent: { label: 'в тот же день', cls: 'is-urgent' },
    routine: { label: 'планово', cls: 'is-routine' },
    info: { label: 'справка', cls: 'is-info' }
  };
  const STATUS_LABEL = { confirmed: 'подтверждено', refuted: 'опровергнуто', unknown: 'неизвестно' };
  const ORG_TYPE = {
    regional_prop: 'региональное предприятие', federal_center: 'федеральный центр', private: 'частная организация',
    med_org_department: 'медицинская организация', network: 'сеть', manufacturer_center: 'центр производителя', unknown: 'тип не установлен'
  };

  // Приблизительные координаты городов для схематичной карты (не адреса).
  const CITY = {
    'Москва': [37.6, 55.75], 'Санкт-Петербург': [30.3, 59.94], 'Архангельск': [40.5, 64.54],
    'Якутск': [129.7, 62.03], 'Екатеринбург': [60.6, 56.84], 'Грозный': [45.7, 43.32],
    'Тюмень': [65.5, 57.15], 'Краснодар': [39.0, 45.04], 'Ростов-на-Дону': [39.7, 47.23],
    'Владимир': [40.4, 56.13], 'Ижевск': [53.2, 56.85], 'Красноярск': [92.9, 56.01],
    'Новосибирск': [82.9, 55.03], 'Омск': [73.4, 54.99], 'Самара': [50.1, 53.2],
    'Нижний Новгород': [44.0, 56.3], 'Казань': [49.1, 55.8], 'Воронеж': [39.2, 51.7],
    'Саратов': [46.0, 51.5], 'Уфа': [55.97, 54.74], 'Пермь': [56.2, 58.0],
    'Челябинск': [61.4, 55.16], 'Хабаровск': [135.1, 48.48], 'Владивосток': [131.9, 43.1],
    'Калининград': [20.5, 54.7], 'Мурманск': [33.1, 68.97], 'Симферополь': [34.1, 44.95],
    'Севастополь': [33.5, 44.6], 'Иркутск': [104.3, 52.3], 'Кемерово': [86.1, 55.35],
    'Одинцово': [37.28, 55.68], 'Черногорск': [91.4, 53.82]
  };

  function cityPoint(city) {
    const c = CITY[city];
    if (!c) return null;
    const [lng, lat] = c;
    const x = Math.max(6, Math.min(94, ((lng - 19) / (180 - 19)) * 100));
    const y = Math.max(8, Math.min(92, ((70 - lat) / (70 - 41)) * 100));
    return { x, y };
  }

  function sourceLink(sourceId) {
    const s = state.data && state.data.sources[sourceId];
    if (!s) return '';
    const host = (() => {
      try { return new URL(s.url).hostname.replace(/^www\./, ''); } catch (e) { return 'источник'; }
    })();
    return `<a class="kb-source" href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.title)}">${esc(host)} ↗</a>`;
  }

  function evidenceFooter(claims) {
    const list = (claims || []).filter(Boolean);
    if (!list.length) return '';
    const seen = new Set();
    const sources = [];
    for (const c of list) {
      if (c.source_id && !seen.has(c.source_id)) {
        seen.add(c.source_id);
        sources.push(sourceLink(c.source_id));
      }
    }
    const dates = [...new Set(list.map((c) => c.checked_date))].sort();
    return `<div class="kb-evidence"><span class="kb-evidence-label">Проверено ${esc(dates.map(shortDate).join(', '))}</span>${sources.join(' ')}</div>`;
  }

  function severityChip(severity) {
    const meta = SEVERITY[severity] || SEVERITY.info;
    return `<span class="kb-chip ${meta.cls}">${esc(meta.label)}</span>`;
  }

  /* ---------------------------------------------------------------- rendering */

  function renderLandingArticles() {
    const grid = $('[data-article-grid]');
    if (!grid || !state.data) return;
    const articles = state.data.articles.slice(0, 5);
    grid.innerHTML = articles.map((a, i) => `
      <a class="article-card${i === 0 ? ' article-featured' : ''} reveal is-visible" href="#" data-kb-article="${esc(a.id)}">
        <div class="article-meta"><span>${esc(a.stage_label)}</span><span>${factsLabel(a.claims.length)}</span></div>
        <div class="article-art ${i % 2 ? 'art-doc' : 'art-care'}"><span>${esc(a.stage_label.split(' ')[0])}</span><i></i><i></i><i></i><b>${String(i + 1).padStart(2, '0')}</b></div>
        <div class="article-body">
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.audience)}</p>
          <span class="article-link">Читать <svg class="icon"><use href="#i-arrow-up"/></svg></span>
        </div>
      </a>`).join('');
    const foot = $('.knowledge-foot p');
    if (foot) {
      const n = state.data.counts.articles;
      foot.innerHTML = `В базе знаний <strong>${n}</strong> проверенных статей. Не нашли ответ? <strong>Спросите агента</strong>. Он ответит со ссылками на источники.`;
    }
  }

  function renderAppKnowledge() {
    const grid = $('[data-app-articles]');
    if (!grid || !state.data) return;
    grid.innerHTML = state.data.articles.map((a, i) => `
      <a class="app-article" href="#" data-category="${esc(a.category)}" data-kb-article="${esc(a.id)}">
        <span class="app-article-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="app-article-tag">${esc(a.stage_label)}</span>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.audience)}</p>
        <span class="app-article-foot"><span>${factsLabel(a.claims.length)} · ${shortDate(a.verified)}</span><svg class="icon"><use href="#i-arrow-up"/></svg></span>
      </a>`).join('');
    const empty = $('[data-app-knowledge-empty]');
    if (empty) empty.hidden = true;
  }

  function productCard(p, index) {
    const specs = Object.entries(p.specs || {}).slice(0, 3)
      .map(([k, v]) => `<span>${esc(v)}</span>`).join('');
    const category = p.limb === 'upper' ? 'upper' : (p.category === 'cosmetic_prosthesis' ? 'cosmetic' : 'lower');
    return `
      <article class="app-product" data-category="${category}" data-kb-product="${esc(p.product_id)}">
        <div class="app-product-art"><span class="kb-product-kind">${esc(p.object_kind === 'family' ? 'серия' : p.object_kind === 'component' ? 'комплектующее' : 'модель')}</span><b>${String(index + 1).padStart(2, '0')}</b></div>
        <div class="app-product-body">
          <span class="app-product-kicker">${esc(p.category_label)}</span>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.purpose || '')}</p>
          <div class="app-product-meta">${specs}</div>
          <button type="button" class="app-product-link" data-kb-product-open="${esc(p.product_id)}">Характеристики и источники <svg class="icon"><use href="#i-arrow-up"/></svg></button>
        </div>
      </article>`;
  }

  function renderCatalog() {
    const grid = $('[data-app-catalog]');
    if (!grid || !state.data) return;
    const items = state.data.products.slice(0, state.productLimit);
    grid.innerHTML = items.map(productCard).join('');
    const more = items.length < state.data.products.length
      ? `<button class="btn btn-outline kb-more" type="button" data-kb-more>Показать ещё ${Math.min(9, state.data.products.length - items.length)} из ${state.data.products.length - items.length}</button>`
      : '';
    let note = $('.app-catalog-note');
    if (note) {
      note.innerHTML = `<svg class="icon"><use href="#i-info"/></svg> В базе знаний <strong>${state.data.counts.products}</strong> изделий с подтверждёнными характеристиками. Конкретную модель подбирает команда специалистов; каталог не заменяет консультацию.`;
    }
    if (more) grid.insertAdjacentHTML('afterend', more);
  }

  function pointCard(p, index) {
    const badges = [];
    if (p.prosthetics.upper === 'confirmed') badges.push('рука');
    if (p.prosthetics.lower === 'confirmed') badges.push('нога');
    if (p.prosthetics.pediatric === 'confirmed') badges.push('дети');
    if (p.payment.ecertificate === 'confirmed') badges.push('э-сертификат');
    if (p.payment.paid === 'confirmed') badges.push('платно');
    const unknowns = Object.entries(p.unknown_reason || {});
    const unknownLabel = unknowns.length
      ? `<p class="kb-unknowns">Не уточнено: ${unknowns.map(([f, reason]) => `${esc(fieldLabel(f))} — ${esc(reason)}`).join('; ')}</p>`
      : '';
    return `
      <article class="clinic-card" data-kb-point="${esc(p.point_id)}" data-city="${esc(p.locality)}">
        <div class="clinic-top"><span class="clinic-index">${String(index + 1).padStart(2, '0')}</span><span class="kb-source-count">${Object.keys(p.evidence || {}).length} полей с источником</span></div>
        <h3>${esc(p.org)}</h3>
        <p>${esc(p.locality)}, ${esc(p.region)}${p.address ? ' · ' + esc(p.address) : ''}</p>
        <div class="clinic-tags">${badges.map((b) => `<span>${esc(b)}</span>`).join('')}</div>
        ${unknownLabel}
        <div class="clinic-actions">
          <button type="button" class="clinic-save" data-kb-point-open="${esc(p.point_id)}">Контакты и источники <svg class="icon"><use href="#i-arrow-up"/></svg></button>
        </div>
      </article>`;
  }

  function renderMap() {
    if (!state.data) return;
    const list = $('[data-clinic-list]');
    if (!list) return;
    list.innerHTML = state.data.points.map(pointCard).join('');
    const count = $('#mapCount');
    if (count) count.textContent = `${state.data.points.length} проверенных точек`;
    const canvasHead = $('.map-canvas-head span');
    if (canvasHead) canvasHead.innerHTML = '<svg class="icon"><use href="#i-map"/></svg> Схема по городам';
    const canvas = $('.map-canvas');
    if (canvas) {
      $$('.canvas-pin', canvas).forEach((pin) => pin.remove());
      const perCity = {};
      state.data.points.forEach((p, i) => {
        const base = cityPoint(p.locality);
        if (!base) return;
        const n = perCity[p.locality] = (perCity[p.locality] || 0) + 1;
        const shift = (n - 1) * 4.5;
        const x = Math.max(5, Math.min(95, base.x + shift));
        const y = Math.max(6, Math.min(94, base.y + shift * 0.7));
        const pin = document.createElement('button');
        pin.type = 'button';
        pin.className = 'canvas-pin';
        pin.style.setProperty('--x', x.toFixed(1) + '%');
        pin.style.setProperty('--y', y.toFixed(1) + '%');
        pin.dataset.kbPin = p.point_id;
        pin.setAttribute('aria-label', `${p.org}, ${p.locality}`);
        const label = p.locality.length > 12 ? p.locality.slice(0, 11) + '…' : p.locality;
        pin.innerHTML = `<span class="pin-pulse"></span><span class="pin-body">${i + 1}</span><span class="pin-label">${esc(label)}</span>`;
        canvas.appendChild(pin);
      });
    }
    const kicker = $('[data-view-panel="map"] .view-kicker');
    if (kicker) kicker.textContent = 'Проверенные точки базы знаний';
    const h1 = $('[data-view-panel="map"] .view-heading h1');
    if (h1) h1.textContent = 'Проверенные организации';
    const lead = $('[data-view-panel="map"] .view-heading p');
    if (lead) lead.textContent = `Точки, у которых каждое значимое поле подтверждено источником. Показаны ${state.data.points.length} из 186; остальные ещё проверяются и не рекомендуются.`;
    const head = $('.map-results-head span');
    if (head) head.textContent = 'Точки с подтверждёнными полями';
    const sortLabel = $('.map-results-head .sort-label');
    if (sortLabel) sortLabel.textContent = 'по региону';
    const disclaimer = $('.map-disclaimer');
    if (disclaimer) {
      disclaimer.innerHTML = '<svg class="icon"><use href="#i-info"/></svg> Позиции на схеме приблизительные (по городам, не адреса). Подтверждение услуги у сети не означает её наличие в конкретном филиале: неизвестные условия указаны в карточке.';
    }
  }

  function fieldLabel(field) {
    return ({
      address: 'адрес', phone: 'телефон', booking: 'запись',
      'payment.ecertificate': 'электронный сертификат', 'payment.paid': 'платные услуги',
      'prosthetics.upper': 'протезы рук', 'prosthetics.lower': 'протезы ног',
      'prosthetics.pediatric': 'детское протезирование', 'prosthetics.primary': 'первичное протезирование',
      'prosthetics.repeated': 'повторное протезирование'
    })[field] || field;
  }

  /* ---------------------------------------------------------------- modal */

  function openArticle(id) {
    const a = state.data && state.data.articles.find((x) => x.id === id);
    if (!a) return;
    const modal = $('#articleModal');
    if (!modal) return;
    $('#modalKicker').textContent = `База знаний · ${a.stage_label} · ${factsLabel(a.claims.length)}`;
    $('#modalTitle').textContent = a.title;
    $('#modalLead').textContent = a.audience;
    const facts = a.claims.map((c) => `
      <div class="kb-fact"><span class="kb-chip ${(SEVERITY[c.severity] || SEVERITY.info).cls}">${esc((SEVERITY[c.severity] || SEVERITY.info).label)}</span>
        <div class="kb-fact-body"><strong>${esc(c.anchor)}</strong><small>${esc(c.statement)} ${sourceLink(c.source_id)}</small></div></div>`).join('');
    $('#modalBody').innerHTML = `
      ${a.body_html}
      <h3>Что проверено</h3>
      <div class="chat-rich kb-facts"><div class="rich-title"><strong>Утверждения статьи</strong><span>${a.claims.length}</span></div>${facts}</div>
      ${evidenceFooter(a.claims)}
      <div class="modal-note">Материал носит справочный характер и не заменяет консультацию врача или специалиста по протезированию.</div>
      <div class="kb-modal-actions"><button class="btn btn-dark btn-sm" type="button" data-chat-quick="Расскажи подробнее: ${esc(a.title)}">Спросить агента</button></div>`;
    const ask = $('[data-modal-ask]');
    if (ask) ask.style.display = 'none';
    modal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function openProduct(id) {
    const p = state.data && state.data.products.find((x) => x.product_id === id);
    if (!p) return;
    const modal = $('#articleModal');
    if (!modal) return;
    $('#modalKicker').textContent = `Каталог · ${p.category_label} · ${p.manufacturer}`;
    $('#modalTitle').textContent = p.name;
    $('#modalLead').textContent = p.purpose || '';
    const specs = Object.entries(p.specs || {}).map(([k, v]) => {
      const ev = (p.spec_evidence || {})[k];
      return `<div class="rich-row"><span class="rich-check">•</span><div><strong>${esc(k)}: ${esc(v)}</strong><small>${ev ? esc(ev.source_location) + ' · ' + sourceLink(ev.source_id) : 'без подтверждения'}</small></div></div>`;
    }).join('');
    const periods = [
      p.warranty && p.warranty !== 'unknown' ? `<p><strong>Гарантия:</strong> ${esc(p.warranty)}</p>` : '',
      p.service_life_doc && p.service_life_doc !== 'unknown' ? `<p><strong>Ресурс по документации:</strong> ${esc(p.service_life_doc)}</p>` : '',
      p.normative_use_period && p.normative_use_period !== 'unknown' ? `<p><strong>Нормативный срок пользования ТСР:</strong> ${esc(p.normative_use_period)}</p>` : ''
    ].join('');
    $('#modalBody').innerHTML = `
      <p>${esc(p.purpose || '')}</p>
      <h3>Характеристики</h3>
      <div class="chat-rich kb-facts"><div class="rich-title"><strong>Подтверждённые параметры</strong><span>${Object.keys(p.specs || {}).length}</span></div>${specs}</div>
      ${periods ? `<h3>Гарантия и сроки</h3>${periods}` : ''}
      ${evidenceFooter(Object.values(p.spec_evidence || {}))}
      <div class="modal-note">Решение о применимости изделия к конкретному человеку принимает специалист. Каталог не является рекомендацией.</div>`;
    const ask = $('[data-modal-ask]');
    if (ask) ask.style.display = 'none';
    modal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function openPoint(id) {
    const p = state.data && state.data.points.find((x) => x.point_id === id);
    if (!p) return;
    const modal = $('#articleModal');
    if (!modal) return;
    $('#modalKicker').textContent = `Справочник · ${p.region}`;
    $('#modalTitle').textContent = p.org;
    $('#modalLead').textContent = `${p.locality}${p.address ? ', ' + p.address : ''}`;
    const rows = Object.entries(p.evidence || {}).map(([field, claim]) => `
      <div class="rich-row"><span class="rich-check">✓</span><div><strong>${esc(fieldLabel(field))}</strong><small>${esc(claim.statement)}<br>${esc(claim.source_location)} · ${sourceLink(claim.source_id)}</small></div></div>`).join('');
    const unknown = Object.entries(p.unknown_reason || {}).map(([f, r]) => `<li>${esc(fieldLabel(f))}: ${esc(r)}</li>`).join('');
    const contacts = [
      p.phone ? `<p><strong>Телефон:</strong> ${esc(p.phone)}</p>` : '',
      p.booking ? `<p><strong>Запись:</strong> ${esc(p.booking)}</p>` : '',
      p.website ? `<p><strong>Сайт:</strong> <a href="${esc(p.website)}" target="_blank" rel="noopener">${esc(p.website.replace(/^https?:\/\//, ''))}</a></p>` : ''
    ].join('');
    $('#modalBody').innerHTML = `
      <p>Организация: ${esc(p.org)} (${esc(ORG_TYPE[p.org_type] || 'тип не установлен')}).</p>
      ${contacts}
      <h3>Что подтверждено источником</h3>
      <div class="chat-rich kb-facts"><div class="rich-title"><strong>Поля карточки</strong><span>${Object.keys(p.evidence || {}).length}</span></div>${rows}</div>
      ${unknown ? `<h3>Что ещё неизвестно</h3><ul>${unknown}</ul>` : ''}
      ${evidenceFooter(Object.values(p.evidence || {}))}
      <div class="modal-note">Это не реклама и не рекомендация: точка отобрана по совпадению подтверждённых условий. Уточните актуальность условий перед визитом.</div>`;
    const ask = $('[data-modal-ask]');
    if (ask) ask.style.display = 'none';
    modal.hidden = false;
    document.body.classList.add('modal-open');
  }

  /* ---------------------------------------------------------------- chat */

  const RED_FLAG = /(гной|запах|температур|кровотеч|потемн|почерн|покрасн|отёк|отек|шов|не зажива|одышк|потеря сознан|онемел|пузыр|мокнут|натира|болит.*культ|культ.*болит)/;

  const STOP = new Set(['что', 'как', 'где', 'для', 'про', 'или', 'мне', 'меня', 'если', 'это', 'уже', 'есть', 'можно', 'нужно', 'надо', 'они', 'она', 'оно', 'при', 'чем', 'кто', 'так', 'всё', 'все', 'без', 'над', 'под']);

  function tokens(text) {
    return String(text || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').split(' ')
      .filter((w) => w.length > 2 && !STOP.has(w));
  }

  function scoreText(haystack, words) {
    const h = String(haystack || '').toLowerCase();
    let score = 0;
    for (const w of words) {
      const stem = w.slice(0, Math.max(4, Math.min(6, w.length)));
      if (h.includes(w)) score += 2;
      else if (h.includes(stem)) score += 1;
    }
    return score;
  }

  function search(query) {
    const words = tokens(query);
    if (!words.length || !state.data) return { kind: 'none', score: 0 };
    const results = [];
    for (const a of state.data.articles) {
      const score = scoreText(a.title, words) * 4 + scoreText(a.audience, words) * 2
        + scoreText(a.stage_label, words) * 2 + scoreText(a.body_html.replace(/<[^>]+>/g, ' '), words)
        + scoreText((a.claims || []).map((c) => c.statement).join(' '), words);
      if (score) results.push({ kind: 'article', score, item: a });
    }
    for (const n of state.data.norms) {
      const score = scoreText(n.content + ' ' + (n.practical || ''), words) * 2 + scoreText(n.act_title, words);
      if (score) results.push({ kind: 'norm', score, item: n });
    }
    for (const p of state.data.products) {
      const score = scoreText(p.name + ' ' + (p.name_ru || ''), words) * 3 + scoreText(p.category_label, words) * 2 + scoreText(p.purpose, words);
      if (score) results.push({ kind: 'product', score, item: p });
    }
    for (const p of state.data.points) {
      const score = scoreText(p.org + ' ' + p.locality + ' ' + p.region, words) * 3;
      if (score) results.push({ kind: 'point', score, item: p });
    }
    results.sort((a, b) => b.score - a.score);
    return results[0] || { kind: 'none', score: 0 };
  }

  function gapAnswer(query) {
    const topics = ['документы и ИПРА', 'выбор центра', 'замена протеза', 'уход за протезом', 'права и оплата'];
    return `<div class="chat-bubble"><p>В опубликованной базе нет проверенного ответа на этот запрос — и я не буду придумывать его своими словами.</p>
      <p>Так выглядит честный пробел: материал либо ещё проверяется, либо не дошёл до клинической редактуры. Уточните запрос или выберите тему, где ответ подтверждён источником.</p></div>
      <div class="chat-options">${topics.map((t) => `<button type="button" data-chat-quick="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div class="kb-gap-note">Запрос: «${esc(query)}». Всего в базе ${state.data.counts.articles} статей, ${state.data.counts.norms} норм, ${state.data.counts.products} изделий и ${state.data.counts.points} точек — только с подтверждением источника.</div>`;
  }

  function redFlagAnswer() {
    return `<div class="chat-bubble"><p><strong>Стоп.</strong> По этому признаку у меня нет редакционно допущенного ответа: статья о красных флагах проходит клиническую редактуру, и публиковать срочность «на глаз» я не буду.</p>
      <p>Если состояние ухудшается — не ждите ответа от приложения: свяжитесь с врачом, который вас наблюдает, или со службой экстренной помощи.</p></div>
      <div class="kb-gap-note">Почему так: материал о неотложных состояниях помечен «требует клинической редактуры» и в публикацию не входит. Это осознанное ограничение, а не сбой.</div>
      <div class="chat-options"><button type="button" data-chat-quick="Какие документы нужны для протезирования?">Документы</button><button type="button" data-chat-quick="Как выбрать центр протезирования?">Центр</button><button type="button" data-chat-quick="Как ухаживать за протезом?">Уход</button></div>`;
  }

  function articleAnswer(a) {
    const claims = (a.claims || []).slice().sort((x, y) => {
      const rank = { emergency: 3, urgent: 2, routine: 1, info: 0 };
      return (rank[y.severity] || 0) - (rank[x.severity] || 0);
    }).slice(0, 3);
    const rows = claims.map((c) => `
      <div class="kb-fact"><span class="kb-chip ${(SEVERITY[c.severity] || SEVERITY.info).cls}">${esc((SEVERITY[c.severity] || SEVERITY.info).label)}</span>
        <div class="kb-fact-body"><strong>${esc(c.anchor)}</strong><small>${esc(c.statement)} ${sourceLink(c.source_id)}</small></div></div>`).join('');
    return `<div class="chat-bubble"><p>${esc(a.audience)}</p></div>
      <div class="chat-rich"><div class="rich-title"><strong>${esc(a.title)}</strong><span>${factsLabel(a.claims.length)}</span></div>${rows}</div>
      ${evidenceFooter(claims)}
      <div class="rich-foot" style="margin-top:8px"><span>Проверено по первоисточникам</span>
        <button type="button" data-kb-article="${esc(a.id)}">Открыть статью <svg class="icon"><use href="#i-arrow-right"/></svg></button></div>`;
  }

  function normAnswer(n) {
    return `<div class="chat-bubble"><p><strong>${esc(n.act_title)}</strong>, ${esc(n.locator)}. ${esc(n.practical || n.content)}</p>
      <p>${esc(n.content)}</p>
      ${n.conditions ? `<p><strong>Условия:</strong> ${esc(n.conditions)}</p>` : ''}
      ${n.exceptions ? `<p><strong>Исключения:</strong> ${esc(n.exceptions)}</p>` : ''}
      <p class="kb-note-line">Редакция: ${esc(n.edition || 'не указана')}${n.valid_from ? ' · действует с ' + esc(n.valid_from) : ''}</p></div>
      ${evidenceFooter([n.claim])}
      <div class="rich-foot" style="margin-top:8px"><span>Норма проверена по официальному источнику</span><button type="button" data-chat-quick="Какие документы нужны для протезирования?">Что это значит для меня <svg class="icon"><use href="#i-arrow-right"/></svg></button></div>`;
  }

  function productAnswer(p) {
    const specs = Object.entries(p.specs || {}).slice(0, 4).map(([k, v]) => `<span>${esc(v)}</span>`).join('');
    return `<div class="chat-bubble"><p><strong>${esc(p.name)}</strong> — ${esc(p.category_label.toLowerCase())}, ${esc(LIMB[p.limb] || p.limb)}. ${esc(p.purpose || '')}</p></div>
      <div class="app-product-meta kb-inline-meta">${specs}</div>
      ${evidenceFooter(Object.values(p.spec_evidence || {}))}
      <div class="rich-foot" style="margin-top:8px"><span>Характеристики подтверждены источником</span><button type="button" data-kb-product-open="${esc(p.product_id)}">Карточка изделия <svg class="icon"><use href="#i-arrow-right"/></svg></button></div>`;
  }

  function pointAnswer(p) {
    const badges = [];
    if (p.prosthetics.upper === 'confirmed') badges.push('рука');
    if (p.prosthetics.lower === 'confirmed') badges.push('нога');
    if (p.prosthetics.pediatric === 'confirmed') badges.push('дети');
    if (p.payment.ecertificate === 'confirmed') badges.push('э-сертификат');
    return `<div class="chat-bubble"><p><strong>${esc(p.org)}</strong> — ${esc(p.locality)}, ${esc(p.region)}${p.address ? ', ' + esc(p.address) : ''}.</p>
      <p>Подтверждено: ${badges.length ? badges.join(', ') : 'только контакты'}. ${Object.keys(p.unknown_reason || {}).length ? 'Часть условий ещё не уточнена — они перечислены в карточке.' : ''}</p></div>
      ${p.phone ? `<p class="kb-note-line">Телефон: ${esc(p.phone)}</p>` : ''}
      ${evidenceFooter(Object.values(p.evidence || {}))}
      <div class="rich-foot" style="margin-top:8px"><span>Точка проверена по источнику</span><button type="button" data-kb-point-open="${esc(p.point_id)}">Карточка точки <svg class="icon"><use href="#i-arrow-right"/></svg></button></div>`;
  }

  function answerHtml(query) {
    if (!state.loaded || !state.data) return null;
    const text = String(query || '').trim();
    if (!text) return null;
    if (RED_FLAG.test(text.toLowerCase())) return redFlagAnswer();
    const hit = search(text);
    if (!hit || hit.kind === 'none' || hit.score < 3) return gapAnswer(text);
    if (hit.kind === 'article') return articleAnswer(hit.item);
    if (hit.kind === 'norm') return normAnswer(hit.item);
    if (hit.kind === 'product') return productAnswer(hit.item);
    if (hit.kind === 'point') return pointAnswer(hit.item);
    return gapAnswer(text);
  }

  /* ---------------------------------------------------------------- events */

  document.addEventListener('click', (event) => {
    const article = event.target.closest('[data-kb-article]');
    if (article) { event.preventDefault(); openArticle(article.dataset.kbArticle); return; }
    const product = event.target.closest('[data-kb-product-open]');
    if (product) { event.preventDefault(); openProduct(product.dataset.kbProductOpen); return; }
    const point = event.target.closest('[data-kb-point-open]');
    if (point) { event.preventDefault(); openPoint(point.dataset.kbPointOpen); return; }
    const pin = event.target.closest('[data-kb-pin]');
    if (pin) {
      const card = $(`[data-kb-point="${pin.dataset.kbPin}"]`);
      if (card) {
        $$('.clinic-card').forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      return;
    }
    if (event.target.closest('[data-kb-more]')) {
      state.productLimit = Math.min(state.data.products.length, state.productLimit + 9);
      const more = $('[data-kb-more]');
      if (more) more.remove();
      renderCatalog();
      return;
    }
    if (event.target.closest('[data-close-modal]')) {
      const ask = $('[data-modal-ask]');
      if (ask) ask.style.display = '';
    }
  });

  /* ---------------------------------------------------------------- boot */

  function boot() {
    return fetch('kb/kb.json', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then((data) => {
        state.data = data;
        state.loaded = true;
        renderLandingArticles();
        renderAppKnowledge();
        renderCatalog();
        renderMap();
        document.body.classList.add('kb-loaded');
        window.dispatchEvent(new CustomEvent('kb:ready', { detail: { counts: data.counts } }));
      })
      .catch((err) => {
        state.error = err;
        document.body.classList.add('kb-missing');
        console.warn('KB не загружена, сайт работает в демо-режиме:', err.message);
      });
  }

  window.KB = {
    state,
    load: boot,
    get ready() { return state.loaded; },
    answerHtml,
    search,
    openArticle,
    openProduct,
    openPoint,
    fieldLabel
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
