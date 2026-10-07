import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


import { Input }
  from "./Input.js";

import { ThirdPersonCamera }
  from "./Camera.js";

import { GameState }
  from "./State.js";


import { Player }
  from "../player/Player.js";

import { PlayerController }
  from "../player/PlayerController.js";


import { Planet }
  from "../world/Planet.js";

import { Terrain }
  from "../world/Terrain.js";

import { Rocks }
  from "../world/Rocks.js";

import { Crystals }
  from "../world/Crystals.js";

import { Structures }
  from "../world/Structures.js";


import { ScanSystem }
  from "../systems/ScanSystem.js";

import { ResourceSystem }
  from "../systems/ResourceSystem.js";

import { MissionSystem }
  from "../systems/MissionSystem.js";


import { HUD }
  from "../ui/HUD.js";

import { Joystick }
  from "../ui/Joystick.js";

import { Buttons }
  from "../ui/Buttons.js";


export class Game {

  constructor({
    canvas,
    THREE: Three
  }) {

    this.THREE = Three;

    this.canvas = canvas;

    this.scene =
      new THREE.Scene();


    this.camera =
      new THREE.PerspectiveCamera(
        65,
        window.innerWidth /
        window.innerHeight,
        0.1,
        300
      );


    this.renderer =
      new THREE.WebGLRenderer({

        canvas,

        antialias: true,

        powerPreference:
          "high-performance"

      });


    /*
     * 구형 PC 대응
     */

    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        1.35
      )
    );


    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    this.renderer.outputColorSpace =
      THREE.SRGBColorSpace;


    this.renderer.shadowMap.enabled =
      true;

    this.renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;


    this.clock =
      new THREE.Clock();


    this.state =
      new GameState();


    this.input =
      new Input();


    this.cameraController =
      new ThirdPersonCamera(
        this.camera
      );


    this.hud =
      new HUD(
        this.state
      );


    this.setupResize();

  }


  async start() {

    this.createWorld();

    this.setupControls();

    this.state.running = true;

    this.clock.start();

    this.lastTime =
      performance.now();

    this.loop();

  }


  createWorld() {

    /*
     * 행성 환경
     */

    new Planet(
      this.scene
    );


    new Terrain(
      this.scene
    );


    new Rocks(
      this.scene
    );


    new Crystals(
      this.scene
    );


    /*
     * 플레이어
     */

    this.player =
      new Player();


    this.scene.add(
      this.player.group
    );


    this.player.group.position.set(
      0,
      0,
      0
    );


    /*
     * 구조물
     */

    this.structures =
      new Structures(
        this.scene
      );


    /*
     * 카메라
     */

    this.cameraController.follow(
      this.player.group
    );


    /*
     * 플레이어 컨트롤
     */

    this.playerController =
      new PlayerController(
        this.player,
        this.input,
        this.cameraController
      );


    /*
     * 시스템
     */

    this.scanSystem =
      new ScanSystem(
        this.scene,
        this.player,
        this.structures,
        this.state,
        this.hud
      );


    this.resourceSystem =
      new ResourceSystem(
        this.player,
        this.state
      );


    this.missionSystem =
      new MissionSystem(
        this.state
      );

  }


  setupControls() {

    this.joystick =
      new Joystick(
        this.input
      );


    this.buttons =
      new Buttons(
        this.input
      );

  }


  setupResize() {

    window.addEventListener(
      "resize",
      () => {

        this.camera.aspect =
          window.innerWidth /
          window.innerHeight;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
          window.innerWidth,
          window.innerHeight
        );


        this.renderer.setPixelRatio(
          Math.min(
            window.devicePixelRatio || 1,
            1.35
          )
        );

      }
    );

  }


  update(dt) {

    this.input.update();


    /*
     * 카메라 회전
     */

    const cameraDelta =
      this.input
        .consumeCameraDelta();


    if (
      cameraDelta.x !== 0 ||
      cameraDelta.y !== 0
    ) {

      this.cameraController.rotate(
        cameraDelta.x,
        cameraDelta.y
      );

    }


    /*
     * 플레이어
     */

    this.playerController.update(
      dt
    );


    /*
     * 스캔
     */

    if (
      this.input.consumeScan()
    ) {

      this.scanSystem.scan();

    }


    /*
     * 시스템
     */

    this.resourceSystem.update(
      dt
    );


    this.scanSystem.update(
      dt
    );


    /*
     * 카메라
     */

    this.cameraController.update(
      dt
    );


    /*
     * HUD
     */

    this.hud.update(
      dt
    );


    /*
     * 플레이어 상태
     */

    this.state.player.x =
      this.player.group.position.x;

    this.state.player.y =
      this.player.group.position.y;

    this.state.player.z =
      this.player.group.position.z;

  }


  render() {

    this.renderer.render(
      this.scene,
      this.camera
    );

  }


  loop() {

    if (
      !this.state.running
    ) {
      return;
    }


    requestAnimationFrame(
      () => this.loop()
    );


    /*
     * 너무 큰 dt 방지
     */

    const dt =
      Math.min(
        this.clock.getDelta(),
        0.05
      );


    this.update(dt);

    this.render();

  }

}
