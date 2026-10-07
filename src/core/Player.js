import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class Player {

  constructor() {

    this.group =
      new THREE.Group();

    this.velocity =
      new THREE.Vector3();

    this.speed = 5;

    this.jumpPower = 8;

    this.gravity = 20;

    this.grounded = true;

    this.createModel();

  }


  createModel() {

    /*
     * 우주복 몸통
     */

    const suitMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xdfe8f5,
        roughness: 0.7,
        metalness: 0.15
      });


    const darkMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x182236,
        roughness: 0.6,
        metalness: 0.3
      });


    const glassMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x17283e,
        roughness: 0.15,
        metalness: 0.65
      });


    const body =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.38,
          0.65,
          5,
          10
        ),
        suitMaterial
      );

    body.position.y = 1.15;

    this.group.add(body);


    /*
     * 헬멧
     */

    const helmet =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.42,
          16,
          12
        ),
        suitMaterial
      );

    helmet.position.y = 1.82;

    this.group.add(helmet);


    /*
     * 바이저
     */

    const visor =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.32,
          16,
          10,
          0,
          Math.PI * 2,
          0.15,
          Math.PI * 0.65
        ),
        glassMaterial
      );

    visor.position.set(
      0,
      1.84,
      0.27
    );

    visor.scale.set(
      1,
      0.75,
      0.5
    );

    this.group.add(visor);


    /*
     * 백팩
     */

    const backpack =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.55,
          0.75,
          0.25
        ),
        darkMaterial
      );

    backpack.position.set(
      0,
      1.15,
      -0.42
    );

    this.group.add(backpack);


    /*
     * 어깨
     */

    for (
      const side of [-1, 1]
    ) {

      const arm =
        new THREE.Mesh(
          new THREE.CapsuleGeometry(
            0.13,
            0.5,
            4,
            8
          ),
          suitMaterial
        );

      arm.position.set(
        side * 0.48,
        1.2,
        0
      );

      arm.rotation.z =
        side * -0.12;

      this.group.add(arm);

    }


    /*
     * 다리
     */

    for (
      const side of [-1, 1]
    ) {

      const leg =
        new THREE.Mesh(
          new THREE.CapsuleGeometry(
            0.15,
            0.6,
            4,
            8
          ),
          darkMaterial
        );

      leg.position.set(
        side * 0.2,
        0.48,
        0
      );

      this.group.add(leg);

    }


    /*
     * 발
     */

    for (
      const side of [-1, 1]
    ) {

      const boot =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.3,
            0.18,
            0.45
          ),
          darkMaterial
        );

      boot.position.set(
        side * 0.2,
        0.08,
        0.08
      );

      this.group.add(boot);

    }


    this.group.position.y = 0;

  }


  jump() {

    if (!this.grounded) {
      return;
    }

    this.velocity.y =
      this.jumpPower;

    this.grounded = false;

  }

}
