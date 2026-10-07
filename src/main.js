import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { Game } from "./core/Game.js";

const canvas = document.getElementById("gameCanvas");

const game = new Game({
  canvas,
  THREE
});

const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameElement = document.getElementById("game");

startButton.addEventListener("click", async () => {
  startScreen.style.display = "none";
  gameElement.style.display = "block";

  await game.start();
});
