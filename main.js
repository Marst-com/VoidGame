import * as TZ from "./trizas.js";

const canvas =
    document.getElementById("game");

const renderer =
    new TZ.Renderer(canvas, {
        antialias: true
    });

renderer.setPixelRatio(
    Math.min(devicePixelRatio, 1.5)
);

const scene =
    new TZ.Scene();

const camera =
    new TZ.PerspectiveCamera(
        70,
        innerWidth / innerHeight,
        0.1,
        500
    );

camera.position.set(
    0,
    5,
    12
);


/* =========================
   WORLD
========================= */

const ground =
    new TZ.Mesh(
        new TZ.PlaneGeometry(180, 180),
        new TZ.MeshBasicMaterial({
            color: 0x202a35
        })
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);


/* =========================
   BUILDING
========================= */

function building(x, z) {

    const group =
        new TZ.Group();

    const base =
        new TZ.Mesh(
            new TZ.BoxGeometry(7, 3, 7),
            new TZ.MeshBasicMaterial({
                color: 0x667382
            })
        );

    base.position.y = 1.5;


    const roof =
        new TZ.Mesh(
            new TZ.BoxGeometry(5, 1, 5),
            new TZ.MeshBasicMaterial({
                color: 0x9eafbd
            })
        );

    roof.position.y = 3.5;


    const antenna =
        new TZ.Mesh(
            new TZ.CylinderGeometry(
                .15,
                .15,
                5,
                10
            ),
            new TZ.MeshBasicMaterial({
                color: 0x48d8ff
            })
        );

    antenna.position.y = 6;


    group.add(
        base,
        roof,
        antenna
    );

    group.position.set(
        x,
        0,
        z
    );

    scene.add(group);
}

building(15, -10);
building(-18, -25);


/* =========================
   ROCKS
========================= */

for (let i = 0; i < 70; i++) {

    const rock =
        new TZ.Mesh(
            new TZ.BoxGeometry(
                .5 + Math.random() * 1.5,
                .4 + Math.random(),
                .5 + Math.random() * 1.5
            ),
            new TZ.MeshBasicMaterial({
                color:
                    0x4d5661
            })
        );

    rock.position.set(
        (Math.random() - .5) * 120,
        .5,
        (Math.random() - .5) * 120
    );

    rock.rotation.y =
        Math.random() * Math.PI;

    scene.add(rock);
}


/* =========================
   CRYSTALS
========================= */

for (let i = 0; i < 30; i++) {

    const crystal =
        new TZ.Mesh(
            new TZ.CylinderGeometry(
                .25,
                .08,
                1.5,
                6
            ),
            new TZ.MeshBasicMaterial({
                color: 0x55dfff
            })
        );

    crystal.position.set(
        (Math.random() - .5) * 100,
        .8,
        (Math.random() - .5) * 100
    );

    scene.add(crystal);
}


/* =========================
   PLAYER
========================= */

const player =
    new TZ.Group();

const body =
    new TZ.Mesh(
        new TZ.BoxGeometry(
            1.2,
            1.8,
            .8
        ),
        new TZ.MeshBasicMaterial({
            color: 0xdfe8ef
        })
    );

body.position.y = 1;

const helmet =
    new TZ.Mesh(
        new TZ.SphereGeometry(
            .48,
            12,
            8
        ),
        new TZ.MeshBasicMaterial({
            color: 0xbfd8e8
        })
    );

helmet.position.y = 2.15;

player.add(
    body,
    helmet
);

player.position.set(
    0,
    0,
    5
);

scene.add(player);


/* =========================
   INPUT
========================= */

const keyboard =
    new TZ.Keyboard();

let yaw = 0;

canvas.addEventListener(
    "pointermove",
    e => {

        if (e.buttons !== 1) {
            return;
        }

        yaw -=
            e.movementX * .003;
    }
);


/* =========================
   CAMERA
========================= */

function updateCamera() {

    const distance = 7;

    camera.position.x =
        player.position.x -
        Math.sin(yaw) * distance;

    camera.position.z =
        player.position.z -
        Math.cos(yaw) * distance;

    camera.position.y =
        player.position.y + 4;

    camera.rotation.y =
        yaw;

    camera.rotation.x =
        -0.15;
}


/* =========================
   MOVEMENT
========================= */

const clock =
    new TZ.Clock();

function update() {

    const dt =
        clock.tick();

    const speed =
        8 * dt;

    if (
        keyboard.down("KeyW") ||
        keyboard.down("ArrowUp")
    ) {

        player.position.x -=
            Math.sin(yaw) * speed;

        player.position.z -=
            Math.cos(yaw) * speed;
    }

    if (
        keyboard.down("KeyS") ||
        keyboard.down("ArrowDown")
    ) {

        player.position.x +=
            Math.sin(yaw) * speed;

        player.position.z +=
            Math.cos(yaw) * speed;
    }

    if (
        keyboard.down("KeyA") ||
        keyboard.down("ArrowLeft")
    ) {

        player.position.x -=
            Math.cos(yaw) * speed;

        player.position.z +=
            Math.sin(yaw) * speed;
    }

    if (
        keyboard.down("KeyD") ||
        keyboard.down("ArrowRight")
    ) {

        player.position.x +=
            Math.cos(yaw) * speed;

        player.position.z -=
            Math.sin(yaw) * speed;
    }


    updateCamera();

    renderer.render(
        scene,
        camera
    );

    requestAnimationFrame(
        update
    );
}

requestAnimationFrame(update);


/* =========================
   RESIZE
========================= */

function resize() {

    camera.aspect =
        innerWidth / innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        innerWidth,
        innerHeight
    );
}

addEventListener(
    "resize",
    resize
);

resize();
