import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
let moneyCtx = document.querySelector(`.statistics__chart--money`);
let typeCtx = document.querySelector(`.statistics__chart--transport`);
let timeCtx = document.querySelector(`.statistics__chart--time`);

const BAR_HEIGHT = 75;
moneyCtx.height = BAR_HEIGHT * 5;
typeCtx.height = BAR_HEIGHT * 5;
timeCtx.height = BAR_HEIGHT * 5;

const moneyChart = (labels, data) => new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: labels.map((label) => label.toUpperCase()),
    datasets: [{
      data,
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `€ ${val}`
      }
    },
    title: {
      display: true,
      text: `MONEY`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});

const typeChart = (labels, data) => new Chart(typeCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: labels.map((label) => label.toUpperCase()),
    datasets: [{
      data,
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `${val}x`
      }
    },
    title: {
      display: true,
      text: `TYPE`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});

const typeTime = (labels, data) => new Chart(timeCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: labels.map((label) => label.toUpperCase()),
    datasets: [{
      data,
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `${val}D`
      }
    },
    title: {
      display: true,
      text: `TIME`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});

export const showStatistics = (pointsData) => {
  const labels = [...new Set(pointsData.map((point) => point.tripType))];

  const pointsSortedByLabel = labels
          .map((label) => pointsData.filter((point) => point.tripType === label));

  const moneyData = pointsSortedByLabel
          .map((points) => points.reduce((acc, reducedPoint) => acc + reducedPoint.price, 0));

  const typeData = pointsSortedByLabel
          .map((points) => points.reduce((acc) => acc + 1, 0));

  const timeData = pointsSortedByLabel
          .map((points) => dayjs(
              points.reduce((acc, reducedPoint) => acc + dayjs(reducedPoint.time.end) - dayjs(reducedPoint.time.start), 0)
          ).format(`DD`));

  const getNewCtx = (ctxElement) => {
    const classNames = ctxElement.classList.value.split(` `);
    const parentDiv = ctxElement.parentElement;
    parentDiv.children[0].remove();
    const newCanvas = document.createElement(`canvas`);
    newCanvas.classList.add(classNames[0]);
    newCanvas.classList.add(classNames[2]);
    parentDiv.append(newCanvas);
    return newCanvas;
  };

  moneyCtx = getNewCtx(moneyCtx);
  typeCtx = getNewCtx(typeCtx);
  timeCtx = getNewCtx(timeCtx);

  moneyChart(labels, moneyData);
  typeChart(labels, typeData);
  typeTime(labels, timeData);
};
