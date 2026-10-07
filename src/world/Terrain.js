import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class Terrain {

  constructor(scene) {

    this.scene = scene;

    this.size = 180;

    this.create();

  }


  create() {

    const geometry =
      new THREE.PlaneGeometry(
        this.size,
        this.size,
        64,
        64
      );


    const positions =
      geometry.attributes.position;


    for (
      let i = 0;
      i < positions.count;
      i++
    ) {

      const x =
        positions.getX(i);

      const y =
        positions.getY(i);


      const wave =
        Math.sin(x * 0.09) *
        Math.cos(y * 0.08) *
        1.2;

      const wave2 =
        Math.sin(x * 0.23 + y * 0.17) *
        0.35;

      const wave3 =
        Math.cos(y * 0.31) *
        0.18;


      positions.setZ(
        i,
        wave +
        wave2 +
        wave3
      );

    }


    geometry.computeVertexNormals();


    const material =
      new THREE.MeshStandardMaterial({

        color: 0x182a2b,

        roughness: 1,

        metalness: 0.05

      });


    this.mesh =
      new THREE.Mesh(
        geometry,
        material
      );


    this.mesh.rotation.x =
      -Math.PI / 2;


    this.mesh.receiveShadow = true;


    this.scene.add(
      this.mesh
    );

  }

}
