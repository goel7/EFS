const button = document.getElementById("EnterBtn");
const totalBEElem = document.getElementById("totalBE");
const waterLvlElem = document.getElementById("waterLvl");
const optMiscElem = document.getElementById("optMisc");

let miscLvlsElem = document.getElementById("miscLevel");
let mainLvlsElem = document.getElementById("mainLevel");
let turtleLvlsElem = document.getElementById("turtleLevel");
let gkLvlsElem = document.getElementById("GKLevel");

const resultsElem = document.getElementById("results");

class EasterDistribution {
  constructor(base, power, discount) {
    this.base = base;
    this.power = power;
    this.discount = discount;
    this.mainQuant = 5;
    this.turtleQuant = 4;
  }

  misc() {
    const perMisc = (this.base * (0.1 / 13)) / this.discount;
    return Math.floor((this.power + Math.log10(perMisc)) / Math.log10(2) - 1);
  }

  main() {
    const perMain = (this.base * (0.5 / 7)) / this.discount;
    const preE = Math.sqrt(perMain / this.mainQuant);
    const postE = (this.power + 1) / 2;

    return this.formatExponential(preE, postE);
  }

  turtle() {
    const perTurtle = (this.base * 0.2) / this.discount;
    const preE = (perTurtle / this.turtleQuant) ** 0.4;
    const postE = (this.power + 1) / 2.5;

    return this.formatExponential(preE, postE);
  }

  gk() {
    const perGK = (this.base * 0.2) / this.discount;
    return `${perGK}e${this.power}`;
  }

  formatExponential(preE, postE) {
    if (String(postE).includes(".")) {
      const numList = String(postE).split(".");
      return `${preE * 10 ** (Number(numList[1]) / 10)}e${numList[0]}`;
    } else {
      return `${preE.toFixed(2)}e${postE}`;
    }
  }
}

function distributeBE(totalBE, discount) {
  const [base, power] = getBasePower(totalBE);
  const easterDist = new EasterDistribution(base, power, discount);

  return {
    Misc: easterDist.misc(),
    Main: formatSci(easterDist.main()),
    Turtle: formatSci(easterDist.turtle()),
    GK: formatSci(easterDist.gk()),
  };
}

function formatSci(x) {
  let preE = Number(String(x).split("e")[0]);
  let postE = Number(String(x).split("e")[1]);

  const degree = Math.floor(Math.log10(Math.abs(preE)));
  preE = preE / 10 ** degree;
  postE = postE + degree;
  const result = `${preE.toFixed(2)}e${postE}`;

  return result;
}

function getBasePower(input) {
  const suffixes = {
    k: 3,
    K: 3,
    m: 6,
    M: 6,
    B: 9,
    T: 12,
    q: 15,
    Q: 18,
    s: 21,
    S: 24,
    O: 27,
    N: 30,
    d: 33,
    U: 36,
    D: 39,
  };

  const suffix = input.match(/[a-zA-Z]$/);

  if (suffix) {
    const base = parseFloat(input);
    const power = suffixes[suffix[0]];
    return [base, power];
  } else {
    const [base, power] = input.split("e").map(Number);
    return [base, power];
  }
}

const calcWaterDiscount = (waterLevel) =>
  waterLevel >= 150 ? 0.95 ** 150 : 0.95 ** waterLevel;

function updateWaterInput() {
  let waterLevel = parseFloat(waterLvlElem.value);
  if (isNaN(waterLevel) || waterLevel <= 0) {
    waterLvlElem.value = "";
  } else {
    waterLvlElem.value = Math.min(150, Math.floor(waterLevel));
  }
}

function updateOptMiscInput() {
  let optMisc = parseFloat(optMiscElem.value);
  if (isNaN(optMisc) || optMisc <= 0) {
    optMiscElem.value = "";
  } else {
    optMiscElem.value = Math.floor(optMisc);
  }
}

function updateDistribution() {
  updateWaterInput();
  updateOptMiscInput();

  const discount = calcWaterDiscount(parseFloat(waterLvlElem.value) || 0);
  const optMisc = parseFloat(optMiscElem.value) || 0;
  const { Misc, Main, Turtle, GK } = distributeBE(totalBEElem.value, discount);

  if (optMiscElem.value <= 0) {
    optMiscElem.value = "";
    miscLvlsElem.textContent = Misc;
  } else if (Number(optMiscElem.value) > Number(Misc)) {
    miscLvlsElem.textContent = `${Misc} (+ N/A)`;
  } else if (optMiscElem.value > 0) {
    miscLvlsElem.textContent = `${Misc} (+${Number(Misc) - Number(optMisc)})`;
  }

  mainLvlsElem.textContent = Main;
  turtleLvlsElem.textContent = Turtle;
  gkLvlsElem.textContent = GK;

  resultsElem.style.visibility = "visible";
}

const updateOnEnter = (e) => e.key === "Enter" && updateDistribution();

button.addEventListener("click", updateDistribution);
totalBEElem.addEventListener("keyup", updateOnEnter);
optMiscElem.addEventListener("keyup", updateOnEnter);
waterLvlElem.addEventListener("keyup", updateOnEnter);
