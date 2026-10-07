import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =====================================================
   GAME
===================================================== */

class Game {

  constructor() {

    this.canvas =
      document.getElementById(
        "gameCanvas"
      );

    this.scene =
      new THREE.Scene();

    this.camera =
      new THREE.PerspectiveCamera(
        65,
        innerWidth / innerHeight,
        .1,
        500
      );


    this.renderer =
      new THREE.WebGLRenderer({

        canvas: this.canvas,

        antialias: true,

        powerPreference:
          "high-performance"

      });


    this.renderer.setPixelRatio(
      Math.min(
        devicePixelRatio,
        1.4
      )
    );

    this.renderer.setSize(
      innerWidth,
      innerHeight
    );

    this.renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    this.renderer.shadowMap.enabled =
      true;


    this.clock =
      new THREE.Clock();


    this.input =
      new Input();


    this.player =
      new Player(
        this.scene
      );


    this.cameraSystem =
      new CameraSystem(
        this.camera,
        this.player.group
      );


    this.structures =
      new Structures(
        this.scene
      );


    this.scanSystem =
      new ScanSystem(
        this
      );


    this.mission =
      new MissionSystem();


    this.hud =
      new HUD();


    this.setupWorld();

    this.setupEvents();

  }


  setupWorld() {

    this.createSky();

    this.createLighting();

    this.createTerrain();

    this.createRocks();

    this.createCrystals();

    this.structures.create();

  }


  createSky() {

    const sky =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          250,
          32,
          20
        ),

