import dayjs from "dayjs";
import {generateId} from '../utils/common.js';

const MIN_NUMBER_OF_PHOTOS = 3;
const MAX_NUMBER_OF_PHOTOS = 5;

const randomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateStopType = () => {
  const stopPoints = [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ];
  return stopPoints[randomInt(0, stopPoints.length - 1)];
};

const generateTripType = () => {
  const vehicles = [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`
  ];
  return vehicles[randomInt(0, vehicles.length - 1)];
};

const generatePhotos = () => {
  const photos = new Array(randomInt(MIN_NUMBER_OF_PHOTOS, MAX_NUMBER_OF_PHOTOS)).fill().map(() => {
    return `http://picsum.photos/248/152?r=` + Math.random();
  });
  return photos;
};

const destinations = [
  {
    title: `New York`,
    photoUrl: generatePhotos(),
    description: `New York City (NYC), often called simply New York, is the most populous city in the United States. With an estimated 2019 population of 8,336,817 distributed over about 302.6 square miles (784 km2), New York City is also the most densely populated major city in the United States.`
  },
  {
    title: `San-Francisco`,
    photoUrl: generatePhotos(),
    description: `San Francisco, officially the City and County of San Francisco, is the cultural, commercial, and financial center of Northern California. San Francisco is the 16th most populous city in the United States, and the fourth most populous in California, with 881,549 residents as of 2019.`
  },
  {
    title: `Prague`,
    photoUrl: generatePhotos(),
    description: `Prague is the capital and largest city in the Czech Republic, the 13th largest city in the European Union and the historical capital of Bohemia.`
  },
  {
    title: `Munich`,
    photoUrl: generatePhotos(),
    description: `Munich is the capital and most populous city of Bavaria. With a population of 1,558,395 inhabitants as of July 31, 2020, it is the third-largest city in Germany, after Berlin and Hamburg, and thus the largest which does not constitute its own state, as well as the 11th-largest city in the European Union`
  },
  {
    title: `Paris`,
    photoUrl: generatePhotos(),
    description: `Paris is the capital and most populous city of France, with an estimated population of 2,148,271 residents as of 2020, in an area of 105 square kilometres (41 square miles).Since the 17th century, Paris has been one of Europe's major centres of finance, diplomacy, commerce, fashion, science and arts.`
  }
];

const generateDestination = () => {
  return destinations[randomInt(0, destinations.length - 1)];
};

const generateOffers = () => {
  const offers = [
    {
      title: `Order Uber`,
      type: `uber`,
      price: randomInt(10, 50),
      isChecked: false
    },
    {
      title: `Add luggage`,
      type: `luggage`,
      price: randomInt(10, 50),
      isChecked: false
    },
    {
      title: `Switch to comfort`,
      type: `comfort`,
      price: randomInt(10, 50),
      isChecked: false
    },
    {
      title: `Add meal`,
      type: `meal`,
      price: randomInt(10, 50),
      isChecked: false
    },
    {
      title: `Choose seats`,
      type: `seats`,
      price: randomInt(10, 50),
      isChecked: false
    },
    {
      title: `Travel by train`,
      type: `train`,
      price: randomInt(10, 50),
      isChecked: false
    }
  ];

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const offersCombination = [];

  for (let i = 0; i < randomInt(1, offers.length); i++) {
    offersCombination.push(offers[i]);
  }

  return shuffle(offersCombination);
};

const getPrice = () => randomInt(5, 100);

const generateIsFavorite = () => Boolean(randomInt(0, 1));

export const getGeneratedPoint = () => {
  return {
    id: generateId(),
    destinations,
    destination: generateDestination(),
    stopType: generateStopType(),
    tripType: generateTripType(),
    time: {
      start: dayjs().format(`YYYY-MM-DDThh:mm`),
      end: dayjs().add(randomInt(10, 5000), `minute`).format(`YYYY-MM-DDThh:mm`)
    },
    offers: generateOffers(),
    isFavorite: generateIsFavorite(),
    price: getPrice()
  };
};
