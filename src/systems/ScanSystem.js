import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class ScanSystem {

  constructor(scene, player, structures, state, hud) {

    this.scene = scene;

    this.player = player;

    this.structures = structures;

    this.state = state;

    this.hud = hud;

    this.ring = null;

    this.createRing();

  }


  createRing() {

    const geometry =
      new THREE.RingGeometry(
        0.5,
        0.58,
        64
      );


    const material =
      new THREE.MeshBasicMaterial({

        color: 0x8ba8ff,

        transparent: true,

        opacity: 0,

        side: THREE.DoubleSide

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


    this.scene.add(
      this.ring
    );

  }


  scan() {

    const playerPosition =
      this.player.group.position;


    this.ring.position.set(
      playerPosition.x,
      .08,
      playerPosition.z
    );


    this.ring.scale.set(
      1,
      1,
      1
    );


    this.ring.material.opacity =
      .8;


    this.hud.showScan();


    let nearest = null;

    let nearestDistance =
      Infinity;


    for (
      const structure
      of this.structures.objects
    ) {

      const distance =
        playerPosition.distanceTo(
          structure.object.position
        );


      if (
        distance <
        nearestDistance
      ) {

        nearestDistance =
          distance;

        nearest =
          structure;

      }

    }


    if (
      nearest &&
      nearestDistance <
      nearest.radius
    ) {

      if (
        this.state.discover(
          nearest.id
        )
      ) {

        this.hud.showDiscovery(
          nearest.name
        );


        if (
          nearest.id ===
          "landing-ship"
        ) {

          this.state.missions.scannedShip =
            true;

        }


        if (
          nearest.id ===
          "alien-monolith"
        ) {

          this.state.missions.discoveredRuins =
            true;

        }

      }

    }

  }


  update(dt) {

    if (
      this.ring.material.opacity >
      0
    ) {

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

}