        new THREE.MeshBasicMaterial({

          color: 0x050914,

          side:
            THREE.BackSide

        })

      );

    this.scene.add(sky);


    /*
     * 별
     */

    const geometry =
      new THREE.BufferGeometry();

    const count = 1400;

    const positions =
      new Float32Array(
        count * 3
      );


    for (
      let i = 0;
      i < count * 3;
      i += 3
    ) {

      const r =
        130 +
        Math.random() * 90;

      const theta =
        Math.random() *
        Math.PI * 2;

      const phi =
        Math.acos(
          2 * Math.random() - 1
        );


      positions[i] =
        r *
        Math.sin(phi) *
        Math.cos(theta);

      positions[i + 1] =
        r *
        Math.cos(phi);

      positions[i + 2] =
        r *
        Math.sin(phi) *
        Math.sin(theta);

    }


    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );


    const stars =
      new THREE.Points(

        geometry,

        new THREE.PointsMaterial({
          color: 0xffffff,
          size: .16
        })

      );


    this.scene.add(stars);

  }


  createLighting() {

    this.scene.add(
      new THREE.HemisphereLight(
        0x9bbcff,
        0x172019,
        1.7
      )
    );


    const sun =
      new THREE.DirectionalLight(
        0xcbdcff,
        2.4
      );


    sun.position.set(
      -40,
      70,
      30
    );


    sun.castShadow = true;

    sun.shadow.mapSize.set(
      1024,
      1024
    );


    this.scene.add(sun);

  }


  createTerrain() {

    const size = 180;

    const geometry =
      new THREE.PlaneGeometry(
        size,
        size,
        80,
        80
      );


    const p =
      geometry.attributes.position;


    for (
      let i = 0;
      i < p.count;
      i++
    ) {

      const x =
        p.getX(i);

      const y =
        p.getY(i);


      const height =

        Math.sin(x * .08) *
        Math.cos(y * .07) *
        1.4

        +

        Math.sin(
          x * .25 +
          y * .16
        ) * .35

        +

        Math.cos(
          y * .4
        ) * .12;


      p.setZ(
        i,
        height
      );

    }


    geometry.computeVertexNormals();


    const material =
      new THREE.MeshStandardMaterial({

        color: 0x1a2b2d,

        roughness: .96,

        metalness: .04

      });


    const terrain =
      new THREE.Mesh(
        geometry,
        material
      );


    terrain.rotation.x =
      -Math.PI / 2;


    terrain.receiveShadow = true;


    this.scene.add(
      terrain
    );

  }


  createRocks() {

    const group =
      new THREE.Group();

    this.scene.add(group);


    const material =
      new THREE.MeshStandardMaterial({

        color: 0x465255,

        roughness: 1

      });


    for (
      let i = 0;
      i < 100;
      i++
    ) {

      const rock =
        new THREE.Mesh(

          new THREE.DodecahedronGeometry(
            .35 +
            Math.random() * 1.5,
            0
          ),

          material

        );


      const angle =
        Math.random() *
        Math.PI * 2;

      const radius =
        10 +
        Math.random() * 75;


      rock.position.set(

        Math.cos(angle) *
        radius,

        .3,

        Math.sin(angle) *
        radius

      );


      rock.rotation.set(

        Math.random(),
        Math.random(),
        Math.random()

      );


      rock.scale.y =
        .5 +
        Math.random();


      group.add(rock);

    }

  }


  createCrystals() {

    const group =
      new THREE.Group();

    this.scene.add(group);


    const material =
      new THREE.MeshStandardMaterial({

        color: 0x7795ff,

        emissive: 0x293d9e,

        emissiveIntensity: 2,

        metalness: .25,

        roughness: .3

      });


    for (
      let i = 0;
      i < 55;
      i++
    ) {

      const crystal =
        new THREE.Mesh(

          new THREE.OctahedronGeometry(
            .25 +
            Math.random() * .55
          ),

          material

        );


      const angle =
        Math.random() *
        Math.PI * 2;

      const radius =
        8 +
        Math.random() * 78;


      crystal.position.set(

        Math.cos(angle) *
        radius,

        .6,

        Math.sin(angle) *
        radius

      );


      crystal.scale.y =
        1.5 +
        Math.random() * 2;


      crystal.rotation.y =
        Math.random() *
        Math.PI;


      group.add(crystal);

    }

  }


  setupEvents() {

    addEventListener(
      "resize",
      () => {

        this.camera.aspect =
          innerWidth /
          innerHeight;

        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
          innerWidth,
          innerHeight
        );

        this.renderer.setPixelRatio(
          Math.min(
            devicePixelRatio,
            1.4
          )
        );

      }
    );


    document
      .getElementById("jump")
      .addEventListener(
        "pointerdown",
        e => {

          e.preventDefault();

          this.input.jump =
            true;

        }
      );


    document
      .getElementById("scan")
      .addEventListener(
        "pointerdown",
        e => {

          e.preventDefault();

          this.input.scan =
            true;

        }
      );

  }


  start() {

    document
      .getElementById("startScreen")
      .style.display = "none";


    document
      .getElementById("game")
      .style.display = "block";


    this.clock.start();

    this.loop();

  }


  update(dt) {

    this.input.update();


    /*
     * 카메라 회전
     */

    const cameraDelta =
      this.input.cameraDelta;

    this.cameraSystem.rotate(
      cameraDelta.x,
      cameraDelta.y
    );


    this.input.cameraDelta.x = 0;
    this.input.cameraDelta.y = 0;


    /*
     * 플레이어
     */

    this.player.update(
      dt,
      this.input,
      this.cameraSystem
    );


    /*
     * 점프
     */

    if (
      this.input.jump
    ) {

      this.player.jump();

      this.input.jump =
        false;

    }


    /*
     * 스캔
     */

    if (
      this.input.scan
    ) {

      this.scanSystem.scan();

      this.input.scan =
        false;

    }


    this.cameraSystem.update(
      dt
    );


    this.scanSystem.update(
      dt
    );


    this.hud.update(
      this
    );

  }


  loop() {

    requestAnimationFrame(
      () => this.loop()
    );


    const dt =
      Math.min(
        this.clock.getDelta(),
        .05
      );


    this.update(dt);

    this.renderer.render(
      this.scene,
      this.camera
    );

  }

}


/* =====================================================
   INPUT
===================================================== */

class Input {

  constructor() {

    this.keys =
      new Set();

    this.moveX = 0;
    this.moveY = 0;

    this.joyX = 0;
    this.joyY = 0;

    this.jump = false;
    this.scan = false;

    this.cameraDelta = {
      x: 0,
      y: 0
    };


    this.cameraPointer =
      null;


    addEventListener(
      "keydown",
      e => {

        this.keys.add(e.code);

        if (
          e.code === "Space"
        ) {
          this.jump = true;
        }

        if (
          e.code === "KeyE"
        ) {
          this.scan = true;
        }

      }
    );


    addEventListener(
      "keyup",
      e => {

        this.keys.delete(
          e.code
        );

      }
    );


    this.setupCamera();

    this.setupJoystick();

  }


