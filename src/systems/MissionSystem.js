export class MissionSystem {

  constructor(state) {

    this.state = state;

  }


  update() {

    if (
      this.state.missions.discoveredRuins
    ) {

      return "alien";

    }

    if (
      this.state.missions.scannedShip
    ) {

      return "ruins";

    }

    return "ship";

  }

}
