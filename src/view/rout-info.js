import dayjs from "dayjs";
const createRouteInfoTemplate = (points) => {

  const generateRouteTitle = () => {
    return points.map((el) => el.destination.title).join(` — `);
  };

  const getTotalPrice = () => {
    let total = 0;
    points.forEach((point) => {
      total += point.price;
      if (point.offers) {
        point.offers.forEach((offer) => {
          if (offer.isChecked) {
            total += offer.price;
          }
        });
      }
    });
    return total;
  };

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${generateRouteTitle()}</h1>

      <p class="trip-info__dates">${dayjs(points[0].time.start).format(`MMM DD`)}&nbsp;—&nbsp;${dayjs(points[0].time.end).format(`DD`)}</p>
    </div>

    <p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${getTotalPrice()}</span>
    </p>
  </section>

  <div class="trip-main__trip-controls  trip-controls">
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>

    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked="">
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>

  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

export { createRouteInfoTemplate };
