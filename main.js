"use strict";

const TZ = window.TriZas;

const canvas =
    document.getElementById("game");

const status =
    document.getElementById("status");


/* =========================================================
   ENGINE
========================================================= */

const renderer =
    new TZ.Renderer(canvas);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio || 1,
        1.5
    )
);


const scene =
    new TZ.Scene();


const camera =
    new TZ.PerspectiveCamera(
        70,
        innerWidth / innerHeight,
        .1,
        600
    );


/* =========================================================
   GROUND
========================================================= */

const ground =
    new TZ.Mesh(
        new TZ.PlaneGeometry(
            220,
            220
        ),
        new TZ.MeshBasicMaterial({
            color: 0x202a35
        })
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);


/* =========================================================
   STARS
========================================================= */

for (let i = 0; i < 350; i++) {

    const star =
        new TZ.Mesh(
            new TZ.BoxGeometry(
                .08,
                .08,
                .08
            ),
            new TZ.MeshBasicMaterial({
                color:
                    Math.random() > .7
                        ? 0x8fd8ff
                        : 0xffffff
            })
        );

    star.position.set(
        (Math.random() - .5) * 300,
        25 + Math.random() * 100,
        (Math.random() - .5) * 300
    );

    scene.add(star);
}


/* =========================================================
   BUILDINGS
========================================================= */

function createBuilding(x, z) {

    const group =
        new TZ.Group();


    const base =
        new TZ.Mesh(
            new TZ.BoxGeometry(
                8,
                3,
                8
            ),
            new TZ.MeshBasicMaterial({
                color: 0x5d6977
            })
        );

    base.position.y =
        1.5;


    const upper =
        new TZ.Mesh(
            new TZ.BoxGeometry(
                6,
                2,
                6
            ),
            new TZ.MeshBasicMaterial({
                color: 0x8c9cab
            })
        );

    upper.position.y =
        4;


    const tower =
        new TZ.Mesh(
            new TZ.CylinderGeometry(
                .3,
                .3,
                5,
                10
            ),
            new TZ.MeshBasicMaterial({
                color: 0x4bdcff
            })
        );

    tower.position.y =
        7.5;


    group.add(
        base,
        upper,
        tower
    );


    group.position.set(
        x,
        0,
        z
    );


    scene.add(group);
}


createBuilding(
    15,
    -10
);

createBuilding(
    -18,
    -25
);


/* =========================================================
   ALIEN RUIN
========================================================= */

const ruin =
    new TZ.Group();

const core =
    new TZ.Mesh(
        new TZ.CylinderGeometry(
            1.5,
            2,
            7,
            8
        ),
        new TZ.MeshBasicMaterial({
            color: 0x563d7c
        })
    );

core.position.y =
    3.5;

ruin.add(core);


for (let i = 0; i < 8; i++) {

    const pillar =
        new TZ.Mesh(
            new TZ.BoxGeometry(
                1,
                5,
                1
            ),
            new TZ.MeshBasicMaterial({
                color: 0x3b5065
            })
        );

    const angle =
        i / 8 *
        Math.PI * 2;

    pillar.position.set(
        Math.cos(angle) * 5,
        2.5,
        Math.sin(angle) * 5
    );

    ruin.add(pillar);
}

ruin.position.set(
    -25,
    0,
    -35
);

scene.add(ruin);


/* =========================================================
   ROCKS
========================================================= */

for (let i = 0; i < 100; i++) {

    const rock =
        new TZ.Mesh(
            new TZ.BoxGeometry(
                .5 + Math.random() * 1.8,
                .4 + Math.random() * 1.4,
                .5 + Math.random() * 1.8
            ),
            new TZ.MeshBasicMaterial({
                color:
                    0x46515d
            })
        );


    rock.position.set(
        (Math.random() - .5) * 130,
        .5,
        (Math.random() - .5) * 130
    );


    rock.rotation.y =
        Math.random() *
        Math.PI;


    scene.add(rock);
}


/* =========================================================
   CRYSTALS
========================================================= */

