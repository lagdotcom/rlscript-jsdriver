import Game from "./Game";
import RL from "./RL";
import impl from "./impl";
import lib from "./lib";

window.addEventListener("load", () => {
  const main = document.getElementById("main");
  if (!main || main.tagName !== "CANVAS")
    throw new Error("Canvas #main not found.");

  const g = new Game(new RL(lib, impl(lib)), main as HTMLCanvasElement);
  g.init();
  void g.start();
});
