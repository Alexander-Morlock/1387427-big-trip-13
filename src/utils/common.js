import dayjs from "dayjs";

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

const getDurationOfTrip = (point) => {
  return dayjs(point.time.end) - dayjs(point.time.start);
};

export {updateItem, getDurationOfTrip};
