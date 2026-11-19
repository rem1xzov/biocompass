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

/* Функциональная архитектура «Биокомпаса» — описание, из которого плагин рисует доски.
 *
 * Структура повторяет подход Павла Шерера («Функциональная архитектура цифровых
 * продуктов», ч. 1–2): функции — это любые события системы, они складываются в
 * разделы, разделы вложены друг в друга, общие функции выносятся отдельно, у
 * функций есть типы (пользовательская, системная, проверка условия, негативная,
 * позитивная) и зависимости/блокировки.
 *
 * Адаптация под бизнес «Биокомпаса»: открытая платформа о протезировании, где
 * пользователь сам выбирает организацию, справочник не зависит от рекламы, а
 * медицинская срочность публикуется только после клинической редактуры.
 */

const ARCH = {
  title: 'Функциональная архитектура «Биокомпас»',
  subtitle: 'Продукт → функциональные разделы → функции → сценарии → компоненты → данные. ' +
    'Типы: П — пользовательская, С — системная, У — проверка условия, Н — негативная, + — позитивная.',

  levels: [
    { code: 'L0', label: 'Продукт', value: 'Открытая платформа: понять ситуацию → разобраться в документах → выбрать изделие и центр → жить с протезом' },
    { code: 'L1', label: 'Функциональные разделы', value: '10 разделов: вход, профиль, база знаний, маршрут, каталог, организации, агент, партнёры, редакция, платформа' },
    { code: 'L2', label: 'Ключевые функции', value: 'события разделов: пользовательские и системные' },
    { code: 'L3', label: 'Детальные функции', value: 'валидация, проверки условий, негативные ветки, общие функции' }
  ],

  sections: [
    {
      code: 'S1', name: 'Вход и доступ', role: 'низкий порог: гость → аккаунт',
      functions: [
        ['П', 'Просмотр без регистрации'],
        ['П', 'Регистрация: телефон или e-mail'],
        ['С', 'Код подтверждения и лимит попыток'],
        ['У', 'Код верный и не истёк?'],
        ['П', 'Вход и выход'],
        ['П', 'Восстановление доступа'],
        ['П', 'Согласия: политика и обработка данных'],
        ['С', 'Проверка прав и ролей'],
        ['Н', 'Отказ при неверном коде'],
        ['+', 'Успешный вход и возврат в прежний экран']
      ]
    },
    {
      code: 'S2', name: 'Профиль и контекст', role: 'персонализация без медицинских данных',
      functions: [
        ['П', 'Уровень ампутации и сторона'],
        ['П', 'Роль: пациент или близкий'],
        ['П', 'Регион и город'],
        ['П', 'Дата операции / этап пути'],
        ['С', 'Контекст для ответов агента'],
        ['П', 'Сохранённые статьи и чек-листы'],
        ['П', 'Экспорт своих данных'],
        ['С', 'Удаление аккаунта и данных']
      ]
    },
    {
      code: 'S3', name: 'База знаний', role: 'объяснить путь человеческим языком',
      functions: [
        ['С', 'Лента этапов: 10 шагов пути'],
        ['П', 'Поиск по статьям'],
        ['П', 'Фильтры: этап, конечность, роль'],
        ['С', 'Карточка статьи и оглавление'],
        ['С', 'Блок «что проверено»: утверждения и источники'],
        ['С', 'Следующий шаг и связанные статьи'],
        ['П', 'Сохранить статью и чек-лист'],
        ['Н', 'Нет статьи по запросу → честный пробел']
      ]
    },
    {
      code: 'S4', name: 'Маршрут', role: 'один путь, а не лабиринт',
      functions: [
        ['С', 'Персональный маршрут из 5 этапов'],
        ['П', 'Отметка выполненных шагов'],
        ['С', 'Прогресс и подсказка «что дальше»'],
        ['У', 'Изменился этап или событие?'],
        ['С', 'Ветвления: ремонт, посадка, красный флаг'],
        ['П', 'Сохранить маршрут и вернуться'],
        ['С', 'Напоминания (позже)']
      ]
    },
    {
      code: 'S5', name: 'Каталог изделий', role: 'ориентиры, не рекомендации',
      functions: [
        ['П', 'Категории: протезы, комплектующие, МПУ'],
        ['П', 'Фильтры по конечности и уровню'],
        ['С', 'Карточка изделия: назначение и характеристики'],
        ['С', 'Доказательства по каждому параметру'],
        ['П', 'Сравнение модификаций'],
        ['С', 'Срок эксплуатации и критерии подбора'],
        ['С', 'Цены только датированные'],
        ['Н', 'Параметр без источника → не показываем как факт'],
        ['С', 'Дисклеймер: решение принимает специалист']
      ]
    },
    {
      code: 'S6', name: 'Справочник организаций', role: 'выбор центра без рекламы',
      functions: [
        ['П', 'Поиск по региону и городу'],
        ['П', 'Фильтры: дети, рука/нога, первичное/повторное, э-сертификат, ремонт'],
        ['С', 'Карточка точки: подтверждённые поля и источники'],
        ['С', 'Неизвестные условия показаны явно'],
        ['С', 'Схема: приблизительные позиции по городам'],
        ['У', 'Услуга подтверждена у точки, а не у сети?'],
        ['Н', 'Только сеть → unknown, не рекомендация'],
        ['П', 'Сохранить в избранное и уточнить перед визитом']
      ]
    },
    {
      code: 'S7', name: 'Агент', role: 'проводник, а не энциклопедия',
      functions: [
        ['П', 'Диалог с учётом контекста'],
        ['С', 'Ответ из подтверждённых утверждений'],
        ['С', 'Ссылка на источник и дату проверки'],
        ['П', 'Уточняющие вопросы'],
        ['П', 'Быстрые сценарии входа'],
        ['П', 'Переход к статье, изделию, точке'],
        ['Н', 'Нет проверенного ответа → пробел'],
        ['Н', 'Медицинская срочность → отказ до редактуры'],
        ['С', 'Ограничение тем и запрещённые советы'],
        ['С', 'Эскалация к человеку (позже)']
      ]
    },
    {
      code: 'S8', name: 'Партнёрский контур', role: 'деньги отдельно от рекомендаций',
      functions: [
        ['П', 'Заявка организации на размещение'],
        ['С', 'Проверка профиля и лицензии'],
        ['С', 'Метка «партнёр» на карточке'],
        ['С', 'Оплата присутствия в каталоге'],
        ['С', 'Правило: плата не влияет на ранжирование'],
        ['С', 'Отчёт показов и переходов'],
        ['Н', 'Отказ при непройденной проверке']
      ]
    },
    {
      code: 'S9', name: 'Редакция и качество', role: 'внутренний конвейер доверия',
      functions: [
        ['С', 'Импорт статей и актов'],
        ['П', 'Редактура текста'],
        ['П', 'Клиническая редактура срочности'],
        ['С', 'Реестр утверждений и источников'],
        ['П', 'Проверка источника: место и цитата'],
        ['С', 'Публикационная политика'],
        ['С', 'Публикация, откат, журнал изменений'],
        ['Н', 'Расхождение источников → блок публикации']
      ]
    },
    {
      code: 'S10', name: 'Платформа и данные', role: 'технический фундамент',
      functions: [
        ['С', 'Единый словарь значений'],
        ['С', 'Валидация схем и ссылок'],
        ['С', 'Публикационная выгрузка'],
        ['С', 'Поиск и индекс'],
        ['С', 'Аналитика воронки'],
        ['С', 'Доступность: клавиатура, контраст, скринридер'],
        ['С', 'Приватность и минимум медицинских данных'],
        ['С', 'Резервные копии и восстановление']
      ]
    }
  ],

  shared: [
    ['Поиск', 'S3, S5, S6'],
    ['Фильтры и сортировка', 'S5, S6'],
    ['Карточка-просмотр', 'S3, S5, S6'],
    ['Цитата и источник', 'S3, S5, S6, S7'],
    ['Состояния «неизвестно / пробел»', 'S3, S6, S7'],
    ['Формы и валидация', 'S1, S2, S8'],
    ['Модальные окна', 'S3, S5, S6'],
    ['Меню и навигация', 'все разделы'],
    ['Избранное', 'S4, S6, S7'],
    ['Уведомления и тосты', 'S1, S7, S8'],
    ['Аналитика событий', 'S3–S7'],
    ['Дисклеймер и ограничения', 'S5, S6, S7']
  ],

  blocks: [
    ['Публикационная политика', 'блокирует ответы агента, пока утверждение не подтверждено'],
    ['Клиническая редактура', 'блокирует любую срочность и медицинские советы'],
    ['Доказательства параметров', 'блокирует сравнение изделий и «характеристики»'],
    ['Подтверждение полей точки', 'блокирует рекомендацию центра, если поля не подтверждены'],
    ['Согласия и приватность', 'блокирует сохранение медицинского контекста'],
    ['Проверка партнёра', 'блокирует размещение в каталоге'],
    ['Лимит попыток входа', 'блокирует повторную отправку кода']
  ],

  scenario: {
    title: 'Функциональный сценарий: «Нужен центр для ребёнка, рука, по сертификату»',
    nodes: [
      { id: 'start', type: 'user', text: 'Запрос в чате' },
      { id: 'ctx', type: 'system', text: 'Профиль: ребёнок, верхняя конечность, регион' },
      { id: 'ipra', type: 'cond', text: 'Есть ИПРА?' },
      { id: 'kb', type: 'user', text: 'Статья «Как получить и оплатить протез»' },
      { id: 'filters', type: 'user', text: 'Фильтры: дети, рука, э-сертификат' },
      { id: 'search', type: 'system', text: 'Поиск по подтверждённым точкам' },
      { id: 'has', type: 'cond', text: 'Есть подтверждённые точки?' },
      { id: 'gap', type: 'negative', text: 'Пробел: «нет подтверждённой точки», кандидаты не рекомендуем' },
      { id: 'card', type: 'system', text: 'Карточка точки: поля, источники, неизвестное' },
      { id: 'ecert', type: 'cond', text: 'Э-сертификат подтверждён у точки?' },
      { id: 'unknown', type: 'negative', text: 'Показать «не подтверждено» + уточнить перед визитом' },
      { id: 'contact', type: 'positive', text: 'Записаться: телефон или форма' },
      { id: 'save', type: 'user', text: 'Сохранить точку и вернуться в маршрут' },
      { id: 'end', type: 'positive', text: 'Ответ с источниками и следующим шагом' }
    ],
    edges: [
      ['start', 'ctx'], ['ctx', 'ipra'],
      ['ipra', 'kb', 'нет'], ['ipra', 'filters', 'да'],
      ['kb', 'filters'], ['filters', 'search'], ['search', 'has'],
      ['has', 'gap', 'нет'], ['has', 'card', 'да'],
      ['card', 'ecert'], ['ecert', 'unknown', 'нет'], ['ecert', 'contact', 'да'],
      ['unknown', 'save'], ['contact', 'save'], ['gap', 'end'], ['save', 'end']
    ]
  },

  matrix: {
    components: ['Клиент', 'API', 'БД', 'Редакция', 'Партнёр'],
    rows: [
      ['Вход и доступ', '●●', '●', '●', '', ''],
      ['Профиль и контекст', '●●', '●', '●', '', ''],
      ['База знаний', '●●', '●', '●', '●', ''],
      ['Маршрут', '●●', '●', '●', '', ''],
      ['Каталог изделий', '●●', '●', '●', '●', ''],
      ['Справочник организаций', '●●', '●', '●', '●', '●'],
      ['Агент', '●●', '●●', '●', '●', ''],
      ['Партнёрский контур', '●', '●●', '●', '', '●●'],
      ['Редакция и качество', '●', '●', '●●', '●●', ''],
      ['Платформа и данные', '', '●●', '●●', '', '']
    ]
  },

  entities: [
    ['Статья', 'этап, конечность, роль, следующий шаг'],
    ['Утверждение', 'сущность, поле, срочность, источник, место'],
    ['Источник', 'тип, ссылка, дата, первичный/вторичный'],
    ['Норма', 'акт, пункт, редакция, условия'],
    ['Изделие', 'категория, параметры, доказательства'],
    ['Организация', 'профиль, тип, сайт'],
    ['Точка приёма', 'адрес, услуги, оплата, неизвестное'],
    ['Кандидат', 'причина, что проверить'],
    ['Публикация', 'политика, допуск, блокеры'],
    ['Пользователь', 'роль, контекст, согласия'],
    ['Партнёр', 'статус, оплата, метка'],
    ['Событие аналитики', 'шаг, источник, результат']
  ],

  entityEdges: [
    ['Пользователь', 'Публикация', 'читает'],
    ['Публикация', 'Статья', 'допускает'],
    ['Статья', 'Утверждение', 'состоит из'],
    ['Утверждение', 'Источник', 'подтверждается'],
    ['Норма', 'Утверждение', 'даёт норму'],
    ['Изделие', 'Утверждение', 'параметры'],
    ['Точка приёма', 'Утверждение', 'поля'],
    ['Точка приёма', 'Организация', 'принадлежит'],
    ['Кандидат', 'Точка приёма', 'не рекомендован'],
    ['Партнёр', 'Организация', 'представляет'],
    ['Событие аналитики', 'Пользователь', 'фиксирует']
  ]
};

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
