# Banki.shop

Тестовое задание — адаптивная страница интернет-магазина по макету Figma. Приложение написано на Vue 2.7 (Options API) и собирается Webpack 5.

## Возможности

- поиск товаров по названию без перезагрузки страницы;
- последовательные состояния кнопки покупки: «Купить» → «Обрабатывается» → «В корзине»;
- сохранение корзины в `localStorage` после перезагрузки;
- модальная карточка товара с описанием, ценой и галереей изображений;
- адаптивная верстка для настольных и мобильных экранов шириной до 360 px.

## Требования

- Node.js 16 или новее;
- npm 8 или новее.

Версии зависимостей зафиксированы в `package.json` и совместимы с Node.js 16.

Изображения картин загружаются из Wikimedia Commons. Для их отображения при
первом открытии страницы требуется подключение к интернету.

## Установка и запуск

Установите зависимости из lock-файла:

```bash
npm ci
```

Запустите локальный сервер разработки:

```bash
npm run dev
```

После запуска приложение будет доступно по адресу [http://localhost:8080](http://localhost:8080). Изменения в исходниках применяются автоматически.

## Сборка

Создайте оптимизированную production-сборку:

```bash
npm run build
```

Готовые файлы появятся в каталоге `dist/`. Для проверки production-сборки отдавайте содержимое этого каталога через любой статический HTTP-сервер.

## Структура проекта

```text
public/             HTML-шаблон
src/                исходный код приложения
webpack.config.js   конфигурация сборки и локального сервера
package.json        команды и зафиксированные версии зависимостей
```

## Поддержка браузеров

JavaScript преобразуется Babel в соответствии с настройкой `browserslist`. Интерфейс рассчитан на актуальные версии Chrome, Firefox, Safari и Edge.

## Источники изображений

- «Рождение Венеры»: [основная репродукция](https://commons.wikimedia.org/wiki/File:Birth_of_Venus.jpg), [дополнительная репродукция](https://commons.wikimedia.org/wiki/File:The_Birth_of_Venus_(Botticelli)_1.jpg)
- «Тайная вечеря»: [основная репродукция](https://commons.wikimedia.org/wiki/File:Leonardo_da_Vinci_-_The_Last_Supper_high_res.jpg), [дополнительная репродукция](https://commons.wikimedia.org/wiki/File:The_Last_Supper_Leonardo_Da_Vinci_-_High_Resolution.jpg)
- «Сотворение Адама»: [основная репродукция](https://commons.wikimedia.org/wiki/File:Michelangelo%2C_The_Creation_of_Adam.jpg), [дополнительная репродукция](https://commons.wikimedia.org/wiki/File:The_Creation_of_Adam_by_Michelangelo.JPG)
- «Урок анатомии»: [основная репродукция](https://commons.wikimedia.org/wiki/File:Rembrandt_-_The_Anatomy_Lesson_of_Dr._Nicolaes_Tulp.jpg), [дополнительная репродукция](https://commons.wikimedia.org/wiki/File:Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg)
