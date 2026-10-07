export class ResourceSystem {

  constructor(player, state) {

    this.player = player;

    this.state = state;

    this.timer = 0;

  }


  update(dt) {

    this.timer += dt;


    /*
     * 아주 천천히 산소 감소
     */

    if (
      this.timer > 2
    ) {

      this.timer = 0;

      this.state.consumeOxygen(
        0.08
      );

    }

  }

}
