import * as TZ from "./trizas.js";

const canvas = document.getElementById("game");

const renderer = new TZ.Renderer(canvas);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

const scene = new TZ.Scene();

const camera = new TZ.PerspectiveCamera(
  70,
  innerWidth / innerHeight,
  0.1,
  1000
);

camera.position.set(0, 3, 8);

const ambient = new TZ.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

const sun = new TZ.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);


/* =========================
   PLANET
========================= */

const groundGeometry = new TZ.PlaneGeometry(200, 200);

const groundMaterial = new TZ.MeshBasicMaterial({
  color: 0x17202c
});

const ground = new TZ.Mesh(
  groundGeometry,
  groundMaterial
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


/* =========================
   BUILDINGS
========================= */

function createBuilding(x, z) {

  const group = new TZ.Group();

  const base = new TZ.Mesh(
    new TZ.BoxGeometry(6, 3, 6),
    new TZ.MeshBasicMaterial({
      color: 0x536273
    })
  );

  base.position.y = 1.5;

  const roof = new TZ.Mesh(
    new TZ.BoxGeometry(4, 2, 4),
    new TZ.MeshBasicMaterial({
      color: 0x91a8bd
    })
  );

  roof.position.y = 4;

  const antenna = new TZ.Mesh(
    new TZ.BoxGeometry(.25, 4, .25),
    new TZ.MeshBasicMaterial({
      color: 0x65d7ff
    })
  );

  antenna.position.y = 7;

  group.add(base);
  group.add(roof);
  group.add(antenna);

  group.position.set(x, 0, z);

  scene.add(group);
}

createBuilding(12, -8);
createBuilding(-15, -20);


/* =========================
   ROCKS
========================= */

for (let i = 0; i < 80; i++) {

  const rock = new TZ.Mesh(
    new TZ.BoxGeometry(
      0.5 + Math.random() * 1.5,
      0.4 + Math.random() * 1.2,
      0.5 + Math.random() * 1.5
    ),
    new TZ.MeshBasicMaterial({
      color: 0x59616b
    })
  );

  rock.position.set(
    (Math.random() - .5) * 120,
    .4,
    (Math.random() - .5) * 120
  );

  rock.rotation.y = Math.random() * Math.PI;

  scene.add(rock);
}


/* =========================
   INPUT
========================= */

const keys = {};

addEventListener("keydown", e => {
  keys[e.code] = true;
});

addEventListener("keyup", e => {
  keys[e.code] = false;
});

let yaw = 0;

canvas.addEventListener("pointermove", e => {

  if (e.buttons !== 1) return;

  yaw -= e.movementX * 0.003;

  camera.rotation.y = yaw;
});


/* =========================
   LOOP
========================= */

let last = performance.now();

function loop(now) {

  const dt = Math.min(
    (now - last) / 1000,
    0.05
  );

  last = now;

  const speed = 8 * dt;

  if (keys.KeyW) {
    camera.position.x -= Math.sin(yaw) * speed;
    camera.position.z -= Math.cos(yaw) * speed;
  }

  if (keys.KeyS) {
    camera.position.x += Math.sin(yaw) * speed;
    camera.position.z += Math.cos(yaw) * speed;
  }

  if (keys.KeyA) {
    camera.position.x -= Math.cos(yaw) * speed;
    camera.position.z += Math.sin(yaw) * speed;
  }

  if (keys.KeyD) {
    camera.position.x += Math.cos(yaw) * speed;
    camera.position.z -= Math.sin(yaw) * speed;
  }

  renderer.render(scene, camera);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);


/* =========================
   RESIZE
========================= */

function resize() {

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    innerWidth,
    innerHeight
  );
}

addEventListener("resize", resize);

resize();
