import { getPlayer, IsoPlayer } from "PipeWrench";
import { everyTenMinutes } from "PipeWrench-Events";

enum Cycles {
  Delay,
  Onset,
  Plateau,
  Offset,
}

class Drug {
  public taken: boolean = false;
  public cycle: Cycles = Cycles.Delay;
  public delayCycles: number = 3;
  public onsetCycles: number = 3;
  public plateauCycles: number = 3;
  public offsetCycles: number = 3;

  public doOnset: Function = (cycle: number, player: IsoPlayer) => {};
  public doPlateau: Function = (cycle: number, player: IsoPlayer) => {};
  public doOffset: Function = (cycle: number, player: IsoPlayer) => {};
}

export class AntiInflammatory extends Drug {
  public onsetCycles: number = 6;

  public doOnset: Function = (cycle: number, player: IsoPlayer) => {
    player.Say(`Cycle number ${cycle}`);
  };
}

export class DrugInstance {
  public cycles: number = 0;
  public drug: Drug;
  public player: IsoPlayer;
  public finished: boolean = false;

  public constructor(drug: Drug, player: IsoPlayer) {
    this.drug = drug;
    this.player = player;
  }

  public doCycle: Function = () => {
    if (this.cycles < this.drug.delayCycles) {
    } else if (this.cycles < this.drug.onsetCycles) {
      this.drug.doOnset(this.cycles, this.player);
    } else if (this.cycles < this.drug.onsetCycles + this.drug.plateauCycles) {
      this.drug.doPlateau(this.cycles, this.player);
    } else if (
      this.cycles <
      this.drug.onsetCycles + this.drug.plateauCycles + this.drug.offsetCycles
    ) {
      this.drug.doOffset(this.cycles, this.player);
    } else this.finished = true;

    this.cycles++;
  };
}

everyTenMinutes.addListener(() => {
  const player = getPlayer();
  const drugList = (player.getModData().drugsTaken as [DrugInstance]) || [];
  if (drugList) {
    for (const drug of drugList) {
      drug.doCycle();
    }
  }
});
