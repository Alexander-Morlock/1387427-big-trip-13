import Abstract from "./view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getDuration = (timeStart, timeEnd) => {
  const start = new Date(timeStart).getTime();
  const end = new Date(timeEnd).getTime();
  const durationMinutes = Math.floor(Math.abs(end - start) / 60000); // in minutes
  const days = Math.floor(durationMinutes / 60 / 24);
  const hours = Math.floor((durationMinutes - days * 24 * 60) / 60);
  const minutes = durationMinutes - days * 24 * 60 - hours * 60;
  let duration = ``;

  if (days) {
    if (days < 10) {
      duration += `0`;
    }
    duration += days + `D `;
  }

  if (days || hours) {
    if (hours < 10) {
      duration += `0`;
    }
    duration += hours + `H `;
  }

  if (minutes < 10) {
    duration += `0`;
  }
  duration += minutes + `M`;

  return duration;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};
