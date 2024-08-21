const button = document.getElementById("EnterBtn");
const totalBE = document.getElementById("totalBE");
const waterLvlElem = document.getElementById("waterLvl");
const optMiscElem = document.getElementById("optMisc");

let miscLvlsElem = document.getElementById("miscLevel");
let mainLvlsElem = document.getElementById("mainLevel");
let turtleLvlsElem = document.getElementById("turtleLevel");
let gkLvlsElem = document.getElementById("GKLevel");

const resultsElem = document.getElementById("results");

// DONT CHANGE THESE QUANT VALUES
const mainQuant = 5;
const turtleQuant = 4;

function fixDegree(x) {
  let preE = Number(String(x).split("e")[0]);
  let postE = Number(String(x).split("e")[1]);

  const degree = Math.floor(Math.log10(Math.abs(preE)));
  preE = preE / 10 ** degree;
  postE = postE + degree;
  const result = `${preE.toFixed(2)}e${postE}`;

  return result;
}

function distBE(totalBE, discount) {
  const [base, power] = totalBE.split("e").map(Number);

  const perMisc = (base * (0.1 / 13)) / discount;
  const perMain = (base * (0.5 / 7)) / discount;
  const perTurtle = (base * 0.2) / discount;
  const perGK = (base * 0.2) / discount;

  const miscEasterDist = () =>
    Math.floor((power + Math.log10(perMisc)) / Math.log10(2) - 1);

  function mainEasterDist() {
    const preE = Math.sqrt(perMain / mainQuant);
    const postE = (power + 1) / 2;

    if (String(postE).includes(".")) {
      const numList = String(postE).split(".");
      return `${preE * 10 ** (Number(numList[1]) / 10)}e${numList[0]}`;
    } else {
      return `${preE.toFixed(2)}e${postE}`;
    }
  }

  function turtleEasterDist() {
    const preE = (perTurtle / turtleQuant) ** 0.4;
    const postE = (power + 1) / 2.5;

    if (String(postE).includes(".")) {
      const numList = String(postE).split(".");
      return `${preE * 10 ** (Number(numList[1]) / 10)}e${numList[0]}`;
    } else {
      return `${preE.toFixed(2)}e${postE}`;
    }
  }

  const GKEasterDist = () => `${perGK}e${power}`;

  return {
    Misc: `${miscEasterDist()}`,
    Main: `${fixDegree(mainEasterDist())}`,
    Turtle: `${fixDegree(turtleEasterDist())}`,
    GK: `${fixDegree(GKEasterDist())}`,
  };
}

const calcWaterDiscount = (waterLevel) =>
  waterLevel >= 150 ? 0.95 ** 150 : 0.95 ** waterLevel;

function updateWaterInput() {
  if (waterLvlElem.value === "" || waterLvlElem.value <= 0) {
    waterLvlElem.value = "";
  } else if (waterLvlElem.value > 150) {
    waterLvlElem.value = 150;
  }
}

function updateOptMiscInput() {
  if (optMiscElem.value === "" || optMiscElem.value <= 0) {
    optMiscElem.value = "";
  }
}

function updateDistribution() {
  updateWaterInput();
  updateOptMiscInput();

  const discount = calcWaterDiscount(waterLvlElem.value);
  const optMisc = optMiscElem.value;
  const { Misc, Main, Turtle, GK } = distBE(totalBE.value, discount);

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

const updateOnEnter = (e) => {
  if (e.key === "Enter") {
    updateDistribution();
  }
};

// const updateOnEnter = (e) => e.key === "Enter" && updateDistribution();

button.addEventListener("click", (e) => updateDistribution());

totalBE.addEventListener("keyup", updateOnEnter);
optMiscElem.addEventListener("keyup", updateOnEnter);
waterLvlElem.addEventListener("keyup", updateOnEnter);
