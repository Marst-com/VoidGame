export class HUD {

  constructor(state) {

    this.state = state;

    this.hp =
      document.getElementById(
        "hpBar"
      );

    this.oxygen =
      document.getElementById(
        "oxygenBar"
      );

    this.battery =
      document.getElementById(
        "batteryBar"
      );

    this.minerals =
      document.getElementById(
        "mineralCount"
      );

    this.mission =
      document.getElementById(
        "missionText"
      );

    this.discovery =
      document.getElementById(
        "discovery"
      );

    this.discoveryText =
      document.getElementById(
        "discoveryText"
      );

    this.scanMessage =
      document.getElementById(
        "scanMessage"
      );

    this.discoveryTimer = 0;

  }


  update(dt) {

    const player =
      this.state.player;


    this.hp.style.width =
      `${player.hp}%`;

    this.oxygen.style.width =
      `${player.oxygen}%`;

    this.battery.style.width =
      `${player.battery}%`;


    this.minerals.textContent =
      player.minerals;


    /*
     * 미션 진행
     */

    if (
      this.state.missions.discoveredRuins
    ) {

      this.mission.textContent =
        "고대 유적을 조사하라";

    }
    else if (
      this.state.missions.scannedShip
    ) {

      this.mission.textContent =
        "고대 구조물을 찾아라";

    }
    else {

      this.mission.textContent =
        "착륙 지점을 조사하라";

    }


    if (
      this.discoveryTimer > 0
    ) {

      this.discoveryTimer -= dt;

      if (
        this.discoveryTimer <= 0
      ) {

        this.discovery.classList.remove(
          "show"
        );

      }

    }

  }


  showDiscovery(text) {

    this.discoveryText.textContent =
      text;

    this.discovery.classList.add(
      "show"
    );

    this.discoveryTimer = 4;

  }


  showScan() {

    this.scanMessage.classList.add(
      "active"
    );

    setTimeout(() => {

      this.scanMessage.classList.remove(
        "active"
      );

    }, 500);

  }

}
