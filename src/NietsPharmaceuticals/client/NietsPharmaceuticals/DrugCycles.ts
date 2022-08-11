import {
  ArrayList,
  BodyDamage,
  BodyPart,
  getPlayer,
  IsoPlayer,
  luautils,
  Math,
} from "PipeWrench";
import { everyOneMinute, everyTenMinutes } from "PipeWrench-Events";

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
  public onsetCycles: number = 100;
  public initialStiffness: ArrayList = new ArrayList();

  public doOnset: Function = (cycle: number, player: IsoPlayer) => {
    player.Say(`Cycle number ${cycle}`);
    const bodyPartList: ArrayList = player.getBodyDamage().getBodyParts();
    if (bodyPartList) {
      if (this.initialStiffness.isEmpty()) {
        for (let n = 0; n < bodyPartList.size(); n++) {
          this.initialStiffness.add(bodyPartList.get(n).getStiffness());
        }
      }
      for (let n = 0; n < this.initialStiffness.size(); n++) {
        const currStiffness = bodyPartList.get(n).getStiffness();
        const reduction = Math.floor(this.initialStiffness.get(n) / 5.0);
        bodyPartList
          .get(n)
          .setStiffness(Math.max(currStiffness - reduction, 0));
      }
    }
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
    drugList.forEach((drug) => {
      drug.doCycle();
    });
    player.getModData().drugsTaken = drugList.filter((drug) => !drug.finished);
  }
});