  setupCamera() {

    const canvas =
      document.getElementById(
        "gameCanvas"
      );


    canvas.addEventListener(
      "pointerdown",
      e => {

        /*
         * 조이스틱 영역 제외
         */

        if (
          e.clientX < 190 &&
          e.clientY >
          innerHeight - 190
        ) {
          return;
        }


        /*
         * 액션 버튼 영역 제외
         */

        if (
          e.clientX >
          innerWidth - 180 &&
          e.clientY >
          innerHeight - 230
        ) {
          return;
        }


        this.cameraPointer =
          e.pointerId;


        canvas.setPointerCapture(
          e.pointerId
        );

      }
    );


    canvas.addEventListener(
      "pointermove",
      e => {

        if (
          e.pointerId !==
          this.cameraPointer
        ) {
          return;
        }


        this.cameraDelta.x +=
          e.movementX;

        this.cameraDelta.y +=
          e.movementY;

      }
    );


    const release =
      e => {

        if (
          e.pointerId ===
          this.cameraPointer
        ) {

          this.cameraPointer =
            null;

        }

      };


    canvas.addEventListener(
      "pointerup",
      release
    );

    canvas.addEventListener(
      "pointercancel",
      release
    );

  }


  setupJoystick() {

    const zone =
      document.getElementById(
        "joystick"
      );

    const base =
      document.getElementById(
        "joyBase"
      );

    const stick =
      document.getElementById(
        "joyStick"
      );


    let pointer = null;

    const radius = 48;


    zone.addEventListener(
      "pointerdown",
      e => {

        e.preventDefault();

        pointer =
          e.pointerId;

        zone.setPointerCapture(
          pointer
        );

        move(e);

      }
    );


    zone.addEventListener(
      "pointermove",
      e => {

        if (
          e.pointerId === pointer
        ) {

          move(e);

        }

      }
    );


    const release =
      e => {

        if (
          e.pointerId !== pointer
        ) {
          return;
        }

        pointer = null;

        this.joyX = 0;
        this.joyY = 0;

        stick.style.transform =
          "translate(0px,0px)";

      };


    zone.addEventListener(
      "pointerup",
      release
    );

    zone.addEventListener(
      "pointercancel",
      release
    );


    const move =
      e => {

        const rect =
          base.getBoundingClientRect();


        const cx =
          rect.left +
          rect.width / 2;

        const cy =
          rect.top +
          rect.height / 2;


        let x =
          e.clientX - cx;

        let y =
          e.clientY - cy;


        const distance =
          Math.hypot(x, y);


        if (
          distance > radius
        ) {

          x =
            x / distance *
            radius;

          y =
            y / distance *
            radius;

        }


        this.joyX =
          x / radius;

        this.joyY =
          -y / radius;


        stick.style.transform =
          `translate(${x}px,${y}px)`;

      };

  }


  update() {

    let x =
      this.joyX;

    let y =
      this.joyY;


    if (
      this.keys.has("KeyA") ||
      this.keys.has("ArrowLeft")
    ) {
      x -= 1;
    }

    if (
      this.keys.has("KeyD") ||
      this.keys.has("ArrowRight")
    ) {
      x += 1;
    }

    if (
      this.keys.has("KeyW") ||
      this.keys.has("ArrowUp")
    ) {
      y += 1;
    }

    if (
      this.keys.has("KeyS") ||
      this.keys.has("ArrowDown")
    ) {
      y -= 1;
    }


    const length =
      Math.hypot(x, y);


    if (
      length > 1
    ) {

      x /= length;
      y /= length;

    }


    this.moveX = x;
    this.moveY = y;

  }

}


/* =====================================================
   PLAYER
===================================================== */

class Player {

