import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class Structures {

  constructor(scene) {

    this.scene = scene;

    this.objects = [];

    this.createShip();

    this.createMonolith();

  }


  createShip() {

    const group =
      new THREE.Group();


    const bodyMaterial =
      new THREE.MeshStandardMaterial({

        color: 0xc8d3df,

        metalness: 0.65,

        roughness: 0.35

      });


    const darkMaterial =
      new THREE.MeshStandardMaterial({

        color: 0x151d2d,

        metalness: 0.7,

        roughness: 0.25

      });


    const body =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          2.4,
          3.2,
          1.2,
          8
        ),

        bodyMaterial

      );


    body.rotation.z =
      Math.PI / 2;

    body.position.y = 1.3;


    group.add(body);


    const cockpit =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          1.2,
          16,
          8
        ),

        darkMaterial

      );


    cockpit.scale.set(
      1.4,
      .55,
      1
    );

    cockpit.position.set(
      2,
      1.7,
      0
    );


    group.add(cockpit);


    for (
      const side of [-1, 1]
    ) {

      const engine =
        new THREE.Mesh(

          new THREE.CylinderGeometry(
            .55,
            .75,
            1.6,
            12
          ),

          darkMaterial

        );


      engine.rotation.z =
        Math.PI / 2;


      engine.position.set(
        -1.4,
        1,
        side * 1.8
      );


      group.add(engine);

    }


    group.position.set(
      5,
      0,
      4
    );


    this.scene.add(group);


    this.objects.push({

      id: "landing-ship",

      name: "착륙선",

      object: group,

      radius: 7

    });

  }


  createMonolith() {

    const group =
      new THREE.Group();


    const material =
      new THREE.MeshStandardMaterial({

        color: 0x161c2d,

        metalness: 0.75,

        roughness: 0.3

      });


    const main =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          2.4,
          7,
          1.3
        ),

        material

      );


    main.position.y = 3.5;


    group.add(main);


    const coreMaterial =
      new THREE.MeshStandardMaterial({

        color: 0x7f9dff,

        emissive: 0x3858ff,

        emissiveIntensity: 4

      });


    const core =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          .35,
          5,
          .15
        ),

        coreMaterial

      );


    core.position.set(
      0,
      3.5,
      .7
    );


    group.add(core);


    group.position.set(
      -28,
      0,
      -34
    );


    group.rotation.y =
      0.25;


    this.scene.add(group);


    this.objects.push({

      id: "alien-monolith",

      name: "고대 외계 구조물",

      object: group,

      radius: 8

    });

  }

}
