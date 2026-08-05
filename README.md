# Banki.shop

Адаптивная витрина интернет-магазина по [макету Figma](https://www.figma.com/file/6LxPDEsauEGanhR2nDW68X/Banki.shop?node-id=0%3A1). Приложение написано на Vue 2.7 (Options API), собирается Webpack 5 и совместимо с требуемым Node.js 16.

## Функциональность

- живой поиск по названиям, без перезагрузки;
- состояния покупки «Купить» → «Обрабатывается» → «В корзине» с задержкой 2 секунды;
- версионированное хранение корзины в `localStorage` с валидацией и миграцией предыдущего формата;
- модальная карточка с описанием, ценой и галереей;
- клавиатурная навигация в модальном окне: `Escape`, `Tab`, `Shift+Tab`, `←`, `→`;
- адаптивная сетка и мобильный интерфейс до 360 px;
- fallback-состояния для недоступных изображений и `aria-live`-уведомления.

## Требования

Рекомендуемое и проверенное окружение:

- Node.js `16.20.2`;
- npm `8.19.4`.

Версия Node закреплена в `.nvmrc`, а npm — в `packageManager`.

## Запуск

```bash
nvm use
npm ci
npm run dev
```

Приложение будет доступно по адресу [http://localhost:8080](http://localhost:8080). Webpack Dev Server пересобирает проект при изменении исходников.

### Почему `npm ci`, а не `npm install`

`npm ci` ставит точно те версии, которые записаны в `package-lock.json`, и не изменяет lock-файл. Это даёт одинаковую сборку у ревьюера и в CI. `npm install` нужен разработчику, когда он добавляет или обновляет зависимости.

## Команды

| Команда                 | Назначение                                     |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | локальная разработка с hot reload              |
| `npm run build`         | production-сборка в `dist/`                    |
| `npm run lint`          | проверка ESLint для JavaScript и Vue SFC       |
| `npm run format:check`  | проверка формата Prettier                      |
| `npm test`              | модульные и компонентные тесты Jest            |
| `npm run test:coverage` | тесты с отчётом покрытия                       |
| `npm run validate`      | полный quality gate: lint, format, test, build |

Перед отправкой решения:

```bash
npm run validate
```

Та же команда запускается GitHub Actions в чистом Node 16-окружении.

## Архитектура

```text
src/
├── components/
│   ├── catalog/       поиск, сетка и контейнер каталога
│   ├── product/       модальная карточка и галерея
│   └── ui/            переиспользуемые UI-компоненты
├── data/               валидируемые данные товаров
├── domain/             чистая бизнес-логика без зависимости от Vue
├── repositories/       граница работы с `localStorage`
└── views/              композиция страницы
tests/unit/             unit- и integration-тесы
```

Контейнер `ProductCatalog` связывает представление с domain-слоем и repository. Таймеры покупки хранятся вне реактивного состояния, отменяются при уничтожении компонента и не допускают дублирующие покупки.

## Совместимость и ограничения

- Babel транспилирует JavaScript по `browserslist` для актуальных Chrome, Firefox, Safari и Edge.
- Production CSS извлекается в отдельный файл, а `publicPath: auto` позволяет размещать сборку не только в корне домена.
- Репродукции картин загружаются из Wikimedia Commons, поэтому для их первого отображения нужен интернет. При ошибке показывается локальный placeholder.
- `node-releases@2.0.19` закреплён для воспроизводимой установки на Node 16. Обновлять override следует только вместе с повторным `npm ci` и `npm run validate` под Node 16.
- Из-за обязательных Vue 2 и Node 16 `npm audit` сообщает об advisory в Vue 2 / `vue-template-compiler` и webpack-dev-server. Предлагаемые исправления требуют Vue 3 или Node 18+, что нарушает условия задания. Dev Server следует запускать только локально.

## Источники изображений

- «Рождение Венеры»: [основная репродукция](https://commons.wikimedia.org/wiki/File:Birth_of_Venus.jpg), [дополнительная репродукция](<https://commons.wikimedia.org/wiki/File:The_Birth_of_Venus_(Botticelli)_1.jpg>)
- «Тайная вечеря»: [основная репродукция](https://commons.wikimedia.org/wiki/File:Leonardo_da_Vinci_-_The_Last_Supper_high_res.jpg), [дополнительная репродукция](https://commons.wikimedia.org/wiki/File:The_Last_Supper_Leonardo_Da_Vinci_-_High_Resolution.jpg)
- «Сотворение Адама»: [основная репродукция](https://commons.wikimedia.org/wiki/File:Michelangelo%2C_The_Creation_of_Adam.jpg), [дополнительная репродукция](https://commons.wikimedia.org/wiki/File:The_Creation_of_Adam_by_Michelangelo.JPG)
- «Урок анатомии»: [основная репродукция](https://commons.wikimedia.org/wiki/File:Rembrandt_-_The_Anatomy_Lesson_of_Dr._Nicolaes_Tulp.jpg), [дополнительная репродукция](https://commons.wikimedia.org/wiki/File:Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg)