  constructor(scene) {

    this.group =
      new THREE.Group();

    scene.add(
      this.group
    );


    this.velocity =
      new THREE.Vector3();


    this.speed = 5;

    this.jumpPower = 8;

    this.gravity = 21;

    this.grounded = true;


    this.createModel();

  }


  createModel() {

    const suit =
      new THREE.MeshStandardMaterial({
        color: 0xe3e9f2,
        roughness: .65
      });


    const dark =
      new THREE.MeshStandardMaterial({
        color: 0x182236,
        metalness: .5,
        roughness: .35
      });


    const glass =
      new THREE.MeshStandardMaterial({
        color: 0x19304b,
        metalness: .7,
        roughness: .15,
        emissive: 0x071528
      });


    const body =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          .38,
          .7,
          5,
          10
        ),
        suit
      );

    body.position.y =
      1.15;

    body.castShadow = true;

    this.group.add(body);


    const helmet =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .43,
          16,
          12
        ),
        suit
      );

    helmet.position.y =
      1.82;

    helmet.castShadow = true;

    this.group.add(helmet);


    const visor =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .32,
          16,
          10
        ),
        glass
      );

    visor.scale.set(
      1,
      .72,
      .5
    );

    visor.position.set(
      0,
      1.83,
      .27
    );

    this.group.add(visor);


    const backpack =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .55,
          .75,
          .25
        ),
        dark
      );

    backpack.position.set(
      0,
      1.15,
      -.42
    );

    this.group.add(backpack);


    for (
      const side of [-1, 1]
    ) {

      const arm =
        new THREE.Mesh(
          new THREE.CapsuleGeometry(
            .13,
            .55,
            4,
            8
          ),
          suit
        );

      arm.position.set(
        side * .48,
        1.18,
        0
      );

      arm.rotation.z =
        side * -.1;

      this.group.add(arm);


      const leg =
        new THREE.Mesh(
          new THREE.CapsuleGeometry(
            .15,
            .65,
            4,
            8
          ),
          dark
        );

      leg.position.set(
        side * .2,
        .48,
        0
      );

      this.group.add(leg);


      const boot =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .3,
            .18,
            .45
          ),
          dark
        );

      boot.position.set(
        side * .2,
        .08,
        .08
      );

      this.group.add(boot);

    }

  }


  jump() {

    if (
      !this.grounded
    ) {
      return;
    }

    this.velocity.y =
      this.jumpPower;

    this.grounded =
      false;

  }


  update(
    dt,
    input,
    camera
  ) {

    const forward =
      camera.forward();

    const right =
      camera.right();


    const movement =
      new THREE.Vector3();


    movement.addScaledVector(
      forward,
      input.moveY
    );


    movement.addScaledVector(
      right,
      input.moveX
    );


    if (
      movement.lengthSq() >
      .001
    ) {

      movement.normalize();


      const target =
        Math.atan2(
          movement.x,
          movement.z
        );


      let diff =
        target -
        this.group.rotation.y;


      while (
        diff > Math.PI
      ) {
        diff -=
          Math.PI * 2;
      }


      while (
        diff < -Math.PI
      ) {
        diff +=
          Math.PI * 2;
      }


      this.group.rotation.y +=
        diff *
        Math.min(
          1,
          dt * 10
        );

    }


    this.group.position.addScaledVector(
      movement,
      this.speed * dt
    );


    this.velocity.y -=
      this.gravity * dt;


    this.group.position.y +=
      this.velocity.y * dt;


    if (
      this.group.position.y <= 0
    ) {

      this.group.position.y = 0;

      this.velocity.y = 0;

      this.grounded = true;

    }

  }

}


/* =====================================================
   CAMERA
===================================================== */

class CameraSystem {

  constructor(
    camera,
    target
  ) {

    this.camera =
      camera;

    this.target =
      target;


    this.yaw = 0;

    this.pitch = .32;

    this.distance = 7;

    this.height = 1.5;

  }


  rotate(
    x,
    y
  ) {

    this.yaw -=
      x * .004;

    this.pitch -=
      y * .004;


    this.pitch =
      THREE.MathUtils.clamp(
        this.pitch,
        -.15,
        1.15
      );

  }


