import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, List, BarChart3, Settings, Trash2, Calendar, User, X, ChevronDown, Pencil, Camera, Image as ImageIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ============ СПРАВОЧНИКИ ============
const CAR_CATALOG = {
  'Lada': ['Vesta', 'Granta', 'Niva', 'Niva Travel', 'X-Ray', 'Largus', 'Kalina', 'Priora', '2107', '2114'],
  'BMW': ['X1', 'X3', 'X4', 'X5', 'X6', 'X7', '3 Series', '5 Series', '7 Series', 'M3', 'M5', 'i4', 'iX'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'G-Class', 'CLA', 'CLS', 'AMG GT', 'EQS', 'V-Class'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS6', 'e-tron'],
  'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'Teramont', 'Jetta', 'Arteon', 'ID.4'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Land Cruiser', 'Land Cruiser Prado', 'Hilux', 'C-HR', 'Fortuner'],
  'Lexus': ['ES', 'IS', 'LS', 'NX', 'RX', 'LX', 'GX', 'UX', 'LC'],
  'Kia': ['Rio', 'Cerato', 'Optima', 'K5', 'Sportage', 'Sorento', 'Seltos', 'Stinger', 'Carnival', 'Mohave', 'Soul'],
  'Hyundai': ['Solaris', 'Elantra', 'Sonata', 'Creta', 'Tucson', 'Santa Fe', 'Palisade', 'i30'],
  'Genesis': ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  'Skoda': ['Rapid', 'Octavia', 'Superb', 'Karoq', 'Kodiaq', 'Kamiq'],
  'Ford': ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Explorer', 'Mustang', 'F-150'],
  'Nissan': ['Qashqai', 'X-Trail', 'Murano', 'Patrol', 'Juke', 'Teana', 'Almera', 'Pathfinder', 'GT-R'],
  'Mazda': ['3', '6', 'CX-3', 'CX-5', 'CX-7', 'CX-9', 'CX-30', 'MX-5'],
  'Mitsubishi': ['Outlander', 'Pajero', 'Pajero Sport', 'ASX', 'Eclipse Cross', 'L200'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
  'Subaru': ['Forester', 'Outback', 'XV', 'Impreza', 'WRX'],
  'Suzuki': ['Vitara', 'SX4', 'Jimny', 'Swift'],
  'Renault': ['Logan', 'Sandero', 'Duster', 'Kaptur', 'Arkana', 'Megane'],
  'Volvo': ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'V90'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Cayman'],
  'Land Rover': ['Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Defender'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Compass', 'Renegade'],
  'Infiniti': ['Q50', 'Q60', 'QX50', 'QX60', 'QX70', 'QX80'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  'Chery': ['Tiggo 4', 'Tiggo 7 Pro', 'Tiggo 8 Pro', 'Arrizo 8', 'Tiggo 9'],
  'Haval': ['Jolion', 'F7', 'F7x', 'H9', 'Dargo', 'H5'],
  'Geely': ['Coolray', 'Atlas', 'Atlas Pro', 'Tugella', 'Monjaro', 'Emgrand', 'Preface'],
  'Exeed': ['TXL', 'VX', 'LX', 'RX'],
  'Tank': ['300', '500', '700'],
  'Changan': ['CS35 Plus', 'CS55 Plus', 'CS75 Plus', 'UNI-V', 'UNI-K'],
  'Omoda': ['C5', 'S5', 'C7'],
  'Jetour': ['Dashing', 'X70 Plus', 'X90 Plus', 'T2'],
  'BYD': ['Han', 'Tang', 'Song Plus', 'Seal', 'Atto 3'],
  'Zeekr': ['001', '007', '009', 'X'],
  'Li Auto': ['L6', 'L7', 'L8', 'L9', 'Mega'],
  'Moskvich': ['3', '3e', '6', '8'],
  'GAC': ['GS8', 'GS3', 'GN8'],
  'MG': ['ZS', 'HS', '4', '5'],
};
const FLAT_CARS = Object.entries(CAR_CATALOG).flatMap(([b, ms]) => ms.map(m => `${b} ${m}`)).sort();

const STUDIO_PRICE = {
  id: 'studio', name: 'Студия',
  complex: [
    { id: 'c1', name: 'Полная оклейка кузова', price: 120000 },
    { id: 'c2', name: 'Фронт (капот+бампер+крылья+фары)', price: 35000 },
    { id: 'c3', name: 'Антигравий полный', price: 90000 },
    { id: 'c4', name: 'Антигравий фронт', price: 28000 },
    { id: 'c5', name: 'Крыша в чёрный глянец', price: 12000 },
  ],
  elements: [
    { id: 'e1', name: 'Капот', price: 10000 },
    { id: 'e2', name: 'Бампер передний', price: 8000 },
    { id: 'e3', name: 'Бампер задний', price: 8000 },
    { id: 'e4', name: 'Крыло переднее', price: 5000 },
    { id: 'e5', name: 'Крыло заднее', price: 5000 },
    { id: 'e6', name: 'Дверь', price: 7000 },
    { id: 'e7', name: 'Крыша', price: 10000 },
    { id: 'e8', name: 'Порог', price: 5000 },
    { id: 'e9', name: 'Зеркало', price: 2000 },
    { id: 'e10', name: 'Ручка', price: 1000 },
    { id: 'e11', name: 'Фара', price: 2500 },
    { id: 'e12', name: 'Стойка', price: 3000 },
  ],
};

const DEALER_PRICE = {
  id: 'dealer', name: 'Дилер',
  complex: [
    { id: 'c1', name: 'Полная оклейка кузова', price: 90000 },
    { id: 'c2', name: 'Фронт', price: 25000 },
    { id: 'c3', name: 'Антигравий полный', price: 65000 },
    { id: 'c4', name: 'Антигравий фронт', price: 20000 },
  ],
  elements: [
    { id: 'e1', name: 'Капот', price: 7000 },
    { id: 'e2', name: 'Бампер передний', price: 6000 },
    { id: 'e3', name: 'Бампер задний', price: 6000 },
    { id: 'e4', name: 'Крыло', price: 3500 },
    { id: 'e5', name: 'Дверь', price: 5000 },
    { id: 'e6', name: 'Крыша', price: 7000 },
    { id: 'e7', name: 'Порог', price: 3500 },
  ],
};

const DEFAULT_CLIENTS = [
  { id: 'studio', name: 'Студия', priceProfileId: 'studio', isDefault: true },
  { id: 'dealer', name: 'Дилер', priceProfileId: 'dealer', isDefault: true },
];

const SHARE_OPTIONS = [{ label: '100%', value: 1 }, { label: '50%', value: 0.5 }, { label: '33.3%', value: 0.333 }];
const KEYS = { JOBS: 'jobs_v2', CLIENTS: 'clients_v2', PROFILES: 'profiles_v2', CUSTOM_CARS: 'custom_cars', API_KEY: 'anthropic_api_key' };

const load = (k, fb) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.error(e); } };

const fmt = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n || 0)) + ' ₽';
const nf = (n) => new Intl.NumberFormat('ru-RU').format(n || 0);
const hasRange = (it) => it.priceMax > it.price;
const fmtRange = (it) => hasRange(it) ? `${nf(it.price)}–${nf(it.priceMax)}` : nf(it.price);
// «Минимальный» без раздела непонятен — добавляем раздел, если его нет в названии
const itemLabel = (it) => {
  if (!it.section) return it.name;
  const name = it.name.toLowerCase();
  const words = it.section.toLowerCase().split(/[\s/()]+/).filter(w => w.length >= 5);
  return words.some(w => name.includes(w)) ? it.name : `${it.section}: ${it.name}`;
};
const groupBySection = (items) => items.reduce((groups, it) => {
  const s = it.section || 'Без раздела';
  const g = groups.find(x => x.section === s);
  g ? g.items.push(it) : groups.push({ section: s, items: [it] });
  return groups;
}, []);

