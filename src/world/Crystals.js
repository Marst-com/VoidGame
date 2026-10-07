import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class Crystals {

  constructor(scene) {

    this.scene = scene;

    this.group =
      new THREE.Group();

    scene.add(
      this.group
    );

    this.create();

  }


  create() {

    const material =
      new THREE.MeshStandardMaterial({

        color: 0x6c8cff,

        emissive: 0x243b9a,

        emissiveIntensity: 1.8,

        roughness: 0.3,

        metalness: 0.2

      });


    for (
      let i = 0;
      i < 45;
      i++
    ) {

      const crystal =
        new THREE.Mesh(

          new THREE.OctahedronGeometry(
            0.25 +
            Math.random() * 0.5
          ),

          material

        );


      const angle =
        Math.random() *
        Math.PI *
        2;

      const radius =
        8 +
        Math.random() *
        75;


      crystal.position.set(

        Math.cos(angle) *
        radius,

        0.5,

        Math.sin(angle) *
        radius

      );


      crystal.scale.y =
        1.5 +
        Math.random() * 2;


      crystal.rotation.y =
        Math.random() *
        Math.PI;


      this.group.add(
        crystal
      );

    }

  }

}