  update(dt) {

    const cp =
      Math.cos(this.pitch);

    const sp =
      Math.sin(this.pitch);

    const sy =
      Math.sin(this.yaw);

    const cy =
      Math.cos(this.yaw);


    const desired =
      new THREE.Vector3(

        this.target.position.x +
        sy * cp *
        this.distance,

        this.target.position.y +
        sp * this.distance +
        this.height,

        this.target.position.z +
        cy * cp *
        this.distance

      );


    const smooth =
      1 -
      Math.pow(
        .001,
        dt
      );


    this.camera.position.lerp(
      desired,
      smooth
    );


    const look =
      this.target.position.clone();

    look.y += 1.1;


    this.camera.lookAt(
      look
    );

  }


  forward() {

    const direction =
      new THREE.Vector3();

    this.camera.getWorldDirection(
      direction
    );

    direction.y = 0;

    direction.normalize();

    return direction;

  }


  right() {

    const forward =
      this.forward();

    const right =
      new THREE.Vector3();

    right.crossVectors(
      forward,
      new THREE.Vector3(
        0,
        1,
        0
      )
    );

    return right.normalize();

  }

}


/* =====================================================
   BUILDINGS / STRUCTURES
===================================================== */

class Structures {

  constructor(scene) {

    this.scene =
      scene;

    this.objects = [];

  }


  create() {

    this.createLandingShip();

    this.createResearchBase();

    this.createAlienRuins();

    this.createTower();

  }


  material(
    color,
    metalness = .3,
    roughness = .6
  ) {

    return new THREE.MeshStandardMaterial({

      color,

      metalness,

      roughness

    });

  }


