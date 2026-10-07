import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class Rocks {

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

        color: 0x3c4a4e,

        roughness: 1

      });


    for (
      let i = 0;
      i < 75;
      i++
    ) {

      const rock =
        new THREE.Mesh(

          new THREE.DodecahedronGeometry(
            0.4 +
            Math.random() * 1.4,
            0
          ),

          material

        );


      const angle =
        Math.random() *
        Math.PI *
        2;

      const radius =
        10 +
        Math.random() *
        70;


      rock.position.set(

        Math.cos(angle) *
        radius,

        0.3,

        Math.sin(angle) *
        radius

      );


      rock.scale.y =
        0.5 +
        Math.random() *
        0.9;


      rock.rotation.set(

        Math.random(),
        Math.random(),
        Math.random()

      );


      this.group.add(
        rock
      );

    }

  }

}
