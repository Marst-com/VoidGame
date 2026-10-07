import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class PlayerController {

  constructor(player, input, camera) {

    this.player = player;

    this.input = input;

    this.camera = camera;

    this.moveVector =
      new THREE.Vector3();

  }


  update(dt) {

    const player =
      this.player;


    /*
     * 카메라 기준 이동
     */

    const forward =
      this.camera
        .getForwardDirection();

    const right =
      this.camera
        .getRightDirection();


    this.moveVector.set(0, 0, 0);


    this.moveVector.addScaledVector(
      forward,
      this.input.moveY
    );

    this.moveVector.addScaledVector(
      right,
      this.input.moveX
    );


    if (
      this.moveVector.lengthSq() > 0.001
    ) {

      this.moveVector.normalize();


      const targetRotation =
        Math.atan2(
          this.moveVector.x,
          this.moveVector.z
        );


      let difference =
        targetRotation -
        player.group.rotation.y;


      while (difference > Math.PI) {
        difference -=
          Math.PI * 2;
      }

      while (difference < -Math.PI) {
        difference +=
          Math.PI * 2;
      }


      player.group.rotation.y +=
        difference *
        Math.min(
          1,
          dt * 10
        );

    }


    /*
     * 이동
     */

    player.group.position.addScaledVector(
      this.moveVector,
      player.speed * dt
    );


    /*
     * 점프
     */

    if (
      this.input.consumeJump()
    ) {

      player.jump();

    }


    /*
     * 중력
     */

    player.velocity.y -=
      player.gravity * dt;


    player.group.position.y +=
      player.velocity.y * dt;


    /*
     * 지면
     */

    if (
      player.group.position.y <= 0
    ) {

      player.group.position.y = 0;

      player.velocity.y = 0;

      player.grounded = true;

    }

  }

}
