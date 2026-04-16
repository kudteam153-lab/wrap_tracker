import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, List, BarChart3, Settings, Trash2, Calendar, User, X, ChevronDown, Pencil } from 'lucide-react';
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
const KEYS = { JOBS: 'jobs_v2', CLIENTS: 'clients_v2', PROFILES: 'profiles_v2' };

const load = (k, fb) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.error(e); } };

const fmt = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n || 0)) + ' ₽';
const nowISO = () => { const d = new Date(); d.setSeconds(0, 0); return d.toISOString().slice(0, 16); };
const fmtDT = (iso) => { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }); };

// ============ Combobox авто ============
function CarCombobox({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => setQuery(value || ''), [value]);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FLAT_CARS.slice(0, 50);
    return FLAT_CARS.filter(c => c.toLowerCase().includes(q)).slice(0, 50);
  }, [query]);

  const pick = (c) => { setQuery(c); onChange(c); setOpen(false); };

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2">
        <input value={query} onFocus={() => setOpen(true)}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          placeholder="Начни вводить марку..."
          className="flex-1 px-3 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm" />
        <button onClick={() => setOpen(!open)} className="px-3 bg-slate-100 rounded-xl text-slate-600"><ChevronDown size={18} /></button>
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map(c => (
            <button key={c} onClick={() => pick(c)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b border-slate-50 last:border-0">{c}</button>
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
          <label className="text-xs text-slate-500 mb-1 block">Название</label>
          <input value={name} onChange={e => setName(e.target.value)} autoFocus placeholder="Например, Иван"
            className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Прайс на основе</label>
          <select value={baseId} onChange={e => setBaseId(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm">
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
function JobForm({ clients, profiles, editJob, onSave, onUpdate, onCancelEdit, onAddClient }) {
  const isEdit = !!editJob;

  const [startDT, setStartDT] = useState(editJob?.startDT || nowISO());
  const [endDT, setEndDT] = useState(editJob?.endDT || nowISO());
  const [clientId, setClientId] = useState(editJob?.clientId || 'studio');
  const [orderNumber, setOrderNumber] = useState(editJob?.orderNumber || '');
  const [car, setCar] = useState(editJob?.car || '');
  const [complexId, setComplexId] = useState(editJob?.complexId || '');
  const [elementIds, setElementIds] = useState(editJob?.elementIds || []);
  const [share, setShare] = useState(editJob?.share ?? 1);
  // Если в исходной записи цена ставилась вручную (не совпадает с расчётом по позициям) — подставим её
  const initialManual = useMemo(() => {
    if (!editJob) return '';
    const p = profiles.find(pr => pr.id === editJob.priceProfileId);
    const cp = p?.complex.find(c => c.id === editJob.complexId)?.price || 0;
    const ep = (editJob.elementIds || []).reduce((s, id) => s + (p?.elements.find(e => e.id === id)?.price || 0), 0);
    const calc = cp + ep;
    return Math.round(calc) !== Math.round(editJob.baseTotal) ? String(editJob.baseTotal) : '';
  }, [editJob, profiles]);
  const [manualTotal, setManualTotal] = useState(initialManual);
  const [comment, setComment] = useState(editJob?.comment || '');
  const [showModal, setShowModal] = useState(false);

  const client = clients.find(c => c.id === clientId);
  const profile = profiles.find(p => p.id === client?.priceProfileId) || profiles[0];

  // Сброс выбранных позиций при смене клиента — только в режиме создания.
  // В режиме редактирования смена клиента так же сбрасывает (профиль другой → старые id невалидны).
  const handleClientChange = (newId) => {
    if (newId === clientId) return;
    setClientId(newId);
    setComplexId('');
    setElementIds([]);
  };

  const baseTotal = useMemo(() => {
    if (manualTotal !== '') return parseFloat(manualTotal) || 0;
    const cp = profile?.complex.find(c => c.id === complexId)?.price || 0;
    const ep = elementIds.reduce((s, id) => s + (profile?.elements.find(e => e.id === id)?.price || 0), 0);
    return cp + ep;
  }, [complexId, elementIds, manualTotal, profile]);

  const finalTotal = baseTotal * share;
  const toggleEl = (id) => setElementIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const createClient = (name, baseId) => { const c = onAddClient(name, baseId); setClientId(c.id); setShowModal(false); };

  const resetForm = () => {
    setStartDT(nowISO()); setEndDT(nowISO()); setClientId('studio');
    setOrderNumber(''); setCar(''); setComplexId(''); setElementIds([]);
    setShare(1); setManualTotal(''); setComment('');
  };

  const submit = () => {
    if (!car.trim()) { alert('Укажи авто'); return; }
    const payload = {
      startDT, endDT, clientId, orderNumber: orderNumber.trim(), car: car.trim(),
      priceProfileId: client.priceProfileId, complexId: complexId || null, elementIds,
      share, baseTotal, finalTotal, comment,
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
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? 'Редактирование' : 'Новая работа'}
        </h1>
        {isEdit && (
          <button onClick={onCancelEdit}
            className="text-xs text-slate-500 underline">Отмена</button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Начало</label>
          <input type="datetime-local" value={startDT} onChange={e => setStartDT(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Конец</label>
          <input type="datetime-local" value={endDT} onChange={e => setEndDT(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Заказчик</label>
        <div className="flex gap-2 flex-wrap">
          {clients.map(c => (
            <button key={c.id} onClick={() => handleClientChange(c.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition
                ${clientId === c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}>
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
        <label className="text-xs font-medium text-slate-500 mb-1 block">Заказ-наряд №</label>
        <input type="text" inputMode="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)}
          placeholder="Например, ЗН-2026-0142"
          className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm" />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Авто</label>
        <CarCombobox value={car} onChange={setCar} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Комплекс работ</label>
        <select value={complexId} onChange={e => setComplexId(e.target.value)}
          className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm">
          <option value="">— не выбрано —</option>
          {profile?.complex.map(c => <option key={c.id} value={c.id}>{c.name} — {fmt(c.price)}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">По элементам</label>
        <div className="flex flex-wrap gap-2">
          {profile?.elements.map(el => {
            const active = elementIds.includes(el.id);
            return (
              <button key={el.id} onClick={() => toggleEl(el.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition
                  ${active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}>
                {el.name} · {fmt(el.price)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Моя доля</label>
        <div className="grid grid-cols-3 gap-2">
          {SHARE_OPTIONS.map(o => (
            <button key={o.label} onClick={() => setShare(o.value)}
              className={`py-3 rounded-xl font-semibold text-sm transition
                ${share === o.value ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>{o.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">
          Сумма вручную <span className="text-slate-400">(перекрывает расчёт)</span>
        </label>
        <input type="number" value={manualTotal} onChange={e => setManualTotal(e.target.value)} placeholder="45000"
          className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm" />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Комментарий</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2}
          className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm resize-none" />
      </div>

      <div className="bg-slate-900 text-white p-4 rounded-2xl">
        <div className="flex justify-between text-sm opacity-70"><span>База</span><span>{fmt(baseTotal)}</span></div>
        <div className="flex justify-between text-sm opacity-70 mt-1">
          <span>Доля</span><span>{(share * 100).toFixed(share === 0.333 ? 1 : 0)}%</span>
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
          <span className="text-sm font-medium">Итого</span>
          <span className="text-2xl font-bold">{fmt(finalTotal)}</span>
        </div>
      </div>

      <button onClick={submit}
        className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-2xl active:bg-emerald-700">
        {isEdit ? 'Сохранить изменения' : 'Сохранить работу'}
      </button>
    </div>
  );
}

// ============ ЭКРАН 2: Список ============
function JobList({ jobs, clients, profiles, onDelete, onEdit }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [carFilter, setCarFilter] = useState('');

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
  const cxName = (j) => profiles.find(p => p.id === j.priceProfileId)?.complex.find(c => c.id === j.complexId)?.name;
  const elNames = (j) => {
    const p = profiles.find(pr => pr.id === j.priceProfileId);
    return j.elementIds.map(id => p?.elements.find(e => e.id === id)?.name).filter(Boolean);
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Работы</h1>

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
            className="text-xs text-slate-500 underline">Сбросить</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">Пусто</div>
      ) : filtered.map(job => (
        <div key={job.id} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-semibold text-slate-900">{job.car}</div>
                {job.orderNumber && (
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    № {job.orderNumber}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <User size={12} /> {cName(job.clientId)}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => onEdit(job.id)}
                className="text-slate-300 hover:text-slate-700 p-1"><Pencil size={16} /></button>
              <button onClick={() => { if (confirm('Удалить?')) onDelete(job.id); }}
                className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar size={12} /> {fmtDT(job.startDT)} → {fmtDT(job.endDT)}
          </div>
          {cxName(job) && <div className="text-sm text-slate-700">• {cxName(job)}</div>}
          {elNames(job).length > 0 && <div className="text-sm text-slate-700">• {elNames(job).join(', ')}</div>}
          {job.comment && <div className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg">{job.comment}</div>}
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              База {fmt(job.baseTotal)} · {(job.share * 100).toFixed(job.share === 0.333 ? 1 : 0)}%
            </span>
            <span className="text-lg font-bold text-slate-900">{fmt(job.finalTotal)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ ЭКРАН 3: Статистика ============
function Stats({ jobs }) {
  const [period, setPeriod] = useState('month');

  const { chartData, totalRevenue, jobsCount, avgCheck } = useMemo(() => {
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
    filtered.forEach(job => {
      const d = new Date(job.startDT);
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
    return { chartData, totalRevenue, jobsCount, avgCheck };
  }, [jobs, period]);

  const periods = [{ key: 'day', label: 'Дни' }, { key: 'week', label: 'Недели' }, { key: 'month', label: 'Месяцы' }, { key: 'year', label: 'Годы' }];

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Статистика</h1>
      <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
        {periods.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={`py-2 rounded-lg text-xs font-medium transition
              ${period === p.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{p.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <div className="text-[10px] text-slate-500 uppercase">Доход</div>
          <div className="text-base font-bold mt-1">{fmt(totalRevenue)}</div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <div className="text-[10px] text-slate-500 uppercase">Работ</div>
          <div className="text-base font-bold mt-1">{jobsCount}</div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <div className="text-[10px] text-slate-500 uppercase">Ср. чек</div>
          <div className="text-base font-bold mt-1">{fmt(avgCheck)}</div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200">
        <div className="text-xs font-medium text-slate-500 mb-3">Динамика дохода</div>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">Нет данных</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8"
                tickFormatter={v => v >= 1000 ? `${v / 1000}к` : v} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
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
    const items = profile[type].map(it => it.id === id ? { ...it, [field]: field === 'price' ? (parseFloat(value) || 0) : value } : it);
    onUpdate({ ...profile, [type]: items });
  };
  const addItem = (type) => {
    const newItem = { id: `${type[0]}${Date.now()}`, name: 'Новая позиция', price: 0 };
    onUpdate({ ...profile, [type]: [...profile[type], newItem] });
  };
  const removeItem = (type, id) => onUpdate({ ...profile, [type]: profile[type].filter(it => it.id !== id) });
  const saveName = () => onUpdate({ ...profile, name: name.trim() || profile.name });

  const renderList = (type, label) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
        <button onClick={() => addItem(type)} className="text-xs text-emerald-600 font-medium flex items-center gap-1">
          <Plus size={14} /> Добавить
        </button>
      </div>
      {profile[type].map(it => (
        <div key={it.id} className="flex gap-2 items-center">
          <input value={it.name} onChange={e => updateItem(type, it.id, 'name', e.target.value)}
            className="flex-1 px-2.5 py-2 rounded-lg border border-slate-200 text-xs" />
          <input type="number" value={it.price} onChange={e => updateItem(type, it.id, 'price', e.target.value)}
            className="w-24 px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-right" />
          <button onClick={() => removeItem(type, it.id)} className="text-slate-300 hover:text-red-500 p-1">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4">
      <div className="flex gap-2 items-center">
        <input value={name} onChange={e => setName(e.target.value)} onBlur={saveName}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold" />
        {canDelete && (
          <button onClick={() => { if (confirm(`Удалить "${profile.name}"?`)) onDelete(profile.id); }}
            className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
        )}
      </div>
      {renderList('complex', 'Комплекс работ')}
      {renderList('elements', 'По элементам')}
    </div>
  );
}

function SettingsScreen({ profiles, clients, onUpdateProfile, onDeleteProfile }) {
  const [expanded, setExpanded] = useState(profiles[0]?.id);

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Прайсы</h1>
      <p className="text-xs text-slate-500">У каждого заказчика свой прайс-профиль. «Студия» и «Дилер» — базовые, новые создаются при добавлении клиента через «+».</p>

      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {profiles.map(p => (
          <button key={p.id} onClick={() => setExpanded(p.id)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium border
              ${expanded === p.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}>
            {p.name}
          </button>
        ))}
      </div>

      {profiles.filter(p => p.id === expanded).map(p => {
        const used = clients.some(c => c.priceProfileId === p.id);
        const isBase = p.id === 'studio' || p.id === 'dealer';
        return (
          <div key={p.id} className="space-y-2">
            <PriceEditor profile={p} onUpdate={onUpdateProfile} onDelete={onDeleteProfile} canDelete={!isBase && !used} />
            {used && !isBase && (
              <p className="text-[11px] text-amber-600">Прайс привязан к заказчику — сначала удалите клиента</p>
            )}
          </div>
        );
      })}
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

  const tabs = [
    { key: 'new', icon: Plus, label: 'Новая' },
    { key: 'list', icon: List, label: 'Работы' },
    { key: 'stats', icon: BarChart3, label: 'Стат.' },
    { key: 'settings', icon: Settings, label: 'Прайсы' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative">
      {tab === 'new' && (
        <JobForm key={editingJob?.id || 'new'}
          clients={clients} profiles={profiles}
          editJob={editingJob}
          onSave={addJob} onUpdate={updateJob} onCancelEdit={cancelEdit}
          onAddClient={addClient} />
      )}
      {tab === 'list' && <JobList jobs={jobs} clients={clients} profiles={profiles}
        onDelete={deleteJob} onEdit={startEdit} />}
      {tab === 'stats' && <Stats jobs={jobs} />}
      {tab === 'settings' && <SettingsScreen profiles={profiles} clients={clients}
        onUpdateProfile={updateProfile} onDeleteProfile={deleteProfile} />}

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
                className={`py-3 flex flex-col items-center gap-1 transition ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                <Icon size={20} />
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
