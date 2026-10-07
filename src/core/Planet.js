import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class Planet {

  constructor(scene) {

    this.scene = scene;

    this.createSky();

    this.createLights();

    this.createStars();

  }


  createSky() {

    const geometry =
      new THREE.SphereGeometry(
        140,
        32,
        20
      );


    const material =
      new THREE.MeshBasicMaterial({

        color: 0x050914,

        side:
          THREE.BackSide

      });


    const sky =
      new THREE.Mesh(
        geometry,
        material
      );


    this.scene.add(
      sky
    );

  }


  createLights() {

    const hemi =
      new THREE.HemisphereLight(
        0x9bb9ff,
        0x142018,
        1.7
      );


    this.scene.add(
      hemi
    );


    const sun =
      new THREE.DirectionalLight(
        0xcad9ff,
        2.2
      );


    sun.position.set(
      -30,
      60,
      20
    );


    sun.castShadow = true;

    sun.shadow.mapSize.set(
      1024,
      1024
    );


    this.scene.add(
      sun
    );

  }


  createStars() {

    const geometry =
      new THREE.BufferGeometry();


    const count = 1800;

    const positions =
      new Float32Array(
        count * 3
      );


    for (
      let i = 0;
      i < count * 3;
      i += 3
    ) {

      const radius =
        100 +
        Math.random() * 50;


      const theta =
        Math.random() *
        Math.PI *
        2;

      const phi =
        Math.acos(
          2 * Math.random() - 1
        );


      positions[i] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      positions[i + 1] =
        radius *
        Math.cos(phi);

      positions[i + 2] =
        radius *
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


    const material =
      new THREE.PointsMaterial({

        color: 0xffffff,

        size: .12,

        sizeAttenuation: true

      });


    const stars =
      new THREE.Points(
        geometry,
        material
      );


    this.scene.add(
      stars
    );

  }

}
