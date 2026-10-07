export class GameState {

  constructor() {

    this.running = false;

    this.player = {
      hp: 100,
      oxygen: 100,
      battery: 100,

      minerals: 0,

      x: 0,
      y: 0,
      z: 0
    };

    this.missions = {
      landing: false,
      scannedShip: false,
      discoveredRuins: false
    };

    this.discoveries = new Set();

  }


  discover(id) {

    if (this.discoveries.has(id)) {
      return false;
    }

    this.discoveries.add(id);

    return true;
  }


  addMineral(amount = 1) {

    this.player.minerals += amount;

  }


  damage(amount) {

    this.player.hp = Math.max(
      0,
      this.player.hp - amount
    );

  }


  consumeBattery(amount) {

    this.player.battery = Math.max(
      0,
      this.player.battery - amount
    );

  }


  consumeOxygen(amount) {

    this.player.oxygen = Math.max(
      0,
      this.player.oxygen - amount
    );

  }

}
