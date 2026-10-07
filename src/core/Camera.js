import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class ThirdPersonCamera {

  constructor(camera) {

    this.camera = camera;

    this.target = null;

    this.yaw = 0;

    this.pitch = 0.35;

    this.distance = 6;

    this.minDistance = 3.5;

    this.maxDistance = 9;

    this.height = 1.8;

    this.sensitivity = 0.004;

    this.position = new THREE.Vector3();

    this.lookTarget =
      new THREE.Vector3();

  }


  follow(object) {

    this.target = object;

  }


  rotate(dx, dy) {

    this.yaw -=
      dx * this.sensitivity;

    this.pitch -=
      dy * this.sensitivity;


    this.pitch = THREE.MathUtils.clamp(
      this.pitch,
      -0.15,
      1.15
    );

  }


  update(dt) {

    if (!this.target) {
      return;
    }


    const targetPosition =
      this.target.position;


    const cosPitch =
      Math.cos(this.pitch);

    const sinPitch =
      Math.sin(this.pitch);


    const sinYaw =
      Math.sin(this.yaw);

    const cosYaw =
      Math.cos(this.yaw);


    const offset = new THREE.Vector3(

      sinYaw *
      cosPitch *
      this.distance,

      sinPitch *
      this.distance +
      this.height,

      cosYaw *
      cosPitch *
      this.distance

    );


    const desired =
      targetPosition
        .clone()
        .add(offset);


    const smoothing =
      1 -
      Math.pow(
        0.001,
        dt
      );


    this.position.lerp(
      desired,
      smoothing
    );


    this.camera.position.copy(
      this.position
    );


    this.lookTarget.copy(
      targetPosition
    );

    this.lookTarget.y += 1.1;


    this.camera.lookAt(
      this.lookTarget
    );

  }


  getForwardDirection() {

    const direction =
      new THREE.Vector3();

    this.camera.getWorldDirection(
      direction
    );


    direction.y = 0;

    direction.normalize();

    return direction;

  }


  getRightDirection() {

    const forward =
      this.getForwardDirection();

    const right =
      new THREE.Vector3();

    right.crossVectors(
      forward,
      new THREE.Vector3(0, 1, 0)
    );

    right.normalize();

    return right;

  }

}
