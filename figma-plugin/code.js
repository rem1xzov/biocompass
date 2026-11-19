/* Сгенерировано scripts/build-plugin-data.mjs — не редактировать вручную. */
const KB_DATA = {
  "generated_at": "2026-11-18T16:35:23+00:00",
  "counts": {
    "articles": 20,
    "norms": 17,
    "products": 68,
    "organizations": 12,
    "points": 11
  },
  "policy_version": "1.1.0",
  "stages": [
    {
      "code": "pre_amputation",
      "label": "Подготовка к ампутации",
      "total": 2,
      "published": 0,
      "titles": [],
      "articles": [],
      "pending": 2
    },
    {
      "code": "early_postop",
      "label": "Ранний период после ампутации",
      "total": 14,
      "published": 4,
      "titles": [
        "Близким: как помогать, не лишая самостоятельности",
        "Первый разговор о прогнозе: смогу ли ходить, пользоваться рукой"
      ],
      "articles": [
        "art-family-early-help",
        "art-first-prognosis-talk",
        "art-going-home",
        "art-mobility-aids"
      ],
      "pending": 10
    },
    {
      "code": "mse_ipra",
      "label": "МСЭ, инвалидность и ИПРА",
      "total": 9,
      "published": 5,
      "titles": [
        "Близким: как помогать, не лишая самостоятельности",
        "Как включить или изменить ТСР в ИПРА: заявления и порядок"
      ],
      "articles": [
        "art-family-early-help",
        "art-ipra-change-tsr",
        "art-ipra-reading",
        "art-payment-ways",
        "art-svo-and-special"
      ],
      "pending": 4
    },
    {
      "code": "choosing_center",
      "label": "Выбор центра и вида протеза",
      "total": 17,
      "published": 8,
      "titles": [
        "Детям и семьям: протезирование детей и ВПР",
        "Как выбирают протез: образ жизни, показания, бюджет"
      ],
      "articles": [
        "art-children",
        "art-choosing-prosthesis",
        "art-elderly",
        "art-family-early-help",
        "art-glossary",
        "art-payment-ways",
        "art-re-prosthetics",
        "art-svo-and-special"
      ],
      "pending": 9
    },
    {
      "code": "manufacturing",
      "label": "Изготовление и примерки",
      "total": 7,
      "published": 1,
      "titles": [
        "Базовые термины: гильза, лайнер, подвес, модуль"
      ],
      "articles": [
        "art-glossary"
      ],
      "pending": 6
    },
    {
      "code": "delivery",
      "label": "Получение изделия",
      "total": 4,
      "published": 0,
      "titles": [],
      "articles": [],
      "pending": 4
    },
    {
      "code": "training",
      "label": "Обучение и реабилитация",
      "total": 9,
      "published": 3,
      "titles": [
        "Этапы привыкания к протезу",
        "Пожилым пользователям протезов"
      ],
      "articles": [
        "art-adaptation-stages",
        "art-elderly",
        "art-life-terrain"
      ],
      "pending": 6
    },
    {
      "code": "daily_use",
      "label": "Повседневное использование",
      "total": 24,
      "published": 10,
      "titles": [
        "Этапы привыкания к протезу",
        "Детям и семьям: протезирование детей и ВПР"
      ],
      "articles": [
        "art-adaptation-stages",
        "art-children",
        "art-elderly",
        "art-event-repair",
        "art-family-early-help",
        "art-glossary",
        "art-life-terrain",
        "art-prosthesis-daily-care",
        "art-sport",
        "art-work-and-study"
      ],
      "pending": 14
    },
    {
      "code": "maintenance",
      "label": "Обслуживание и ремонт",
      "total": 10,
      "published": 4,
      "titles": [
        "Событие: поломка дома, на улице, в поездке",
        "Уход за протезом каждый день"
      ],
      "articles": [
        "art-event-repair",
        "art-prosthesis-daily-care",
        "art-replacement-timing",
        "art-svo-and-special"
      ],
      "pending": 6
    },
    {
      "code": "replacement",
      "label": "Замена и повторное протезирование",
      "total": 5,
      "published": 4,
      "titles": [
        "Детям и семьям: протезирование детей и ВПР",
        "Как включить или изменить ТСР в ИПРА: заявления и порядок"
      ],
      "articles": [
        "art-children",
        "art-ipra-change-tsr",
        "art-re-prosthetics",
        "art-replacement-timing"
      ],
      "pending": 1
    }
  ],
  "articles": [
    {
      "id": "art-adaptation-stages",
      "title": "Этапы привыкания к протезу",
      "stage": "training",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-daily-stump-care"
    },
    {
      "id": "art-children",
      "title": "Детям и семьям: протезирование детей и ВПР",
      "stage": "choosing_center",
      "limb": "any",
      "role": "family",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-choosing-center"
    },
    {
      "id": "art-choosing-prosthesis",
      "title": "Как выбирают протез: образ жизни, показания, бюджет",
      "stage": "choosing_center",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-mpu-and-bionic"
    },
    {
      "id": "art-elderly",
      "title": "Пожилым пользователям протезов",
      "stage": "choosing_center",
      "limb": "any",
      "role": "both",
      "events": [
        "event_fall"
      ],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-choosing-prosthesis"
    },
    {
      "id": "art-event-repair",
      "title": "Событие: поломка дома, на улице, в поездке",
      "stage": "daily_use",
      "limb": "any",
      "role": "both",
      "events": [
        "event_repair",
        "event_warranty_case",
        "event_trip"
      ],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-warranty"
    },
    {
      "id": "art-family-early-help",
      "title": "Близким: как помогать, не лишая самостоятельности",
      "stage": "early_postop",
      "limb": "any",
      "role": "family",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-emotions-after-amputation"
    },
    {
      "id": "art-first-prognosis-talk",
      "title": "Первый разговор о прогнозе: смогу ли ходить, пользоваться рукой",
      "stage": "early_postop",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-pain-postop-vs-phantom"
    },
    {
      "id": "art-glossary",
      "title": "Базовые термины: гильза, лайнер, подвес, модуль",
      "stage": "choosing_center",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-amputation-levels"
    },
    {
      "id": "art-going-home",
      "title": "Возвращение домой: подготовка квартиры",
      "stage": "early_postop",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-mobility-aids"
    },
    {
      "id": "art-ipra-change-tsr",
      "title": "Как включить или изменить ТСР в ИПРА: заявления и порядок",
      "stage": "mse_ipra",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-payment-ways"
    },
    {
      "id": "art-ipra-reading",
      "title": "ИПРА: как читать и что проверить",
      "stage": "mse_ipra",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-ipra-change-tsr"
    },
    {
      "id": "art-life-terrain",
      "title": "Улица: лестницы, бордюры, транспорт, гололёд",
      "stage": "daily_use",
      "limb": "lower",
      "role": "both",
      "events": [
        "event_fall"
      ],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-travel"
    },
    {
      "id": "art-mobility-aids",
      "title": "Кресло, ходунки, костыли: средства передвижения на первое время",
      "stage": "early_postop",
      "limb": "lower",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-daily-stump-care"
    },
    {
      "id": "art-payment-ways",
      "title": "Как получить и оплатить протез: ИПРА, электронный сертификат, платно",
      "stage": "mse_ipra",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 2,
      "verified": "2026-11-18",
      "next": "art-choosing-center"
    },
    {
      "id": "art-prosthesis-daily-care",
      "title": "Уход за протезом каждый день",
      "stage": "daily_use",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-life-terrain"
    },
    {
      "id": "art-re-prosthetics",
      "title": "Повторное протезирование: что учесть (и когда думать об upgrade)",
      "stage": "replacement",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-choosing-center"
    },
    {
      "id": "art-replacement-timing",
      "title": "Сроки пользования ТСР и плановая замена протеза",
      "stage": "replacement",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 2,
      "verified": "2026-11-18",
      "next": "art-re-prosthetics"
    },
    {
      "id": "art-sport",
      "title": "Спорт после ампутации",
      "stage": "daily_use",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-choosing-prosthesis"
    },
    {
      "id": "art-svo-and-special",
      "title": "Участникам СВО и их близким: особый порядок",
      "stage": "mse_ipra",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-rights-choice"
    },
    {
      "id": "art-work-and-study",
      "title": "Возвращение к работе и учёбе",
      "stage": "daily_use",
      "limb": "any",
      "role": "both",
      "events": [],
      "claims": 1,
      "verified": "2026-11-18",
      "next": "art-sport"
    }
  ],
  "routes": [
    {
      "id": "route-new-amputation",
      "title": "Только узнал об ампутации (до операции)",
      "when": "операция предстоит или обсуждается",
      "steps": [
        "art-pre-amputation-conversation",
        "art-before-surgery-checklist",
        "art-first-days-what-is-normal"
      ]
    },
    {
      "id": "route-just-operated",
      "title": "Только что прооперировали",
      "when": "ранний период после ампутации, рана и культя",
      "steps": [
        "art-first-days-what-is-normal",
        "art-when-call-doctor-urgent",
        "art-family-early-help",
        "art-documents-to-keep",
        "art-year-timeline"
      ]
    },
    {
      "id": "route-early-recovery",
      "title": "Раннее восстановление: боль, культя, первые шаги",
      "when": "первые недели после ампутации: боль, форма культи, движения, возвращение домой",
      "steps": [
        "art-first-prognosis-talk",
        "art-pain-postop-vs-phantom",
        "art-stump-shaping",
        "art-first-movements",
        "art-going-home",
        "art-mobility-aids"
      ]
    },
    {
      "id": "route-documents",
      "title": "Собираю документы",
      "when": "нужны МСЭ, ИПРА и оплата протеза",
      "steps": [
        "art-documents-to-keep",
        "art-mse-step-by-step",
        "art-ipra-reading",
        "art-ipra-change-tsr",
        "art-payment-ways"
      ]
    },
    {
      "id": "route-rights-benefits",
      "title": "Льготы, выплаты и права",
      "when": "нужно понять, что положено, и отстоять права",
      "steps": [
        "art-benefits-and-compensations",
        "art-svo-and-special",
        "art-rights-choice"
      ]
    },
    {
      "id": "route-devices",
      "title": "Разбираюсь в терминах и типах протезов",
      "when": "нужно понять уровни ампутации, типы протезов и термины",
      "steps": [
        "art-glossary",
        "art-amputation-levels",
        "art-prosthesis-types-lower",
        "art-prosthesis-types-upper",
        "art-how-prosthetics-works"
      ]
    },
    {
      "id": "route-choosing-center",
      "title": "Выбираю центр и протез",
      "when": "ИПРА есть, нужно выбрать организацию и тип изделия",
      "steps": [
        "art-choosing-center",
        "art-questions-before-contract",
        "art-choosing-prosthesis",
        "art-mpu-and-bionic"
      ]
    },
    {
      "id": "route-got-prosthesis",
      "title": "Получил протез",
      "when": "первая примерка, обучение, привыкание",
      "steps": [
        "art-first-fit",
        "art-wearing-time",
        "art-adaptation-stages",
        "art-daily-stump-care"
      ]
    },
    {
      "id": "route-fit-problem",
      "title": "Протез натирает, лайнер износился или нужен ремонт",
      "when": "проблема посадки, износ расходников, плановый осмотр, поломка",
      "steps": [
        "art-event-fit-problem",
        "art-liner-care",
        "art-checkups",
        "art-event-repair",
        "art-warranty"
      ]
    },
    {
      "id": "route-living",
      "title": "Живу с протезом",
      "when": "ежедневное использование, поездки, работа, спорт",
      "steps": [
        "art-prosthesis-daily-care",
        "art-life-terrain",
        "art-travel",
        "art-work-and-study",
        "art-sport"
      ]
    },
    {
      "id": "route-replacement",
      "title": "Подходит замена",
      "when": "истёк срок пользования или изделие износилось",
      "steps": [
        "art-replacement-timing",
        "art-re-prosthetics",
        "art-choosing-center"
      ]
    },
    {
      "id": "route-family",
      "title": "Я близкий",
      "when": "помощь родственнику после ампутации",
      "steps": [
        "art-family-early-help",
        "art-emotions-after-amputation",
        "art-documents-to-keep"
      ]
    }
  ],
  "catalog": [
    {
      "code": "knee_module",
      "label": "Коленный модуль",
      "count": 23,
      "ids": [
        "prd-2001",
        "prd-2002",
        "prd-2003"
      ]
    },
    {
      "code": "foot",
      "label": "Стопа",
      "count": 21,
      "ids": [
        "prd-2005",
        "prd-2006",
        "prd-2007"
      ]
    },
    {
      "code": "bionic_hand",
      "label": "Бионическая кисть",
      "count": 9,
      "ids": [
        "prd-2011",
        "prd-2012",
        "prd-2013"
      ]
    },
    {
      "code": "modular_prosthesis_lower",
      "label": "Модульный протез н/к",
      "count": 4,
      "ids": [
        "prd-2009",
        "prd-2065",
        "prd-2066"
      ]
    },
    {
      "code": "mech_hand",
      "label": "Механическая кисть",
      "count": 4,
      "ids": [
        "prd-2010",
        "prd-2015",
        "prd-2025"
      ]
    },
    {
      "code": "pediatric_prosthesis",
      "label": "Детский протез",
      "count": 3,
      "ids": [
        "prd-2024",
        "prd-2067",
        "prd-2070"
      ]
    },
    {
      "code": "liner",
      "label": "Лайнер",
      "count": 2,
      "ids": [
        "prd-2047",
        "prd-2068"
      ]
    },
    {
      "code": "cosmetic_prosthesis",
      "label": "Косметический протез",
      "count": 1,
      "ids": [
        "prd-2060"
      ]
    },
    {
      "code": "accessory",
      "label": "Аксессуар",
      "count": 1,
      "ids": [
        "prd-2071"
      ]
    }
  ],
  "points": 11,
  "norms": 17,
  "claims": 191,
  "sources": 94,
  "coverage": {
    "articles_total": 51,
    "articles_published": 20,
    "stages_total": 10,
    "stages_published": 8
  }
};

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
