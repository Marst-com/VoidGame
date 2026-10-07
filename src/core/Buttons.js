export class Buttons {

  constructor(input) {

    this.input = input;

    this.jumpButton =
      document.getElementById(
        "jumpButton"
      );

    this.scanButton =
      document.getElementById(
        "scanButton"
      );

    this.bind();

  }


  bind() {

    this.jumpButton.addEventListener(
      "pointerdown",
      e => {

        e.preventDefault();

        this.input.pressJump();

      }
    );


    this.scanButton.addEventListener(
      "pointerdown",
      e => {

        e.preventDefault();

        this.input.pressScan();

      }
    );

  }

}
