import Anthropic from '@anthropic-ai/sdk';

// Разбор голосовой/текстовой фразы в поля формы новой работы.
// Ключ хранится только в localStorage этого устройства и уходит напрямую в api.anthropic.com.

const MODEL = 'claude-sonnet-5-5';

const DICTATION_NOTE = `Текст получен голосовой диктовкой клавиатуры телефона и содержит ошибки распознавания: слова, похожие по звучанию, слитые или разорванные слова («а термалка» → «атермалка»), латинские марки кириллицей («кия рио» → Kia Rio, «хавал» → Haval, «джили» → Geely), числа словами или с ошибками («четыре пятьсот» → 4500, «пол тора» → 1,5). Восстанавливай смысл по звучанию, сверяясь со справочниками. Термины мастера: «бронь», «броня» — полиуретановая плёнка; «атермалка» — атермальная плёнка; «тонер» — тонировка; «шумка» — шумоизоляция; «ПТФ», «птф» — противотуманные фары; «чёрный глянец», «блэк» — чёрный глянец; «арматурка» — снятие/установка деталей.`;

const SYSTEM = `Ты помощник оклейщика авто. Мастер надиктовал, что сделал. Разложи фразу по полям заказ-наряда.

${DICTATION_NOTE}

Правила:
- clientId, id комплексов и id элементов бери ТОЛЬКО из переданных справочников. Элементы и комплексы ищи в прайсе выбранного заказчика.
- Если заказчик не назван, clientId = "studio".
- Элементы считай поштучно: «два крыла» → count 2, «обе передние двери» → 2. Если в прайсе одно общее «Крыло», а сказано «переднее и заднее» — это 2 штуки этого элемента.
- Позиции сгруппированы по разделам (section), в note — что входит в пакет. Учитывай раздел: «фары» в разделе «Оклейка фар пленкой» и «Бронирование фар» — разные услуги.
- Если сказано «полная оклейка», «чёрный глянец минимальный», «пакет 2» и т.п. и в прайсе есть подходящий комплекс — добавь его в complexes, а элементы, входящие в него, не дублируй. Комплексов в работе может быть несколько («полная оклейка и чёрный глянец минимальный» — два).
- Если у полной оклейки есть варианты по классу авто (седан/кроссовер/микроавтобус), выбирай по названному авто.
- Цена: у позиции price — нижняя граница, priceMax — верхняя (если есть). Если мастер назвал цену конкретной позиции («бампер за 4500») — запиши её в price этого элемента или комплекса. Не назвал — 0, тогда возьмётся цена из прайса.
- car: марка и модель как в каталоге («камри» → «Toyota Camry»). Если авто нет в каталоге — запиши как сказано, с заглавной буквы.
- share: доля мастера дробью. «пополам», «на двоих», «50 на 50» → 0.5; «на троих» → 0.333; «один», «сам» → 1; «70 процентов» → 0.7. Не сказано → 0.
- manualTotal: только если мастер явно назвал итоговую сумму за всю работу («за всё 15 тысяч»). Иначе 0.
- Если работы нет в прайсе — не подбирай похожую позицию, а опиши её в notes (с ценой, если названа).
- startDT/endDT: формат YYYY-MM-DDTHH:mm в местном времени, считай от текущего момента («вчера с 10 до 18»). Не сказано → "".
- orderNumber: номер заказ-наряда, если назван. Иначе "".
- comment: только то, что не легло в поля (цвет плёнки, особенности). Иначе "".
- notes: коротко по-русски, что не удалось сопоставить или в чём сомневаешься. Если всё ясно — "".`;

const schema = (clientIds) => ({
  type: 'object',
  additionalProperties: false,
  required: ['car', 'clientId', 'complexes', 'elements', 'share', 'manualTotal', 'startDT', 'endDT', 'orderNumber', 'comment', 'notes'],
  properties: {
    car: { type: 'string' },
    clientId: { type: 'string', enum: clientIds },
    complexes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'price'],
        properties: { id: { type: 'string' }, price: { type: 'number' } },
      },
    },
    elements: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'count', 'price'],
        properties: { id: { type: 'string' }, count: { type: 'integer' }, price: { type: 'number' } },
      },
    },
    share: { type: 'number' },
    manualTotal: { type: 'number' },
    startDT: { type: 'string' },
    endDT: { type: 'string' },
    orderNumber: { type: 'string' },
    comment: { type: 'string' },
    notes: { type: 'string' },
  },
});

