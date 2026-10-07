export class Input {

  constructor() {

    this.moveX = 0;
    this.moveY = 0;

    this.cameraX = 0;
    this.cameraY = 0;

    this.jump = false;
    this.scan = false;

    this.keys = new Set();

    this.joystickX = 0;
    this.joystickY = 0;

    this.cameraPointer = null;

    this.setupKeyboard();

    this.setupCameraInput();

  }


  setupKeyboard() {

    window.addEventListener("keydown", e => {

      this.keys.add(e.code);

      if (
        e.code === "Space" &&
        !e.repeat
      ) {
        this.jump = true;
      }

      if (
        e.code === "KeyE" &&
        !e.repeat
      ) {
        this.scan = true;
      }

    });


    window.addEventListener("keyup", e => {

      this.keys.delete(e.code);

    });

  }


  setupCameraInput() {

    const canvas = document.getElementById(
      "gameCanvas"
    );

    let activePointer = null;

    canvas.addEventListener(
      "pointerdown",
      e => {

        /*
         * 왼쪽 하단은 조이스틱 영역.
         * 이쪽은 카메라 입력으로 사용하지 않는다.
         */

        if (
          e.clientX < 190 &&
          e.clientY > window.innerHeight - 210
        ) {
          return;
        }

        /*
         * 오른쪽 하단은 액션 버튼 영역.
         */

        if (
          e.clientX > window.innerWidth - 180 &&
          e.clientY > window.innerHeight - 230
        ) {
          return;
        }

        activePointer = e.pointerId;

        canvas.setPointerCapture(
          e.pointerId
        );

      }
    );


    canvas.addEventListener(
      "pointermove",
      e => {

        if (
          activePointer !== e.pointerId
        ) {
          return;
        }

        this.cameraX += e.movementX;
        this.cameraY += e.movementY;

      }
    );


    const release = e => {

      if (
        activePointer === e.pointerId
      ) {

        activePointer = null;

      }

    };


    canvas.addEventListener(
      "pointerup",
      release
    );

    canvas.addEventListener(
      "pointercancel",
      release
    );

  }


  setJoystick(x, y) {

    this.joystickX = x;
    this.joystickY = y;

  }


  pressJump() {

    this.jump = true;

  }


  pressScan() {

    this.scan = true;

  }


  consumeJump() {

    const value = this.jump;

    this.jump = false;

    return value;

  }


  consumeScan() {

    const value = this.scan;

    this.scan = false;

    return value;

  }


  update() {

    let x = this.joystickX;
    let y = this.joystickY;


    if (
      this.keys.has("KeyA") ||
      this.keys.has("ArrowLeft")
    ) {
      x -= 1;
    }

    if (
      this.keys.has("KeyD") ||
      this.keys.has("ArrowRight")
    ) {
      x += 1;
    }

    if (
      this.keys.has("KeyW") ||
      this.keys.has("ArrowUp")
    ) {
      y += 1;
    }

    if (
      this.keys.has("KeyS") ||
      this.keys.has("ArrowDown")
    ) {
      y -= 1;
    }


    const length =
      Math.sqrt(
        x * x +
        y * y
      );


    if (length > 1) {

      x /= length;
      y /= length;

    }


    this.moveX = x;
    this.moveY = y;

  }


  consumeCameraDelta() {

    const result = {
      x: this.cameraX,
      y: this.cameraY
    };

    this.cameraX = 0;
    this.cameraY = 0;

    return result;

  }

}
