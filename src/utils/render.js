import AbstractView from "../view/abstract-view.js";

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`
};

const render = (container, child, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTER:
      container.after(child);
      break;
  }
};

const renderTemplate = (container, template, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const getDuration = (timeStart, timeEnd) => {
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

const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export {RenderPosition, render, renderTemplate, createElement, getDuration, replace, remove};