// Снимок позиций в работу: после замены прайса старые работы сохраняют расшифровку
const jobLines = ({ complexId, complexPrice, elementCounts = {}, elementPrices = {} }, profile) => {
  const lines = [];
  const cx = profile?.complex.find(c => c.id === complexId);
  if (cx) lines.push({ kind: 'complex', name: itemLabel(cx), qty: 1, price: complexPrice ?? cx.price });
  for (const [id, qty] of Object.entries(elementCounts)) {
    const el = profile?.elements.find(e => e.id === id);
    if (el && qty > 0) lines.push({ kind: 'element', name: itemLabel(el), qty, price: elementPrices[id] ?? el.price });
  }
  return lines;
};
const nowISO = () => { const d = new Date(); d.setSeconds(0, 0); return d.toISOString().slice(0, 16); };
const fmtDT = (iso) => { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }); };

const compressImage = (file, maxW = 800, quality = 0.7) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// ============ Combobox авто ============
function CarCombobox({ value, onChange, customCars = [], onAddCar }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const ref = useRef(null);

  const allCars = useMemo(() => {
    const merged = [...new Set([...FLAT_CARS, ...customCars])];
    return merged.sort();
  }, [customCars]);

  useEffect(() => setQuery(value || ''), [value]);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCars.slice(0, 50);
    return allCars.filter(c => c.toLowerCase().includes(q)).slice(0, 50);
  }, [query, allCars]);

  const queryTrimmed = query.trim();
  const isCustom = queryTrimmed && !allCars.some(c => c.toLowerCase() === queryTrimmed.toLowerCase());

  const pick = (c) => { setQuery(c); onChange(c); setOpen(false); };
  const addCustom = () => {
    if (queryTrimmed && onAddCar) {
      onAddCar(queryTrimmed);
      onChange(queryTrimmed);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2">
        <input value={query} onFocus={() => setOpen(true)}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          placeholder="Начни вводить марку..."
          className="wt-input flex-1" />
        <button onClick={() => setOpen(!open)} className="px-3 bg-white border border-slate-200 rounded-xl text-slate-600"><ChevronDown size={18} /></button>
      </div>
      {open && (suggestions.length > 0 || isCustom) && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {isCustom && (
            <button onClick={addCustom}
              className="w-full text-left px-3 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
              <Plus size={14} /> Добавить «{queryTrimmed}» в справочник
            </button>
          )}
          {suggestions.map(c => (
            <button key={c} onClick={() => pick(c)}
              className={`w-full text-left px-3 py-2 text-sm border-b border-slate-100 last:border-0 transition
                ${customCars.includes(c) ? 'bg-emerald-50/30 font-medium' : 'hover:bg-slate-100'}`}>
              {c}
              {customCars.includes(c) && <span className="text-xs text-emerald-600 ml-2">свой</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Модал нового клиента ============
function NewClientModal({ profiles, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [baseId, setBaseId] = useState('studio');

  return (
    <div className="fixed inset-0 bg-black/50 z-30 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Новый заказчик</h3>
          <button onClick={onClose} className="text-slate-400"><X size={20} /></button>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Название</label>
          <input value={name} onChange={e => setName(e.target.value)} autoFocus placeholder="Например, Иван"
            className="wt-input text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Прайс на основе</label>
          <select value={baseId} onChange={e => setBaseId(e.target.value)}
            className="wt-input">
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <p className="text-xs text-slate-400 mt-1">Создастся отдельный прайс-профиль, его можно отредактировать в Настройках.</p>
        </div>
        <button onClick={() => { if (name.trim()) onCreate(name.trim(), baseId); }}
          className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl">Создать</button>
      </div>
    </div>
  );
}

// ============ ЭКРАН 1: Форма ============
// ============ Голосовой ввод ============
function VoiceInput({ apiKey, clients, profiles, customCars, onParsed, onOpenSettings }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  const run = async () => {
    if (!text.trim() || busy) return;
    setBusy(true); setError(''); setNotes('');
    try {
      const { parseJob } = await import('./agent');
      const r = await parseJob(text.trim(), { apiKey, clients, profiles, cars: [...FLAT_CARS, ...customCars] });
      onParsed(r);
      setNotes(r.notes);
      setText('');
    } catch (e) {
      console.error(e);
      setError(e?.status === 401 ? 'Неверный API-ключ' : e?.message || 'Не удалось разобрать');
    } finally {
      setBusy(false);
    }
  };

  if (!apiKey) {
    return (
      <button onClick={onOpenSettings} className="wt-card w-full p-3 text-left text-xs text-slate-500">
        Голосовой ввод: добавь API-ключ Claude в <span className="font-semibold text-emerald-700 underline">настройках</span>
      </button>
    );
  }

  return (
    <div className="wt-card p-3 space-y-2">
      <div className="label-upper">Расскажи, что сделал</div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
        placeholder="Камри, студия, капот и два передних крыла, пополам. Вчера с 10 до 17"
        className="wt-input" style={{ minHeight: 72 }} />
      <p className="text-xs text-slate-400">Нажми микрофон на клавиатуре и надиктуй</p>
      <button onClick={run} disabled={busy || !text.trim()}
        className={`btn-accent ${busy || !text.trim() ? 'opacity-50' : ''}`}>
        {busy ? 'Разбираю…' : 'Заполнить форму'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {notes && <p className="text-xs text-amber-600">Проверь: {notes}</p>}
    </div>
  );
}

function JobForm({ clients, profiles, editJob, onSave, onUpdate, onCancelEdit, onAddClient, customCars, onAddCar, apiKey, onOpenSettings }) {
  const isEdit = !!editJob;

  const [startDT, setStartDT] = useState(editJob?.startDT || nowISO());
  const [endDT, setEndDT] = useState(editJob?.endDT || nowISO());
  const [clientId, setClientId] = useState(editJob?.clientId || 'studio');
  const [orderNumber, setOrderNumber] = useState(editJob?.orderNumber || '');
  const [photos, setPhotos] = useState(editJob?.photos || []);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [car, setCar] = useState(editJob?.car || '');
  const [complexId, setComplexId] = useState(editJob?.complexId || '');
  const [elementCounts, setElementCounts] = useState(editJob?.elementCounts || editJob?.elementIds?.reduce((m, id) => ({ ...m, [id]: (m[id] || 0) + 1 }), {}) || {});
  // Цена за работу, если отличается от прайса (диапазоны): '' / отсутствие ключа = цена из прайса
  const [complexPrice, setComplexPrice] = useState(editJob?.complexPrice != null ? String(editJob.complexPrice) : '');
  const [elementPrices, setElementPrices] = useState(editJob?.elementPrices || {});
  const [elSearch, setElSearch] = useState('');
  const [openSection, setOpenSection] = useState(null);
  const [share, setShare] = useState(editJob?.share ?? 1);
  const [customPercent, setCustomPercent] = useState('');
  const [manualTotal, setManualTotal] = useState(editJob?.manualTotal != null ? String(editJob.manualTotal) : '');
  const [comment, setComment] = useState(editJob?.comment || '');
  const [showModal, setShowModal] = useState(false);

  const client = clients.find(c => c.id === clientId);
  const profile = profiles.find(p => p.id === client?.priceProfileId) || profiles[0];

  const handleClientChange = (newId) => {
    if (newId === clientId) return;
    setClientId(newId);
    setComplexId(''); setComplexPrice('');
    setElementCounts({}); setElementPrices({});
  };

  const handleShareButton = (val) => {
    setShare(val);
    setCustomPercent('');
  };

  const handleCustomPercent = (val) => {
    setCustomPercent(val);
    if (val !== '') {
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0) setShare(num / 100);
    }
  };

  const elPrice = (el) => elementPrices[el.id] ?? el.price;
  const selectedComplex = profile?.complex.find(c => c.id === complexId);
  const complexPriceNum = complexPrice !== '' ? (parseFloat(complexPrice) || 0) : null;

  const elementsSubtotal = useMemo(() => {
    return Object.entries(elementCounts).reduce((s, [id, cnt]) => {
      const el = profile?.elements.find(e => e.id === id);
      return s + (el ? elPrice(el) : 0) * cnt;
    }, 0);
  }, [elementCounts, elementPrices, profile]);

  // Работа, сохранённая по старому прайсу: её позиций уже нет — считаем по снимку, пока не выбрано новое
  const hasKnownElements = Object.keys(elementCounts).some(id => profile?.elements.some(e => e.id === id));
  const legacyLines = isEdit && editJob.lines?.length && !selectedComplex && !hasKnownElements ? editJob.lines : null;

  const calcTotal = useMemo(() => {
    if (legacyLines) return legacyLines.reduce((s, l) => s + l.price * l.qty, 0);
    const cp = selectedComplex ? (complexPriceNum ?? selectedComplex.price) : 0;
    return cp + elementsSubtotal;
  }, [legacyLines, selectedComplex, complexPriceNum, elementsSubtotal]);

  const setElPrice = (id, val) => setElementPrices(prev => {
    if (val === '') { const { [id]: _, ...rest } = prev; return rest; }
    return { ...prev, [id]: parseFloat(val) || 0 };
  });

  const calcWithShare = calcTotal * share;
  const finalTotal = manualTotal !== '' ? (parseFloat(manualTotal) || 0) : calcWithShare;
  const baseTotal = manualTotal !== '' ? (parseFloat(manualTotal) || 0) : calcTotal;

  const incEl = (id) => setElementCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const decEl = (id) => {
    const c = (elementCounts[id] || 0) - 1;
    if (c > 0) { setElementCounts({ ...elementCounts, [id]: c }); return; }
    const { [id]: _, ...rest } = elementCounts;
    setElementCounts(rest);
    setElPrice(id, '');
  };

  const handlePhoto = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const compressed = await Promise.all(files.map(f => compressImage(f)));
    setPhotos(prev => [...prev, ...compressed].slice(0, 5));
    e.target.value = '';
    setShowPhotoMenu(false);
  };
  const removePhoto = (idx) => setPhotos(prev => prev.filter((_, i) => i !== idx));

  const createClient = (name, baseId) => { const c = onAddClient(name, baseId); setClientId(c.id); setShowModal(false); };

  // Заполнение формы ответом агента: перезаписываем только то, что он распознал
  const applyParsed = (r) => {
    setClientId(r.clientId);
    setComplexId(r.complexId);
    setComplexPrice(r.complexPrice != null ? String(r.complexPrice) : '');
    setElementCounts(r.elementCounts);
    setElementPrices(r.elementPrices);
    if (r.car) setCar(r.car);
    if (r.share != null) {
      const preset = SHARE_OPTIONS.find(o => o.value === r.share);
      setShare(r.share);
      setCustomPercent(preset ? '' : String(Math.round(r.share * 100)));
    }
    if (r.manualTotal != null) setManualTotal(String(r.manualTotal));
    if (r.startDT) setStartDT(r.startDT);
    if (r.endDT) setEndDT(r.endDT);
    if (r.orderNumber) setOrderNumber(r.orderNumber);
    if (r.comment) setComment(prev => prev ? `${prev}\n${r.comment}` : r.comment);
  };

  const resetForm = () => {
    setStartDT(nowISO()); setEndDT(nowISO()); setClientId('studio');
    setOrderNumber(''); setPhotos([]); setCar(''); setComplexId(''); setComplexPrice('');
    setElementCounts({}); setElementPrices({}); setElSearch(''); setOpenSection(null);
    setShare(1); setCustomPercent(''); setManualTotal(''); setComment('');
  };

  const submit = () => {
    if (!car.trim()) { alert('Укажи авто'); return; }
    const payload = {
      startDT, endDT, clientId, orderNumber: orderNumber.trim(), photos, car: car.trim(),
      priceProfileId: client.priceProfileId, complexId: complexId || null, elementCounts,
      complexPrice: selectedComplex ? complexPriceNum : null, elementPrices,
      lines: legacyLines || jobLines({ complexId, complexPrice: complexPriceNum, elementCounts, elementPrices }, profile),
      share, manualTotal: manualTotal !== '' ? parseFloat(manualTotal) : null,
      baseTotal: calcTotal, finalTotal, comment,
    };
    if (isEdit) {
      onUpdate({ ...editJob, ...payload, updatedAt: new Date().toISOString() });
    } else {
      onSave({ ...payload, id: Date.now().toString(), createdAt: new Date().toISOString() });
      resetForm();
    }
  };

  return (
    <div className="p-4 pb-24 space-y-5">
      {showModal && <NewClientModal profiles={profiles} onClose={() => setShowModal(false)} onCreate={createClient} />}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold tracking-tight">
          {isEdit ? 'Редактирование' : 'Новая работа'}
        </h1>
        {isEdit && (
          <button onClick={onCancelEdit}
            className="text-xs text-slate-400 underline">Отмена</button>
        )}
      </div>

      {!isEdit && (
        <VoiceInput apiKey={apiKey} clients={clients} profiles={profiles} customCars={customCars}
          onParsed={applyParsed} onOpenSettings={onOpenSettings} />
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-upper">Начало</label>
          <input type="datetime-local" value={startDT} onChange={e => setStartDT(e.target.value)}
            className="wt-input" />
        </div>
        <div>
          <label className="label-upper">Конец</label>
          <input type="datetime-local" value={endDT} onChange={e => setEndDT(e.target.value)}
            className="wt-input" />
        </div>
      </div>

      <div>
        <label className="label-upper">Заказчик</label>
        <div className="flex gap-2 flex-wrap">
          {clients.map(c => (
            <button key={c.id} onClick={() => handleClientChange(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition
                ${clientId === c.id ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200'}`}>
              {c.name}
            </button>
          ))}
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 border border-dashed border-slate-300">
            <Plus size={16} className="inline -mt-0.5" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Прайс: <span className="font-medium text-slate-600">{profile?.name}</span></p>
      </div>

      <div>
        <label className="label-upper">Заказ-наряд №</label>
        <div className="flex gap-2 relative">
          <input type="text" inputMode="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)}
            placeholder="ЗН-2026-0142"
            className="wt-input flex-1" />
          {photos.length < 5 && (
            <button onClick={() => setShowPhotoMenu(!showPhotoMenu)}
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-400 transition shrink-0">
              <Camera size={20} />
            </button>
          )}
          {showPhotoMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowPhotoMenu(false)} />
              <div className="absolute right-0 top-12 z-20 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden" style={{minWidth: 200}}>
                <button onClick={() => { cameraRef.current?.click(); }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 hover:bg-slate-50 transition">
                  <Camera size={18} className="text-emerald-600" />
                  Камера
                </button>
                <div className="border-t border-slate-100" />
                <button onClick={() => { galleryRef.current?.click(); }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 hover:bg-slate-50 transition">
                  <ImageIcon size={18} className="text-emerald-600" />
                  Выбрать на устройстве
                </button>
              </div>
            </>
          )}
        </div>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
        <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handlePhoto} className="hidden" />

        {photos.length > 0 && (
          <div className="flex gap-2 items-center mt-2 overflow-x-auto">
            {photos.map((src, i) => (
              <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(i)}
                  className="absolute top-0 right-0 w-5 h-5 bg-black/60 text-white flex items-center justify-center rounded-bl-lg"
                  style={{fontSize: 12, lineHeight: 1}}>×</button>
              </div>
            ))}
            <span className="text-xs text-slate-400 shrink-0">{photos.length}/5</span>
          </div>
        )}
      </div>

      <div>
        <label className="label-upper">Авто</label>
        <CarCombobox value={car} onChange={setCar} customCars={customCars} onAddCar={onAddCar} />
      </div>

      <div>
        <label className="label-upper">Комплекс работ</label>
        <select value={complexId} onChange={e => { setComplexId(e.target.value); setComplexPrice(''); }}
          className="wt-input">
          <option value="">— не выбрано —</option>
          {groupBySection(profile?.complex || []).map(g => (
            <optgroup key={g.section} label={g.section}>
              {g.items.map(c => <option key={c.id} value={c.id}>{c.name} — {fmtRange(c)} ₽</option>)}
            </optgroup>
          ))}
        </select>
        {selectedComplex && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-400 flex-1">{selectedComplex.note || (hasRange(selectedComplex) ? `Прайс: ${fmtRange(selectedComplex)} ₽` : 'Цена')}</span>
            <input type="number" value={complexPrice} onChange={e => setComplexPrice(e.target.value)}
              placeholder={String(selectedComplex.price)}
              className="wt-input text-sm font-mono text-right" style={{ width: 110 }} />
          </div>
        )}
      </div>

      <div>
        <div className="label-upper">По элементам</div>

        {legacyLines && (
          <div className="wt-card p-3 mb-2 text-xs text-slate-500">
            <div className="font-semibold text-slate-600 mb-1">Позиции из старого прайса</div>
            {legacyLines.map((l, i) => <div key={i}>{l.name}{l.qty > 1 && ` ×${l.qty}`} — {fmt(l.price * l.qty)}</div>)}
            <div className="mt-1">Выбери позиции заново, если нужно пересчитать</div>
          </div>
        )}

        {Object.keys(elementCounts).length > 0 && (
          <div className="wt-card p-2 mb-2">
            {Object.entries(elementCounts).map(([id, count], i) => {
              const el = profile?.elements.find(e => e.id === id);
              if (!el) return null;
              return (
                <div key={id} className={`flex items-center gap-2 py-2 ${i > 0 ? 'border-t border-dashed border-slate-200' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{itemLabel(el)}</div>
                    {hasRange(el) && <div className="text-xs text-slate-400 font-mono">{fmtRange(el)}</div>}
                  </div>
                  <input type="number" value={elementPrices[id] ?? ''} onChange={e => setElPrice(id, e.target.value)}
                    placeholder={String(el.price)}
                    className="wt-input text-xs font-mono text-right" style={{ width: 76, height: 32 }} />
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => decEl(id)}
                      className="w-7 h-7 rounded-md bg-white border border-emerald-300 text-emerald-700 flex items-center justify-center font-bold">−</button>
                    <span className="font-mono font-bold w-5 text-center text-sm">{count}</span>
                    <button onClick={() => incEl(id)}
                      className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <input value={elSearch} onChange={e => setElSearch(e.target.value)}
          placeholder="Найти позицию…" className="wt-input mb-2" />

        {(() => {
          const q = elSearch.trim().toLowerCase();
          const items = (profile?.elements || []).filter(el =>
            !q || `${el.section || ''} ${el.name}`.toLowerCase().includes(q));
          const row = (el) => {
            const count = elementCounts[el.id] || 0;
            return (
              <button key={el.id} onClick={() => incEl(el.id)}
                className={`w-full flex justify-between items-center gap-2 px-3 py-2 text-left text-xs border-t border-slate-100 first:border-t-0
                  ${count > 0 ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 active:bg-slate-50'}`}>
                <span>{el.name}{count > 0 && ` ×${count}`}</span>
                <span className="font-mono text-slate-400 shrink-0">{fmtRange(el)}</span>
              </button>
            );
          };
          if (q) return (
            <div className="wt-card overflow-hidden">
              {items.length ? items.map(row) : <p className="text-xs text-slate-400 p-3">Ничего не найдено</p>}
            </div>
          );
          return (
            <div className="space-y-1.5">
              {groupBySection(items).map(g => {
                const open = openSection === g.section;
                const picked = g.items.reduce((s, el) => s + (elementCounts[el.id] || 0), 0);
                return (
                  <div key={g.section} className="wt-card overflow-hidden">
                    <button onClick={() => setOpenSection(open ? null : g.section)}
                      className="w-full flex justify-between items-center gap-2 px-3 py-2.5 text-sm font-semibold text-left">
                      <span>{g.section}{picked > 0 && <span className="ml-2 text-xs text-emerald-600">· {picked}</span>}</span>
                      <ChevronDown size={16} className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && <div className="border-t border-slate-100">{g.items.map(row)}</div>}
                  </div>
                );
              })}
            </div>
          );
        })()}
        {elementsSubtotal > 0 && (
          <p className="text-xs text-slate-400 mt-1.5">Итого по элементам: <span className="font-semibold text-slate-900">{fmt(elementsSubtotal)}</span></p>
        )}
      </div>

      <div>
        <div className="label-upper">Моя доля</div>
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
          {SHARE_OPTIONS.map(o => (
            <button key={o.label} onClick={() => handleShareButton(o.value)}
              className={`py-2.5 rounded-lg font-semibold text-sm transition
                ${share === o.value && customPercent === '' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>{o.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Свой %</label>
            <input type="number" value={customPercent}
              onChange={e => handleCustomPercent(e.target.value)}
              placeholder="70"
              className="wt-input text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Сумма вручную</label>
            <input type="number" value={manualTotal}
              onChange={e => setManualTotal(e.target.value)}
              placeholder="—"
              className="wt-input text-sm font-mono" />
          </div>
        </div>
      </div>

      <div>
        <div className="label-upper">Итого</div>
        <div className="summary-card">
          <div className="flex justify-between text-xs">
            <span className="opacity-60">Расчёт ({(share * 100).toFixed(share % 1 === 0 ? 0 : 1)}%)</span>
            <span className="font-bold font-mono">{fmt(calcWithShare)}</span>
          </div>
          {manualTotal !== '' && (
            <div className="flex justify-between text-xs mt-1">
              <span className="opacity-60">Переопределено</span>
              <span className="font-bold font-mono text-yellow-300">{fmt(parseFloat(manualTotal) || 0)}</span>
            </div>
          )}
          <div className="border-t border-white/15 pt-2 mt-2 flex justify-between items-center">
            <span className="font-bold text-sm opacity-80">К выплате</span>
            <span className="text-2xl font-extrabold tracking-tight font-mono">{fmt(finalTotal)}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="label-upper">Комментарий</div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2}
          className="wt-input" style={{minHeight:"56px",resize:"none"}} />
      </div>

      <div className="mt-1">
        <button onClick={submit} className="btn-accent">
          {isEdit ? 'Сохранить изменения' : 'Сохранить работу'}
        </button>
      </div>
    </div>
  );
}

// ============ ЭКРАН 2: Список ============
function JobList({ jobs, clients, profiles, onDelete, onEdit }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [carFilter, setCarFilter] = useState('');
  const [viewPhoto, setViewPhoto] = useState(null); // { photos: [], index: 0 }

  const uniqueCars = useMemo(() => [...new Set(jobs.map(j => j.car))].sort(), [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const d = j.startDT.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (carFilter && j.car !== carFilter) return false;
      return true;
    }).sort((a, b) => b.startDT.localeCompare(a.startDT));
  }, [jobs, from, to, carFilter]);

  const cName = (id) => clients.find(c => c.id === id)?.name || '—';
  const cxName = (j) => j.lines ? j.lines.find(l => l.kind === 'complex')?.name : profiles.find(p => p.id === j.priceProfileId)?.complex.find(c => c.id === j.complexId)?.name;
  const elNames = (j) => {
    if (j.lines) return j.lines.filter(l => l.kind === 'element').map(l => l.qty > 1 ? `${l.name} ×${l.qty}` : l.name);
    const p = profiles.find(pr => pr.id === j.priceProfileId);
    if (j.elementCounts) {
      return Object.entries(j.elementCounts)
        .filter(([, cnt]) => cnt > 0)
        .map(([id, cnt]) => {
          const name = p?.elements.find(e => e.id === id)?.name;
          return name ? (cnt > 1 ? `${name} ×${cnt}` : name) : null;
        }).filter(Boolean);
    }
    return (j.elementIds || []).map(id => p?.elements.find(e => e.id === id)?.name).filter(Boolean);
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-xl font-extrabold tracking-tight">Работы</h1>

      <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs" />
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs" />
        </div>
        <select value={carFilter} onChange={e => setCarFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white">
          <option value="">Все авто</option>
          {uniqueCars.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(from || to || carFilter) && (
          <button onClick={() => { setFrom(''); setTo(''); setCarFilter(''); }}
            className="text-xs text-slate-400 underline">Сбросить</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">Пусто</div>
      ) : (() => {
        const totalSum = filtered.reduce((s, j) => s + j.finalTotal, 0);
        const totalBase = filtered.reduce((s, j) => s + j.baseTotal, 0);
        // Group by date
        const groups = {};
        filtered.forEach(j => {
          const d = j.startDT.slice(0, 10);
          if (!groups[d]) groups[d] = [];
          groups[d].push(j);
        });
        const dateLabel = (d) => {
          const t = new Date().toISOString().slice(0, 10);
          const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const dt = new Date(d);
          const day = dt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
          if (d === t) return `Сегодня · ${day}`;
          if (d === y) return `Вчера · ${day}`;
          return day;
        };
        return (<>
          <div className="bg-slate-100 rounded-2xl p-3 flex justify-between items-center">
            <div>
              <div className="text-xs text-slate-400">Сумма за период</div>
              <div className="text-xl font-extrabold tracking-tight">{fmt(totalSum)}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm">{filtered.length} {filtered.length === 1 ? 'работа' : 'работ'}</div>
              {totalBase !== totalSum && <div className="text-xs text-slate-400">база: {fmt(totalBase)}</div>}
            </div>
          </div>
          {Object.entries(groups).map(([date, dateJobs]) => (
            <div key={date}>
              <div className="label-upper mt-2 mb-1.5">{dateLabel(date)}</div>
              <div className="space-y-2">
                {dateJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-2xl p-3 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-bold text-sm">{job.car}</div>
                          {job.orderNumber && (
                            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono">
                              № {job.orderNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                          {cName(job.clientId)} · {(job.share * 100).toFixed(job.share === 0.333 ? 1 : 0)}%
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => onEdit(job.id)}
                          className="text-slate-400 hover:text-slate-900 p-1"><Pencil size={16} /></button>
                        <button onClick={() => { if (confirm('Удалить?')) onDelete(job.id); }}
                          className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    {cxName(job) && <div className="text-xs text-slate-600">• {cxName(job)}</div>}
                    {elNames(job).length > 0 && <div className="text-xs text-slate-600">• {elNames(job).join(', ')}</div>}
                    {job.comment && <div className="text-xs text-slate-400 italic bg-slate-100 p-2 rounded-lg">{job.comment}</div>}
                    {job.photos?.length > 0 && (
                      <div className="flex gap-1.5 overflow-x-auto py-1">
                        {job.photos.map((src, i) => (
                          <img key={i} src={src} alt="" onClick={() => setViewPhoto({ photos: job.photos, index: i })}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer active:opacity-70" />
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
                      <span className="text-xs text-slate-400 font-mono">{fmtDT(job.startDT)}</span>
                      <div className="text-right">
                        <span className="text-sm font-extrabold">{fmt(job.finalTotal)}</span>
                        {job.finalTotal !== job.baseTotal && (
                          <span className="text-xs text-slate-400 block">база {fmt(job.baseTotal)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>);
      })()}

      {viewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
          onClick={() => setViewPhoto(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-xl font-bold"
            onClick={() => setViewPhoto(null)}>×</button>

          <img src={viewPhoto.photos[viewPhoto.index]} alt=""
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} />

          {viewPhoto.photos.length > 1 && (
            <div className="flex items-center gap-4 mt-4">
              <button onClick={(e) => { e.stopPropagation(); setViewPhoto(v => ({ ...v, index: Math.max(0, v.index - 1) })); }}
                className={`w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-lg font-bold ${viewPhoto.index === 0 ? 'opacity-30' : ''}`}>‹</button>
              <span className="text-white/70 text-sm font-mono">{viewPhoto.index + 1} / {viewPhoto.photos.length}</span>
              <button onClick={(e) => { e.stopPropagation(); setViewPhoto(v => ({ ...v, index: Math.min(v.photos.length - 1, v.index + 1) })); }}
                className={`w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-lg font-bold ${viewPhoto.index === viewPhoto.photos.length - 1 ? 'opacity-30' : ''}`}>›</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============ ЭКРАН 3: Статистика ============
function Stats({ jobs }) {
  const [period, setPeriod] = useState('month');

  const { chartData, totalRevenue, jobsCount, avgCheck, avgPerDay, daysCount } = useMemo(() => {
    const now = new Date();
    let start = new Date();
    let group = 'day';
    if (period === 'day') { start.setDate(now.getDate() - 7); group = 'day'; }
    else if (period === 'week') { start.setDate(now.getDate() - 28); group = 'week'; }
    else if (period === 'month') { start.setMonth(now.getMonth() - 6); group = 'month'; }
    else { start.setFullYear(now.getFullYear() - 3); group = 'year'; }

    const startIso = start.toISOString().slice(0, 10);
    const filtered = jobs.filter(j => j.startDT.slice(0, 10) >= startIso);
    const groups = {};
    const uniqueDays = new Set();
    filtered.forEach(job => {
      const d = new Date(job.startDT);
      uniqueDays.add(job.startDT.slice(0, 10));
      let key;
      if (group === 'day') key = job.startDT.slice(5, 10);
      else if (group === 'week') { const ws = new Date(d); ws.setDate(d.getDate() - d.getDay()); key = ws.toISOString().slice(5, 10); }
      else if (group === 'month') key = job.startDT.slice(0, 7);
      else key = job.startDT.slice(0, 4);
      groups[key] = (groups[key] || 0) + job.finalTotal;
    });
    const chartData = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => ({ name, value: Math.round(value) }));
    const totalRevenue = filtered.reduce((s, j) => s + j.finalTotal, 0);
    const jobsCount = filtered.length;
    const avgCheck = jobsCount ? totalRevenue / jobsCount : 0;
    const daysCount = uniqueDays.size || 1;
    const avgPerDay = totalRevenue / daysCount;
    return { chartData, totalRevenue, jobsCount, avgCheck, avgPerDay, daysCount };
  }, [jobs, period]);

  const periods = [{ key: 'day', label: 'Дни' }, { key: 'week', label: 'Недели' }, { key: 'month', label: 'Месяцы' }, { key: 'year', label: 'Годы' }];

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Статистика</h1>
      <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
        {periods.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={`py-2 rounded-lg text-xs font-semibold transition
              ${period === p.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>{p.label}</button>
        ))}
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200">
        <div className="text-xs text-slate-400">Доход</div>
        <div className="text-3xl font-extrabold tracking-tight">{fmt(totalRevenue)}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Работ</div>
          <div className="text-lg font-extrabold mt-0.5">{jobsCount}</div>
        </div>
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Ср. чек</div>
          <div className="text-lg font-extrabold mt-0.5">{fmt(avgCheck)}</div>
        </div>
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Ср/день</div>
          <div className="text-lg font-extrabold mt-0.5">{fmt(avgPerDay)}</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <div className="font-bold text-sm">Динамика дохода</div>
        </div>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">Нет данных</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} stroke="#94a3b8"
                tickFormatter={v => v >= 1000 ? `${v / 1000}к` : v} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="value" fill="#12a150" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ============ ЭКРАН 4: Прайсы ============
function PriceEditor({ profile, onUpdate, onDelete, canDelete }) {
  const [name, setName] = useState(profile.name);
  useEffect(() => setName(profile.name), [profile.name, profile.id]);

  const updateItem = (type, id, field, value) => {
    const num = (v) => parseFloat(v) || 0;
    const items = profile[type].map(it => {
      if (it.id !== id) return it;
      if (field === 'priceMax') {
        const { priceMax: _, ...rest } = it;
        return value === '' ? rest : { ...rest, priceMax: num(value) };
      }
      return { ...it, [field]: field === 'price' ? num(value) : value };
    });
    onUpdate({ ...profile, [type]: items });
  };
  const addItem = (type) => {
    const last = profile[type][profile[type].length - 1];
    const newItem = { id: `${type[0]}${Date.now()}`, name: 'Новая позиция', price: 0, ...(last?.section && { section: last.section }) };
    onUpdate({ ...profile, [type]: [...profile[type], newItem] });
  };
  const removeItem = (type, id) => onUpdate({ ...profile, [type]: profile[type].filter(it => it.id !== id) });
  const saveName = () => onUpdate({ ...profile, name: name.trim() || profile.name });

  const bulkAdjust = (pct) => {
    const f = (v) => Math.round(v * (1 + pct / 100));
    const adj = (items) => items.map(it => ({ ...it, price: f(it.price), ...(it.priceMax && { priceMax: f(it.priceMax) }) }));
    onUpdate({ ...profile, complex: adj(profile.complex), elements: adj(profile.elements) });
  };
  const bulkRound = () => {
    const f = (v) => Math.round(v / 500) * 500;
    const rnd = (items) => items.map(it => ({ ...it, price: f(it.price), ...(it.priceMax && { priceMax: f(it.priceMax) }) }));
    onUpdate({ ...profile, complex: rnd(profile.complex), elements: rnd(profile.elements) });
  };

  const renderList = (type, label) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold">{label}</h4>
        <button onClick={() => addItem(type)} className="text-xs text-emerald-600 font-bold flex items-center gap-1">
          <Plus size={14} /> добавить
        </button>
      </div>
      {groupBySection(profile[type]).map(g => (
        <div key={g.section}>
          {g.section !== 'Без раздела' && <div className="text-xs font-semibold text-slate-500 mt-2 mb-1">{g.section}</div>}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 space-y-0">
            {g.items.map((it, i) => (
              <div key={it.id} className={`flex gap-1.5 items-center py-2 ${i < g.items.length - 1 ? 'border-b border-dashed border-slate-200' : ''}`}>
                <input value={it.name} onChange={e => updateItem(type, it.id, 'name', e.target.value)}
                  className="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold" />
                <input type="number" value={it.price} onChange={e => updateItem(type, it.id, 'price', e.target.value)}
                  className="w-16 px-1.5 py-1.5 rounded-lg border border-slate-200 text-xs text-right font-mono font-semibold focus:outline-emerald-100 focus:border-emerald-500" />
                <input type="number" value={it.priceMax || ''} placeholder="до" onChange={e => updateItem(type, it.id, 'priceMax', e.target.value)}
                  className="w-16 px-1.5 py-1.5 rounded-lg border border-slate-200 text-xs text-right font-mono focus:outline-emerald-100 focus:border-emerald-500" />
                <button onClick={() => removeItem(type, it.id)} className="text-slate-400 hover:text-red-500 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input value={name} onChange={e => setName(e.target.value)} onBlur={saveName}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold" />
        {canDelete && (
          <button onClick={() => { if (confirm(`Удалить "${profile.name}"?`)) onDelete(profile.id); }}
            className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
        )}
      </div>

      <div>
        <div className="font-bold text-sm mb-2">Массовая корректировка</div>
        <div className="flex gap-1.5 flex-wrap">
          {[-10, -5, 5, 10].map(p => (
            <button key={p} onClick={() => bulkAdjust(p)}
              className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold">
              {p > 0 ? '+' : ''}{p}%
            </button>
          ))}
          <button onClick={bulkRound}
            className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold">
            округлить
          </button>
        </div>
      </div>

      {renderList('complex', 'Комплекс работ')}
      {renderList('elements', 'По элементам')}
    </div>
  );
}

function DataSettings({ onImport, onExport }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setMsg(onImport(JSON.parse(await file.text())) || '');
    } catch (err) {
      console.error(err);
      setMsg('Не удалось прочитать файл');
    }
  };

  return (
    <div className="wt-card p-3 space-y-2">
      <div className="label-upper">Данные</div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => fileRef.current?.click()}
          className="h-10 rounded-xl border border-slate-200 bg-white text-xs font-bold">Импорт из файла</button>
        <button onClick={onExport}
          className="h-10 rounded-xl border border-slate-200 bg-white text-xs font-bold">Резервная копия</button>
      </div>
      <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleFile} className="hidden" />
      <p className="text-xs text-slate-400">Импорт принимает файл прайса или резервную копию. Всё хранится только на этом устройстве — сохраняй копию перед сменой телефона или очисткой браузера.</p>
      {msg && <p className="text-xs text-emerald-700">{msg}</p>}
    </div>
  );
}

function ApiKeySettings({ apiKey, onChange }) {
  const [draft, setDraft] = useState(apiKey);
  const dirty = draft.trim() !== apiKey;
  return (
    <div className="wt-card p-3 space-y-2">
      <div className="label-upper">Голосовой ввод · API-ключ Claude</div>
      <input type="password" autoComplete="off" value={draft} onChange={e => setDraft(e.target.value)}
        placeholder="sk-ant-…" className="wt-input font-mono" />
      <p className="text-xs text-slate-400">Ключ хранится только на этом устройстве. Создать: console.anthropic.com → API Keys</p>
      {dirty && (
        <button onClick={() => onChange(draft.trim())} className="btn-accent">Сохранить ключ</button>
      )}
    </div>
  );
}

function SettingsScreen({ profiles, clients, onUpdateProfile, onDeleteProfile, onDeleteClient, apiKey, onApiKeyChange, onImport, onExport }) {
  const [expanded, setExpanded] = useState(profiles[0]?.id);

  const getClientForProfile = (profileId) => clients.find(c => c.priceProfileId === profileId);

  return (
    <div className="p-4 pb-24 space-y-4 animate-in">
      <h1 className="text-xl font-extrabold tracking-tight">Прайсы</h1>

      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {profiles.map(p => (
          <button key={p.id} onClick={() => setExpanded(p.id)}
            className={`shrink-0 px-3 py-2 rounded-full text-xs font-semibold border transition
              ${expanded === p.id ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200'}`}>
            {p.name}
          </button>
        ))}
      </div>

      {profiles.filter(p => p.id === expanded).map(p => {
        const isBase = p.id === 'studio' || p.id === 'dealer';
        const linkedClient = getClientForProfile(p.id);
        return (
          <div key={p.id} className="space-y-3">
            {/* Связанный заказчик */}
            {linkedClient && (
              <div className="wt-card p-3 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Заказчик</div>
                  <div className="font-bold text-sm mt-0.5">{linkedClient.name}</div>
                </div>
                {!linkedClient.isDefault && (
                  <button onClick={() => {
                    if (confirm(`Удалить заказчика «${linkedClient.name}» и его прайс?`)) {
                      onDeleteClient(linkedClient.id);
                    }
                  }} className="btn-danger-ghost text-xs">
                    Удалить заказчика
                  </button>
                )}
              </div>
            )}

            <PriceEditor profile={p} onUpdate={onUpdateProfile} onDelete={onDeleteProfile} canDelete={!isBase} />

            {isBase && (
              <p className="text-xs text-slate-400 text-center">Базовый прайс — удалить нельзя, но можно редактировать</p>
            )}
          </div>
        );
      })}

      <DataSettings onImport={onImport} onExport={onExport} />
      <ApiKeySettings apiKey={apiKey} onChange={onApiKeyChange} />
    </div>
  );
}

// ============ ROOT ============
export default function App() {
  const [tab, setTab] = useState('new');
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobs, setJobs] = useState(() => load(KEYS.JOBS, []));
  const [clients, setClients] = useState(() => load(KEYS.CLIENTS, DEFAULT_CLIENTS));
  const [profiles, setProfiles] = useState(() => load(KEYS.PROFILES, [STUDIO_PRICE, DEALER_PRICE]));
  const [customCars, setCustomCars] = useState(() => load(KEYS.CUSTOM_CARS, []));
  const [apiKey, setApiKey] = useState(() => load(KEYS.API_KEY, ''));

  // Автопрокрутка к активному полю при открытии клавиатуры
  useEffect(() => {
    const isInput = (el) => el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);

    const scrollToField = (el) => {
      if (!el) return;
      const vv = window.visualViewport;
      const visibleHeight = vv ? vv.height : window.innerHeight;
      const rect = el.getBoundingClientRect();
      const targetY = rect.top + rect.height / 2;
      const desiredY = visibleHeight / 2;
      const delta = targetY - desiredY;
      if (Math.abs(delta) > 20) {
        window.scrollBy({ top: delta, behavior: 'smooth' });
      }
    };

    const onFocusIn = (e) => {
      if (!isInput(e.target)) return;
      // Ждём анимацию клавиатуры/viewport
      setTimeout(() => scrollToField(e.target), 300);
    };

    // Когда viewport меняется (клавиатура уже появилась) — подправляем позицию
    const onViewportResize = () => {
      const active = document.activeElement;
      if (isInput(active)) scrollToField(active);
    };

    document.addEventListener('focusin', onFocusIn);
    window.visualViewport?.addEventListener('resize', onViewportResize);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      window.visualViewport?.removeEventListener('resize', onViewportResize);
    };
  }, []);

  const addJob = (job) => { const n = [...jobs, job]; setJobs(n); save(KEYS.JOBS, n); setTab('list'); };
  const deleteJob = (id) => {
    const n = jobs.filter(j => j.id !== id);
    setJobs(n); save(KEYS.JOBS, n);
    if (editingJobId === id) setEditingJobId(null);
  };
  const updateJob = (job) => {
    const n = jobs.map(j => j.id === job.id ? job : j);
    setJobs(n); save(KEYS.JOBS, n);
    setEditingJobId(null);
    setTab('list');
  };
  const startEdit = (id) => { setEditingJobId(id); setTab('new'); };
  const cancelEdit = () => { setEditingJobId(null); setTab('list'); };

  const editingJob = editingJobId ? jobs.find(j => j.id === editingJobId) : null;

  const addClient = (name, baseId) => {
    const base = profiles.find(p => p.id === baseId) || profiles[0];
    const newProfileId = `profile_${Date.now()}`;
    const newProfile = { ...base, id: newProfileId, name: `Прайс: ${name}` };
    const newClient = { id: `client_${Date.now()}`, name, priceProfileId: newProfileId };
    const np = [...profiles, newProfile];
    const nc = [...clients, newClient];
    setProfiles(np); setClients(nc);
    save(KEYS.PROFILES, np); save(KEYS.CLIENTS, nc);
    return newClient;
  };

  const updateProfile = (next) => { const np = profiles.map(p => p.id === next.id ? next : p); setProfiles(np); save(KEYS.PROFILES, np); };

  const deleteProfile = (id) => {
    const np = profiles.filter(p => p.id !== id);
    const nc = clients.filter(c => c.priceProfileId !== id);
    setProfiles(np); setClients(nc);
    save(KEYS.PROFILES, np); save(KEYS.CLIENTS, nc);
  };

  const deleteClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const nc = clients.filter(c => c.id !== clientId);
    const np = profiles.filter(p => p.id !== client.priceProfileId);
    setClients(nc); setProfiles(np);
    save(KEYS.CLIENTS, nc); save(KEYS.PROFILES, np);
  };

  const addCustomCar = (name) => {
    if (customCars.includes(name)) return;
    const nc = [...customCars, name];
    setCustomCars(nc);
    save(KEYS.CUSTOM_CARS, nc);
  };

  const updateApiKey = (k) => { setApiKey(k); save(KEYS.API_KEY, k); };

  const importData = (data) => {
    if (data?.type === 'wrap-tracker-backup') {
      if (!Array.isArray(data.jobs) || !Array.isArray(data.profiles) || !Array.isArray(data.clients)) return 'Файл повреждён';
      if (!confirm(`Заменить все данные копией: ${data.jobs.length} работ, ${data.profiles.length} прайсов?`)) return '';
      setJobs(data.jobs); setClients(data.clients); setProfiles(data.profiles); setCustomCars(data.customCars || []);
      save(KEYS.JOBS, data.jobs); save(KEYS.CLIENTS, data.clients); save(KEYS.PROFILES, data.profiles); save(KEYS.CUSTOM_CARS, data.customCars || []);
      return 'Копия восстановлена';
    }
    if (data?.type !== 'wrap-tracker-prices' || !Array.isArray(data.profiles)) return 'Это не файл прайса и не резервная копия';
    const incoming = data.profiles.filter(p => p.id && p.name && Array.isArray(p.complex) && Array.isArray(p.elements));
    const summary = incoming.map(p => `${p.name}: ${p.complex.length + p.elements.length} поз.`).join(', ');
    if (!confirm(`Заменить прайсы? ${summary}`)) return '';

    // Старые работы ссылаются на id старого прайса — сохраняем им расшифровку до замены
    const nj = jobs.map(j => j.lines ? j : { ...j, lines: jobLines(j, profiles.find(p => p.id === j.priceProfileId)) });
    let np = [...profiles], nc = [...clients];
    for (const p of incoming) {
      if (np.some(x => x.id === p.id)) {
        np = np.map(x => x.id === p.id ? { ...x, complex: p.complex, elements: p.elements } : x);
      } else {
        np.push(p);
        if (!nc.some(c => c.priceProfileId === p.id)) nc.push({ id: `client_${p.id}`, name: p.name, priceProfileId: p.id });
      }
    }
    setJobs(nj); setProfiles(np); setClients(nc);
    save(KEYS.JOBS, nj); save(KEYS.PROFILES, np); save(KEYS.CLIENTS, nc);
    return `Прайсы обновлены: ${summary}`;
  };

  const exportBackup = async () => {
    const data = { type: 'wrap-tracker-backup', version: 1, exportedAt: new Date().toISOString(), jobs, clients, profiles, customCars };
    const name = `wrap-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File([JSON.stringify(data)], name, { type: 'application/json' });
    // На телефоне удобнее системное «Поделиться» (Файлы, Telegram), на компьютере — обычная загрузка
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file] }); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const tabs = [
    { key: 'new', icon: Plus, label: 'Новая' },
    { key: 'list', icon: List, label: 'Работы' },
    { key: 'stats', icon: BarChart3, label: 'Стат.' },
    { key: 'settings', icon: Settings, label: 'Прайсы' },
  ];

  return (
    <>
    <style>{`
      :root {
        --bg: #eef1f5; --panel: #fff; --ink: #0f172a; --ink-2: #475569; --ink-3: #94a3b8;
        --line: #e2e8f0; --line-2: #cbd5e1; --soft: #f1f5f9;
        --accent: #12a150; --accent-soft: #dcf5e6; --accent-dark: #0b6b35;
        --danger: #ef4444; --danger-soft: #fef2f2;
        --radius: 17px;
        --shadow-card: 0 1px 3px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04);
        --shadow-lg: 0 10px 25px -8px rgba(15,23,42,.15);
      }
      body { background: var(--bg); font-family: 'Manrope', system-ui, sans-serif; -webkit-font-smoothing: antialiased; color: var(--ink); }
      .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      .label-upper { font-size: 10px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; }
      .wt-input {
        height: 40px; background: #fff; border: 1px solid var(--line); border-radius: 12px;
        padding: 0 12px; font-size: 13px; color: var(--ink); width: 100%;
        transition: border-color .15s, box-shadow .15s;
      }
      .wt-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
      .wt-input::placeholder { color: var(--ink-3); }
      select.wt-input {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px;
      }
      .wt-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow-card); }
      .summary-card {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #fff; border-radius: var(--radius); padding: 14px;
        box-shadow: 0 8px 24px -8px rgba(15,23,42,.35);
      }
      .btn-accent {
        background: linear-gradient(135deg, #12a150 0%, #0d8a43 100%);
        color: #fff; border: none; border-radius: var(--radius);
        font-weight: 700; font-size: 14px; padding: 14px 0; width: 100%; cursor: pointer;
        transition: transform .1s, box-shadow .15s;
        box-shadow: 0 4px 12px -4px rgba(18,161,80,.4);
      }
      .btn-accent:active { transform: scale(0.98); }
      .btn-danger-ghost {
        background: transparent; border: 1px solid var(--danger); color: var(--danger);
        border-radius: 10px; font-weight: 600; font-size: 12px; padding: 6px 12px; cursor: pointer;
      }
      .btn-danger-ghost:active { background: var(--danger-soft); }
      .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      input[type="number"] { -moz-appearance: textfield; }
      @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      .animate-in { animation: slideUp .25s ease-out; }
    `}</style>
    <div className="min-h-screen bg-slate-100 max-w-md mx-auto relative">
      {tab === 'new' && (
        <JobForm key={editingJob?.id || 'new'}
          clients={clients} profiles={profiles}
          editJob={editingJob}
          onSave={addJob} onUpdate={updateJob} onCancelEdit={cancelEdit}
          onAddClient={addClient}
          customCars={customCars} onAddCar={addCustomCar}
          apiKey={apiKey} onOpenSettings={() => setTab('settings')} />
      )}
      {tab === 'list' && <JobList jobs={jobs} clients={clients} profiles={profiles}
        onDelete={deleteJob} onEdit={startEdit} />}
      {tab === 'stats' && <Stats jobs={jobs} />}
      {tab === 'settings' && <SettingsScreen profiles={profiles} clients={clients}
        onUpdateProfile={updateProfile} onDeleteProfile={deleteProfile}
        onDeleteClient={deleteClient}
        apiKey={apiKey} onApiKeyChange={updateApiKey}
        onImport={importData} onExport={exportBackup} />}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 max-w-md mx-auto safe-bottom">
        <div className="grid grid-cols-4">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => {
                if (editingJobId) setEditingJobId(null);
                setTab(t.key);
              }}
                className={`py-3 flex flex-col items-center gap-1 transition ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Icon size={20} />
                <span className="font-semibold" style={{fontSize:10}}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
    </>
  );
}
