import { createProduct, PRODUCT_STATUS } from '../domain/product';

const commonsImage = (fileName, width) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(
    fileName,
  )}?width=${width}`;

const createGalleryImage = ({ productId, title, fileName, position, zoom }, index) => ({
  id: `${productId}-${index + 1}`,
  src: commonsImage(fileName, 1600),
  thumbnailSrc: commonsImage(fileName, 640),
  alt: `${title} — изображение ${index + 1}`,
  position,
  zoom,
});

const createGallery = (productId, title, images) =>
  images.map((image, index) => createGalleryImage({ productId, title, ...image }, index));

export const DEFAULT_CART_PRODUCT_IDS = Object.freeze(['creation-adam']);

export const products = Object.freeze([
  createProduct({
    id: 'venus',
    title: 'Рождение Венеры',
    author: 'Сандро Боттичелли',
    description:
      'Знаменитая работа Боттичелли, в которой богиня Венера появляется из морской пены и приближается к берегу.',
    status: PRODUCT_STATUS.AVAILABLE,
    price: {
      current: 1_000_000,
      previous: 2_000_000,
      currency: 'USD',
    },
    images: createGallery('venus', 'Рождение Венеры', [
      {
        fileName: 'Birth_of_Venus.jpg',
        position: '50% 50%',
        zoom: 1,
      },
      {
        fileName: 'The_Birth_of_Venus_(Botticelli)_1.jpg',
        position: '48% 42%',
        zoom: 1.7,
      },
    ]),
  }),
  createProduct({
    id: 'last-supper',
    title: 'Тайная вечеря',
    author: 'Леонардо да Винчи',
    description:
      'Монументальная композиция Леонардо да Винчи изображает реакцию апостолов на слова Христа о предательстве.',
    status: PRODUCT_STATUS.AVAILABLE,
    price: {
      current: 3_000_000,
      previous: null,
      currency: 'USD',
    },
    images: createGallery('last-supper', 'Тайная вечеря', [
      {
        fileName: 'Leonardo_da_Vinci_-_The_Last_Supper_high_res.jpg',
        position: '50% 50%',
        zoom: 1,
      },
      {
        fileName: 'The_Last_Supper_Leonardo_Da_Vinci_-_High_Resolution.jpg',
        position: '50% 45%',
        zoom: 1.8,
      },
    ]),
  }),
  createProduct({
    id: 'creation-adam',
    title: 'Сотворение Адама',
    author: 'Микеланджело',
    description:
      'Фрагмент росписи Сикстинской капеллы, запечатлевший момент, когда Бог передаёт Адаму жизненную силу.',
    status: PRODUCT_STATUS.AVAILABLE,
    price: {
      current: 5_000_000,
      previous: 6_000_000,
      currency: 'USD',
    },
    images: createGallery('creation-adam', 'Сотворение Адама', [
      {
        fileName: 'Michelangelo,_The_Creation_of_Adam.jpg',
        position: '50% 50%',
        zoom: 1,
      },
      {
        fileName: 'The_Creation_of_Adam_by_Michelangelo.JPG',
        position: '52% 47%',
        zoom: 1.9,
      },
    ]),
  }),
  createProduct({
    id: 'anatomy-lesson',
    title: 'Урок анатомии',
    author: 'Рембрандт',
    description:
      'Групповой портрет Рембрандта показывает публичную лекцию доктора Тульпа и внимательных членов гильдии хирургов.',
    status: PRODUCT_STATUS.SOLD,
    soldLabel: 'Продана на аукционе',
    images: createGallery('anatomy-lesson', 'Урок анатомии', [
      {
        fileName: 'Rembrandt_-_The_Anatomy_Lesson_of_Dr._Nicolaes_Tulp.jpg',
        position: '50% 50%',
        zoom: 1,
      },
      {
        fileName: 'Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg',
        position: '48% 32%',
        zoom: 1.75,
      },
    ]),
  }),
]);

export default products;
