# Wrap Tracker

PWA для учёта работ по оклейке авто. Стек: React 18 + Vite 5 + Tailwind 3 + vite-plugin-pwa. Данные в localStorage.

## Фичи

- 3 экрана + настройки: новая работа, список с фильтрами, статистика-дашборд, редактор прайсов
- Два дефолтных заказчика (Студия, Дилер) с раздельными прайсами, неограниченное число кастомных
- Каталог ~300 марок/моделей авто с поиском по подстроке
- Дата+время начала/конца, доля 100/50/33.3% или ручная сумма
- Автопрокрутка к полю при открытии клавиатуры (visualViewport API)
- Устанавливается на домашний экран iOS/Android как нативное приложение

## Локальный запуск

```bash
npm install
npm run dev
```

Открыть http://localhost:5173

## Деплой на GitHub Pages (автоматический)

1. Создать пустой репозиторий на GitHub (без README/gitignore, любое имя, например `wrap-tracker`).

2. Привязать и запушить:
   ```bash
   git remote add origin git@github.com:USERNAME/REPO.git
   git branch -M main
   git push -u origin main
   ```

3. В настройках репозитория: **Settings → Pages → Source: GitHub Actions**.

4. Workflow запустится автоматически на push. Через ~1 минуту сайт доступен по адресу `https://USERNAME.github.io/REPO/`.

`base` для Vite берётся из имени репозитория автоматически (переменная `VITE_BASE` в workflow).

## Деплой на Vercel (ещё проще)

```bash
npm i -g vercel
vercel
```

Отвечаешь на вопросы, получаешь https-адрес. `base` остаётся `/`, работает из коробки.

## Установка на телефон

- **iOS**: открыть сайт в Safari → кнопка «Поделиться» → «На экран Домой».
- **Android**: открыть в Chrome → меню (три точки) → «Установить приложение» (или «Добавить на главный экран»).

Приложение запускается без адресной строки, поддерживает offline (service worker кеширует ассеты).

## Структура

```
src/
  App.jsx       — вся логика и компоненты экранов
  main.jsx      — точка входа
  index.css     — Tailwind + глобальные стили
public/
  icon-192.png, icon-512.png, apple-touch-icon.png, favicon.svg
.github/workflows/deploy.yml — автодеплой на GitHub Pages
vite.config.js  — конфиг Vite + PWA-манифест
```

## Данные

Всё в `localStorage` ключи `jobs_v2`, `clients_v2`, `profiles_v2`. Для сброса — очистить хранилище сайта в настройках браузера.