const nowLocal = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  const wd = d.toLocaleDateString('ru-RU', { weekday: 'long' });
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())} (${wd})`;
};

export async function parseJob(text, { apiKey, clients, profiles, cars }) {
  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const priceLists = clients.map(c => {
    const p = profiles.find(pr => pr.id === c.priceProfileId);
    return {
      clientId: c.id, name: c.name,
      complex: p?.complex || [],
      elements: p?.elements || [],
    };
  });

  const response = await anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', format: { type: 'json_schema', schema: schema(clients.map(c => c.id)) } },
    system: [
      { type: 'text', text: SYSTEM },
      // Справочники стабильны между запросами — кэшируем вместе с инструкцией
      { type: 'text', text: `Каталог авто:\n${cars.join('\n')}`, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{
      role: 'user',
      content: `Заказчики и прайсы:\n${JSON.stringify(priceLists)}\n\nСейчас: ${nowLocal()}\n\nФраза мастера:\n${text}`,
    }],
  });

  if (response.stop_reason === 'refusal') throw new Error('Модель отказалась разбирать фразу');
  if (response.stop_reason === 'max_tokens') throw new Error('Ответ модели обрезан');
  const block = response.content.find(b => b.type === 'text');
  if (!block) throw new Error('Пустой ответ модели');
  return sanitize(JSON.parse(block.text), clients, profiles);
}

// Модель может ошибиться в id — оставляем только то, что реально есть в прайсе
function sanitize(r, clients, profiles) {
  const client = clients.find(c => c.id === r.clientId) || clients[0];
  const profile = profiles.find(p => p.id === client.priceProfileId);
  const notes = r.notes ? [r.notes] : [];

  const complexIds = [], complexPrices = {};
  for (const { id, price } of r.complexes || []) {
    if (!profile?.complex.some(c => c.id === id)) { notes.push(`один из комплексов не найден в прайсе «${profile?.name}»`); continue; }
    if (complexIds.includes(id)) continue;
    complexIds.push(id);
    if (price > 0) complexPrices[id] = price;
  }

  const elementCounts = {}, elementPrices = {};
  for (const { id, count, price } of r.elements || []) {
    if (count <= 0) continue;
    if (!profile?.elements.some(e => e.id === id)) { notes.push(`одна из позиций не найдена в прайсе «${profile?.name}»`); continue; }
    elementCounts[id] = (elementCounts[id] || 0) + count;
    if (price > 0) elementPrices[id] = price;
  }

  const dt = (s) => (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s) ? s : '');

  return {
    clientId: client.id,
    car: r.car?.trim() || '',
    complexIds,
    complexPrices,
    elementCounts,
    elementPrices,
    share: r.share > 0 && r.share <= 1 ? r.share : null,
    manualTotal: r.manualTotal > 0 ? r.manualTotal : null,
    startDT: dt(r.startDT),
    endDT: dt(r.endDT),
    orderNumber: r.orderNumber?.trim() || '',
    comment: r.comment?.trim() || '',
    notes: notes.join('; '),
  };
}

const STATS_SYSTEM = `Мастер по оклейке авто спрашивает статистику своих работ. Переведи запрос в фильтр.

Запрос надиктован голосом и может содержать ошибки распознавания: названия заказчиков и даты восстанавливай по звучанию.

- from, to: даты YYYY-MM-DD включительно, считай от сегодняшней даты. «с 1 по 15 прошлый месяц» → 1-е и 15-е число прошлого месяца. «этот месяц» → с 1-го по последнее число текущего месяца. «прошлая неделя» → понедельник–воскресенье. «за год» → с 1 января по 31 декабря текущего года. Период не назван → текущий месяц.
- clientIds: id заказчиков из справочника, если названы. Не названы → пустой массив (все заказчики).
- label: короткое описание периода по-русски, например «1–15 сентября · Студия».
- notes: что не понял. Если всё ясно — "".`;

export async function parseStatsQuery(text, { apiKey, clients }) {
  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const response = await anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: {
      effort: 'low',
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['from', 'to', 'clientIds', 'label', 'notes'],
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
            clientIds: { type: 'array', items: { type: 'string', enum: clients.map(c => c.id) } },
            label: { type: 'string' },
            notes: { type: 'string' },
          },
        },
      },
    },
    system: STATS_SYSTEM,
    messages: [{
      role: 'user',
      content: `Заказчики: ${JSON.stringify(clients.map(({ id, name }) => ({ id, name })))}\n\nСегодня: ${nowLocal()}\n\nЗапрос:\n${text}`,
    }],
  });

  if (response.stop_reason === 'refusal') throw new Error('Модель отказалась разбирать запрос');
  const block = response.content.find(b => b.type === 'text');
  if (!block) throw new Error('Пустой ответ модели');
  const r = JSON.parse(block.text);
  const day = (s) => (/^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '');
  let from = day(r.from), to = day(r.to);
  if (from && to && from > to) [from, to] = [to, from];
  if (!from || !to) throw new Error('Не понял период');
  return { from, to, clientIds: [...new Set(r.clientIds)], label: r.label?.trim() || '', notes: r.notes?.trim() || '' };
}
