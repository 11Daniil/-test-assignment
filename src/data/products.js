const commonsImage = (fileName, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}?width=${width}`;

const imageSources = {
  venus: [
    commonsImage('Birth_of_Venus.jpg', 1200),
    commonsImage('The_Birth_of_Venus_(Botticelli)_1.jpg'),
  ],
  'last-supper': [
    commonsImage('Leonardo_da_Vinci_-_The_Last_Supper_high_res.jpg'),
    commonsImage('The_Last_Supper_Leonardo_Da_Vinci_-_High_Resolution.jpg'),
  ],
  'creation-adam': [
    commonsImage('Michelangelo,_The_Creation_of_Adam.jpg'),
    commonsImage('The_Creation_of_Adam_by_Michelangelo.JPG'),
  ],
  'anatomy-lesson': [
    commonsImage('Rembrandt_-_The_Anatomy_Lesson_of_Dr._Nicolaes_Tulp.jpg'),
    commonsImage('Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg'),
  ],
};

const imagePath = (name) => imageSources[name][0];

const createSlides = (name, title, views) => {
  const sources = imageSources[name];

  return views.map(({ position, zoom }, index) => ({
    id: `${name}-${index + 1}`,
    src: sources[index],
    alt: `${title} — фрагмент ${index + 1}`,
    position,
    zoom,
  }));
};

export const products = [
  {
    id: 'venus',
    title: 'Рождение Венеры',
    author: 'Сандро Боттичелли',
    image: imagePath('venus'),
    oldPrice: '2 000 000 $',
    price: '1 000 000 $',
    available: true,
    sold: false,
    initiallyInCart: false,
    auctionText: '',
    description:
      'Знаменитая работа Боттичелли, в которой богиня Венера появляется из морской пены и приближается к берегу.',
    slides: createSlides('venus', 'Рождение Венеры', [
      { position: '50% 50%', zoom: 1 },
      { position: '48% 42%', zoom: 1.7 },
    ]),
  },
  {
    id: 'last-supper',
    title: 'Тайная вечеря',
    author: 'Леонардо да Винчи',
    image: imagePath('last-supper'),
    oldPrice: null,
    price: '3 000 000 $',
    available: true,
    sold: false,
    initiallyInCart: false,
    auctionText: '',
    description:
      'Монументальная композиция Леонардо да Винчи изображает реакцию апостолов на слова Христа о предательстве.',
    slides: createSlides('last-supper', 'Тайная вечеря', [
      { position: '50% 50%', zoom: 1 },
      { position: '50% 45%', zoom: 1.8 },
    ]),
  },
  {
    id: 'creation-adam',
    title: 'Сотворение Адама',
    author: 'Микеланджело',
    image: imagePath('creation-adam'),
    oldPrice: '6 000 000 $',
    price: '5 000 000 $',
    available: true,
    sold: false,
    initiallyInCart: true,
    auctionText: '',
    description:
      'Фрагмент росписи Сикстинской капеллы, запечатлевший момент, когда Бог передаёт Адаму жизненную силу.',
    slides: createSlides('creation-adam', 'Сотворение Адама', [
      { position: '50% 50%', zoom: 1 },
      { position: '52% 47%', zoom: 1.9 },
    ]),
  },
  {
    id: 'anatomy-lesson',
    title: 'Урок анатомии',
    author: 'Рембрандт',
    image: imagePath('anatomy-lesson'),
    oldPrice: null,
    price: null,
    available: false,
    sold: true,
    initiallyInCart: false,
    auctionText: 'Продана на аукционе',
    description:
      'Групповой портрет Рембрандта показывает публичную лекцию доктора Тульпа и внимательных членов гильдии хирургов.',
    slides: createSlides('anatomy-lesson', 'Урок анатомии', [
      { position: '50% 50%', zoom: 1 },
      { position: '48% 32%', zoom: 1.75 },
    ]),
  },
];

export default products;
