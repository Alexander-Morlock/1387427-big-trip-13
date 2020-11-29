import dayjs from "dayjs";

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

const generateDestination = () => {
  const destinations = [
    `New York`,
    `San-Francisco`,
    `Prague`,
    `Munich`,
    `Paris`
  ];
  return destinations[randomInt(0, destinations.length - 1)];
};

const generateOffers = () => {
  const offers = [
    {
      title: null,
      price: null
    },
    {
      title: `Order Uber`,
      price: randomInt(10, 50)
    },
    {
      title: `Add luggage`,
      price: randomInt(10, 50)
    },
    {
      title: `Switch to comfort`,
      price: randomInt(10, 50)
    },
    {
      title: `Add meal`,
      price: randomInt(10, 50)
    },
    {
      title: `Choose seats`,
      price: randomInt(10, 50)
    }
  ];

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  let offersCombination = [];

  for (let i = 0; i < randomInt(1, offers.length); i++) {
    offersCombination.push(offers[i]);
  }

  if (offersCombination[0].title === null && offersCombination.length > 1) {
    offersCombination.shift();
  }

  let result = shuffle(offersCombination);
  if (result.length === 1 && result[0].title === null) {
    result = undefined;
  }
  return result;
};

const getPrice = () => randomInt(5, 100);

const generateIsFavorite = () => Boolean(randomInt(0, 1));

export const getGeneratedPoint = () => {
  return {
    destination: generateDestination(),
    stopType: generateStopType(),
    tripType: generateTripType(),
    time: {
      start: dayjs().format(`YYYY-MM-DDTHH:MM`),
      end: dayjs().add(randomInt(10, 5000), `minute`).format(`YYYY-MM-DDTHH:MM`)
    },
    offers: generateOffers(),
    isFavorite: generateIsFavorite(),
    price: getPrice()
  };
};
