import { initPlayer, player } from "../systems/player.js";
import { initWorld, updateWorld, drawWorld } from "../systems/world.js";
import { updateZombies } from "../systems/zombies.js";
import { updateCamera, cam } from "../systems/camera.js";
import { setupCombat } from "../systems/combat.js";
import { setupUI } from "../ui/ui.js";

export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

export const minimap = document.getElementById("minimap");
export const miniCtx = minimap.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* INIT */
initPlayer();
initWorld();
setupCombat();
setupUI();

/* LOOP */
function loop(){
  updateWorld();
  updateZombies();
  updateCamera();

  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawWorld();

  requestAnimationFrame(loop);
}

loop();
