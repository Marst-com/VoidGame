export class Joystick {

  constructor(input) {

    this.input = input;

    this.zone =
      document.getElementById(
        "joystick"
      );

    this.base =
      document.getElementById(
        "joystickBase"
      );

    this.stick =
      document.getElementById(
        "joystickStick"
      );

    this.pointerId = null;

    this.radius = 55;

    this.center = {
      x: 0,
      y: 0
    };

    this.bind();

  }


  bind() {

    this.zone.addEventListener(
      "pointerdown",
      e => {

        if (
          this.pointerId !== null
        ) {
          return;
        }

        this.pointerId =
          e.pointerId;

        this.zone.setPointerCapture(
          e.pointerId
        );

        this.update(
          e.clientX,
          e.clientY
        );

      }
    );


    this.zone.addEventListener(
      "pointermove",
      e => {

        if (
          e.pointerId !==
          this.pointerId
        ) {
          return;
        }

        this.update(
          e.clientX,
          e.clientY
        );

      }
    );


    const release = e => {

      if (
        e.pointerId !==
        this.pointerId
      ) {
        return;
      }

      this.pointerId = null;

      this.input.setJoystick(
        0,
        0
      );

      this.reset();

    };


    this.zone.addEventListener(
      "pointerup",
      release
    );

    this.zone.addEventListener(
      "pointercancel",
      release
    );

  }


  update(x, y) {

    const rect =
      this.base.getBoundingClientRect();


    const cx =
      rect.left +
      rect.width / 2;

    const cy =
      rect.top +
      rect.height / 2;


    let dx =
      x - cx;

    let dy =
      y - cy;


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    if (
      distance > this.radius
    ) {

      dx =
        dx /
        distance *
        this.radius;

      dy =
        dy /
        distance *
        this.radius;

    }


    const normalizedX =
      dx / this.radius;

    /*
     * 화면 Y는 아래가 +이므로
     * 게임에서는 위가 +.
     */

    const normalizedY =
      -dy / this.radius;


    this.input.setJoystick(
      normalizedX,
      normalizedY
    );


    this.stick.style.transform =
      `translate(${dx}px, ${dy}px)`;

  }


  reset() {

    this.stick.style.transform =
      "translate(0, 0)";

  }

}