for (let i = 0; i < 35; i++) {

    const crystal =
        new TZ.Mesh(
            new TZ.CylinderGeometry(
                .25,
                .05,
                1.6,
                6
            ),
            new TZ.MeshBasicMaterial({
                color: 0x44dfff
            })
        );


    crystal.position.set(
        (Math.random() - .5) * 110,
        .8,
        (Math.random() - .5) * 110
    );


    crystal.rotation.z =
        (Math.random() - .5) * .4;


    scene.add(crystal);
}


/* =========================================================
   PLAYER
========================================================= */

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
            color: 0xdce8ef
        })
    );

body.position.y =
    1;


const helmet =
    new TZ.Mesh(
        new TZ.SphereGeometry(
            .5,
            12,
            8
        ),
        new TZ.MeshBasicMaterial({
            color: 0x9fc5d8
        })
    );

helmet.position.y =
    2.25;


const backpack =
    new TZ.Mesh(
        new TZ.BoxGeometry(
            .8,
            1.1,
            .35
        ),
        new TZ.MeshBasicMaterial({
            color: 0x344454
        })
    );

backpack.position.set(
    0,
    1.15,
    .55
);


player.add(
    body,
    helmet,
    backpack
);


player.position.set(
    0,
    0,
    8
);


scene.add(player);


/* =========================================================
   INPUT
========================================================= */

const keyboard =
    new TZ.Keyboard();

let yaw = 0;

let pitch =
    -0.18;


/* =========================================================
   CAMERA DRAG
========================================================= */

let dragging = false;

let lastX = 0;
let lastY = 0;


canvas.addEventListener(
    "pointerdown",
    e => {

        dragging = true;

        lastX = e.clientX;
        lastY = e.clientY;

        canvas.setPointerCapture(
            e.pointerId
        );
    }
);


canvas.addEventListener(
    "pointermove",
    e => {

        if (!dragging) {
            return;
        }

        const dx =
            e.clientX - lastX;

        const dy =
            e.clientY - lastY;

        lastX =
            e.clientX;

        lastY =
            e.clientY;


        yaw -= dx * .004;

        pitch -= dy * .003;


        pitch =
            Math.max(
                -.65,
                Math.min(
                    .2,
                    pitch
                )
            );
    }
);


canvas.addEventListener(
    "pointerup",
    e => {

        dragging = false;

        try {
            canvas.releasePointerCapture(
                e.pointerId
            );
        } catch {}
    }
);


/* =========================================================
   JOYSTICK
========================================================= */

const joystick =
    document.getElementById(
        "joystick"
    );

const joyBase =
    document.getElementById(
        "joyBase"
    );

const joyStick =
    document.getElementById(
        "joyStick"
    );


let joyX = 0;
let joyY = 0;

let joyActive = false;


function updateJoystick(
    clientX,
    clientY
) {

    const rect =
        joyBase.getBoundingClientRect();

    const cx =
        rect.left +
        rect.width / 2;

    const cy =
        rect.top +
        rect.height / 2;


    let dx =
        clientX - cx;

    let dy =
        clientY - cy;


    const max =
        rect.width * .35;


    const length =
        Math.hypot(dx, dy);


    if (length > max) {

        dx =
            dx / length *
            max;

        dy =
            dy / length *
            max;
    }


    joyX =
        dx / max;

    joyY =
        dy / max;


    joyStick.style.transform =
        `translate(${dx}px,${dy}px)`;
}


function resetJoystick() {

    joyX = 0;
    joyY = 0;

    joyStick.style.transform =
        "translate(0,0)";
}


joystick.addEventListener(
    "pointerdown",
    e => {

        joyActive = true;

        joystick.setPointerCapture(
            e.pointerId
        );

        updateJoystick(
            e.clientX,
            e.clientY
        );
    }
);


joystick.addEventListener(
    "pointermove",
    e => {

        if (!joyActive) {
            return;
        }

        updateJoystick(
            e.clientX,
            e.clientY
        );
    }
);


