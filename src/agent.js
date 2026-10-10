import Anthropic from '@anthropic-ai/sdk';

// Разбор голосовой/текстовой фразы в поля формы новой работы.
// Ключ хранится только в localStorage этого устройства и уходит напрямую в api.anthropic.com.

const MODEL = 'claude-sonnet-5-5';

const SYSTEM = `Ты помощник оклейщика авто. Мастер надиктовал, что сделал. Разложи фразу по полям заказ-наряда.

Правила:
- clientId, complexId и id элементов бери ТОЛЬКО из переданных справочников. Элементы и комплексы ищи в прайсе выбранного заказчика.
- Если заказчик не назван, clientId = "studio".
- Элементы считай поштучно: «два крыла» → count 2, «обе передние двери» → 2. Если в прайсе одно общее «Крыло», а сказано «переднее и заднее» — это 2 штуки этого элемента.
- Позиции сгруппированы по разделам (section), в note — что входит в пакет. Учитывай раздел: «фары» в разделе «Оклейка фар пленкой» и «Бронирование фар» — разные услуги.
- Если сказано «полная оклейка», «чёрный глянец минимальный», «пакет 2» и т.п. и в прайсе есть подходящий комплекс — ставь complexId, а элементы, входящие в него, не дублируй. Комплекс в работе только один: если подходят два, ставь основной, второй упомяни в notes.
- Если у полной оклейки есть варианты по классу авто (седан/кроссовер/микроавтобус), выбирай по названному авто.
- Цена: у позиции price — нижняя граница, priceMax — верхняя (если есть). Если мастер назвал цену конкретной позиции («бампер за 4500») — запиши её в price этого элемента или в complexPrice. Не назвал — 0, тогда возьмётся цена из прайса.
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
  required: ['car', 'clientId', 'complexId', 'complexPrice', 'elements', 'share', 'manualTotal', 'startDT', 'endDT', 'orderNumber', 'comment', 'notes'],
  properties: {
    car: { type: 'string' },
    clientId: { type: 'string', enum: clientIds },
    complexId: { type: 'string', description: 'id комплекса из прайса заказчика или ""' },
    complexPrice: { type: 'number', description: 'цена комплекса, если названа, иначе 0' },
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

  const complexId = profile?.complex.some(c => c.id === r.complexId) ? r.complexId : '';
  if (r.complexId && !complexId) notes.push(`комплекс не найден в прайсе «${profile?.name}»`);

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
    complexId,
    complexPrice: complexId && r.complexPrice > 0 ? r.complexPrice : null,
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