  createLandingShip() {

    const group =
      new THREE.Group();


    const white =
      this.material(
        0xd4deea,
        .65,
        .3
      );


    const dark =
      this.material(
        0x121b2a,
        .75,
        .25
      );


    const blue =
      this.material(
        0x547dff,
        .6,
        .2
      );


    /*
     * 중앙 선체
     */

    const body =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          2.4,
          3.1,
          1.4,
          8
        ),
        white
      );

    body.rotation.z =
      Math.PI / 2;

    body.position.y =
      1.5;

    body.castShadow = true;

    group.add(body);


    /*
     * 조종석
     */

    const cockpit =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          1.2,
          20,
          12
        ),
        dark
      );

    cockpit.scale.set(
      1.35,
      .55,
      1
    );

    cockpit.position.set(
      2,
      1.9,
      0
    );

    group.add(cockpit);


    /*
     * 엔진
     */

    for (
      const z of [-1, 1]
    ) {

      const engine =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            .55,
            .8,
            2,
            12
          ),
          dark
        );

      engine.rotation.z =
        Math.PI / 2;

      engine.position.set(
        -1.5,
        1.1,
        z * 2
      );

      group.add(engine);


      const glow =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            .28,
            .4,
            .08,
            16
          ),
          blue
        );

      glow.rotation.z =
        Math.PI / 2;

      glow.position.set(
        -2.52,
        1.1,
        z * 2
      );

      group.add(glow);

    }


    /*
     * 착륙 다리
     */

    for (
      const x of [-1.7, 1.7]
    ) {

      for (
        const z of [-1, 1]
      ) {

        const leg =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              .1,
              .15,
              1.8,
              8
            ),
            dark
          );

        leg.position.set(
          x,
          .6,
          z
        );

        leg.rotation.z =
          x > 0 ? -.3 : .3;

        group.add(leg);

      }

    }


    group.position.set(
      7,
      0,
      5
    );


    this.scene.add(group);


    this.objects.push({

      id: "ship",

      name: "ASTERIA 착륙선",

      object: group,

      radius: 9

    });

  }


  createResearchBase() {

    const group =
      new THREE.Group();


    const wall =
      this.material(
        0x6d7885,
        .5,
        .6
      );


    const dark =
      this.material(
        0x172033,
        .7,
        .3
      );


    const glass =
      this.material(
        0x315b78,
        .6,
        .15
      );


    /*
     * 본체
     */

    const base =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          8,
          2.5,
          6
        ),
        wall
      );

    base.position.y =
      1.25;

    base.castShadow = true;

    group.add(base);


    /*
     * 중앙 돔
     */

    const dome =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          3,
          20,
          12,
          0,
          Math.PI * 2,
          0,
          Math.PI / 2
        ),
        glass
      );

    dome.position.y =
      2.5;

    group.add(dome);


    /*
     * 지붕 장비
     */

    const antenna =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          .12,
          .12,
          4,
          8
        ),
        dark
      );

    antenna.position.y =
      5;

    group.add(antenna);


    const dish =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          1.2,
          .5,
          20,
          1,
          true
        ),
        dark
      );

    dish.position.y =
      4.5;

    dish.rotation.x =
      Math.PI;

    group.add(dish);


    /*
     * 출입문
     */

    const door =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.5,
          2,
          .15
        ),
        dark
      );

    door.position.set(
      0,
      1,
      3.05
    );

    group.add(door);


    /*
     * 창문
     */

    for (
      const x of [-2.6, -1, 1, 2.6]
    ) {

      const window =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .65,
            .7,
            .12
          ),
          glass
        );

      window.position.set(
        x,
        1.5,
        3.08
      );

      group.add(window);

    }


    group.position.set(
      24,
      0,
      -8
    );


    this.scene.add(group);


    this.objects.push({

      id: "research-base",

      name: "ASTERIA 연구 기지",

      object: group,

      radius: 11

    });

  }


  createAlienRuins() {

    const group =
      new THREE.Group();


    const stone =
      this.material(
        0x252b3a,
        .7,
        .35
      );


    const glow =
      this.material(
        0x735cff,
        .4,
        .25
      );

    glow.emissive.setHex(
      0x3920b8
    );

    glow.emissiveIntensity = 3;


    /*
     * 중앙 거대 구조물
     */

    const center =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          3,
          9,
          3
        ),
        stone
      );

    center.position.y =
      4.5;

    center.rotation.y =
      .3;

    center.castShadow = true;

    group.add(center);


    /*
     * 빛나는 코어
     */

    const core =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .45,
          7,
          .25
        ),
        glow
      );

    core.position.set(
      0,
      4.5,
      1.6
    );

    group.add(core);


    /*
     * 주변 기둥 8개
     */

    for (
      let i = 0;
      i < 8;
      i++
    ) {

      const angle =
        i / 8 *
        Math.PI * 2;


      const radius = 8;


      const pillar =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            1.4,
            5 +
            Math.random() * 3,
            1.4
          ),
          stone
        );


      pillar.position.set(

        Math.cos(angle) *
        radius,

        pillar.geometry.parameters.height / 2,

        Math.sin(angle) *
        radius

      );


      pillar.rotation.y =
        Math.random();


      group.add(pillar);

    }


    group.position.set(
      -30,
      0,
      -32
    );


    this.scene.add(group);


    this.objects.push({

      id: "alien-ruins",

      name: "고대 외계 유적",

      object: group,

      radius: 13

    });

  }


  createTower() {

    const group =
      new THREE.Group();


    const metal =
      this.material(
        0x394655,
        .8,
        .3
      );


    const light =
      this.material(
        0x64a2ff,
        .5,
        .2
      );

    light.emissive.setHex(
      0x164aaf
    );

    light.emissiveIntensity = 4;


    /*
     * 타워
     */

    const tower =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          1.2,
          2,
          10,
          8
        ),
        metal
      );

    tower.position.y =
      5;

    group.add(tower);


    /*
     * 상단 링
     */

    const ring =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          2,
          .18,
          8,
          24
        ),
        light
      );

    ring.position.y =
      8;

    ring.rotation.x =
      Math.PI / 2;

    group.add(ring);


    /*
     * 빛
     */

    const beacon =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .5,
          12,
          8
        ),
        light
      );

    beacon.position.y =
      10.3;

    group.add(beacon);


    group.position.set(
      15,
      0,
      30
    );


    this.scene.add(group);


    this.objects.push({

      id: "beacon",

      name: "행성 통신 타워",

      object: group,

      radius: 8

    });

  }

}


/* =====================================================
   SCAN
===================================================== */

class ScanSystem {

  constructor(game) {

    this.game =
      game;

    this.ring =
      null;

    this.createRing();

  }