joystick.addEventListener(
    "pointerup",
    () => {

        joyActive = false;

        resetJoystick();
    }
);


joystick.addEventListener(
    "pointercancel",
    () => {

        joyActive = false;

        resetJoystick();
    }
);


/* =========================================================
   JUMP
========================================================= */

const jumpButton =
    document.getElementById(
        "jump"
    );


let velocityY = 0;

let grounded = true;


function jump() {

    if (!grounded) {
        return;
    }

    velocityY =
        8.5;

    grounded = false;
}


jumpButton.addEventListener(
    "pointerdown",
    jump
);


window.addEventListener(
    "keydown",
    e => {

        if (
            e.code === "Space"
        ) {
            jump();
        }
    }
);


/* =========================================================
   SCAN
========================================================= */

const scanButton =
    document.getElementById(
        "scan"
    );


let scanTimer = 0;


scanButton.addEventListener(
    "pointerdown",
    () => {

        scanTimer =
            2;

        status.textContent =
            "SCANNING PLANET...";
    }
);


/* =========================================================
   UPDATE
========================================================= */

const clock =
    new TZ.Clock();


function update() {

    const dt =
        clock.tick();


    /*
     * Movement
     */

    let mx = joyX;
    let mz = joyY;


    if (
        keyboard.down("KeyW") ||
        keyboard.down("ArrowUp")
    ) {
        mz = -1;
    }

    if (
        keyboard.down("KeyS") ||
        keyboard.down("ArrowDown")
    ) {
        mz = 1;
    }

    if (
        keyboard.down("KeyA") ||
        keyboard.down("ArrowLeft")
    ) {
        mx = -1;
    }

    if (
        keyboard.down("KeyD") ||
        keyboard.down("ArrowRight")
    ) {
        mx = 1;
    }


    const speed =
        7 * dt;


    /*
     * Camera-relative movement
     */

    const forwardX =
        -Math.sin(yaw);

    const forwardZ =
        -Math.cos(yaw);

    const rightX =
        Math.cos(yaw);

    const rightZ =
        -Math.sin(yaw);


    player.position.x +=
        (
            forwardX * -mz +
            rightX * mx
        ) * speed;


    player.position.z +=
        (
            forwardZ * -mz +
            rightZ * mx
        ) * speed;


    /*
     * Jump physics
     */

    velocityY -=
        20 * dt;

    player.position.y +=
        velocityY * dt;


    if (
        player.position.y <= 0
    ) {

        player.position.y = 0;

        velocityY = 0;

        grounded = true;
    }


    /*
     * Player direction
     */

    if (
        Math.abs(mx) +
        Math.abs(mz) > .05
    ) {

        player.rotation.y =
            yaw +
            Math.atan2(
                mx,
                -mz
            );
    }


    /*
     * Camera
     */

    const distance = 7;

    const horizontal =
        Math.cos(pitch) *
        distance;


    camera.position.x =
        player.position.x -
        Math.sin(yaw) *
        horizontal;


    camera.position.z =
        player.position.z -
        Math.cos(yaw) *
        horizontal;


    camera.position.y =
        player.position.y +
        3.2 -
        Math.sin(pitch) *
        distance;


    camera.rotation.y =
        yaw;

    camera.rotation.x =
        pitch;


    /*
     * Scan
     */

    if (scanTimer > 0) {

        scanTimer -= dt;

        if (scanTimer <= 0) {

            status.textContent =
                "SCAN COMPLETE — 3 STRUCTURES FOUND";
        }
    }


    renderer.render(
        scene,
        camera
    );


    requestAnimationFrame(
        update
    );
}


/* =========================================================
   RESIZE
========================================================= */

function resize() {

    camera.aspect =
        innerWidth /
        innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        innerWidth,
        innerHeight
    );
}


window.addEventListener(
    "resize",
    resize
);


/* =========================================================
   START
========================================================= */

resize();

status.textContent =
    "TRIZAS ONLINE";

requestAnimationFrame(
    update
);