  createRing() {

    const geometry =
      new THREE.RingGeometry(
        .5,
        .62,
        64
      );


    const material =
      new THREE.MeshBasicMaterial({

        color: 0x87a8ff,

        transparent: true,

        opacity: 0,

        side:
          THREE.DoubleSide

      });


    this.ring =
      new THREE.Mesh(
        geometry,
        material
      );


    this.ring.rotation.x =
      -Math.PI / 2;

    this.ring.position.y =
      .08;


    this.game.scene.add(
      this.ring
    );

  }


  scan() {

    const player =
      this.game.player.group;


    this.ring.position.set(
      player.position.x,
      .08,
      player.position.z
    );


    this.ring.scale.set(
      1,
      1,
      1
    );


    this.ring.material.opacity =
      .85;


    const scanText =
      document.getElementById(
        "scanText"
      );


    scanText.classList.add(
      "show"
    );


    setTimeout(
      () => {
        scanText.classList.remove(
          "show"
        );
      },
      500
    );


    let nearest = null;

    let distance =
      Infinity;


    for (
      const object
      of this.game.structures.objects
    ) {

      const d =
        player.position.distanceTo(
          object.object.position
        );


      if (
        d < distance
      ) {

        distance = d;

        nearest = object;

      }

    }


    if (
      nearest &&
      distance <
      nearest.radius
    ) {

      this.discover(
        nearest
      );

    }

  }


  discover(object) {

    const element =
      document.getElementById(
        "discovery"
      );


    const name =
      document.getElementById(
        "discoveryName"
      );


    name.textContent =
      object.name;


    element.classList.add(
      "show"
    );


    clearTimeout(
      this.discoveryTimer
    );


    this.discoveryTimer =
      setTimeout(
        () => {

          element.classList.remove(
            "show"
          );

        },
        3500
      );


    if (
      object.id === "ship"
    ) {

      this.game.mission =
        "고대 구조물을 찾아라";

      document.getElementById(
        "mission"
      ).textContent =
        this.game.mission;

    }


    if (
      object.id ===
      "alien-ruins"
    ) {

      this.game.mission =
        "행성의 비밀을 밝혀라";

      document.getElementById(
        "mission"
      ).textContent =
        this.game.mission;

    }

  }


  update(dt) {

    if (
      this.ring.material.opacity <= 0
    ) {
      return;
    }


    const scale =
      this.ring.scale.x +
      dt * 12;


    this.ring.scale.set(
      scale,
      scale,
      scale
    );


    this.ring.material.opacity -=
      dt * 1.5;

  }

}


/* =====================================================
   HUD
===================================================== */

class HUD {

  constructor() {

    this.hp = 100;
    this.oxygen = 100;
    this.battery = 100;

    this.minerals = 0;

  }


  update(game) {

    this.oxygen -=
      .015;


    this.battery -=
      .006;


    this.oxygen =
      Math.max(
        0,
        this.oxygen
      );


    this.battery =
      Math.max(
        0,
        this.battery
      );


    document.getElementById(
      "hp"
    ).style.width =
      `${this.hp}%`;


    document.getElementById(
      "oxygen"
    ).style.width =
      `${this.oxygen}%`;


    document.getElementById(
      "battery"
    ).style.width =
      `${this.battery}%`;


    document.getElementById(
      "mineralCount"
    ).textContent =
      this.minerals;


    /*
     * 미니맵 플레이어
     */

    const player =
      game.player.group.position;


    const mapPlayer =
      document.getElementById(
        "mapPlayer"
      );


    const mapX =
      50 +
      player.x / 2;

    const mapY =
      50 +
      player.z / 2;


    mapPlayer.style.left =
      `${Math.max(
        5,
        Math.min(
          95,
          mapX
        )
      )}%`;


    mapPlayer.style.top =
      `${Math.max(
        5,
        Math.min(
          95,
          mapY
        )
      )}%`;

  }

}


/* =====================================================
   START
===================================================== */

const game =
  new Game();


document
  .getElementById(
    "startButton"
  )
  .addEventListener(
    "click",
    () => {

      game.start();

    }
  );
