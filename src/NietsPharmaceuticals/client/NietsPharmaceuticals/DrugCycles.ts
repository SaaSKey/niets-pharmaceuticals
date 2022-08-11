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

interface Drug {
  cycle: Cycles;
  delayCycles: number;
  onsetCycles: number;
  plateauCycles: number;
  offsetCycles: number;

  doOnset: (cycle: number, player: IsoPlayer) => void;
  doPlateau: (cycle: number, player: IsoPlayer) => void;
  doOffset: (cycle: number, player: IsoPlayer, totalCycles: number) => void;
}

export class AntiInflammatory implements Drug {
  public cycle: Cycles = Cycles.Delay;
  public delayCycles: number = 30;
  public onsetCycles: number = 30;
  public plateauCycles: number = 30;
  public offsetCycles: number = 30;

  public initialStiffness: ArrayList = new ArrayList();

  public doOnset: (cycle: number, player: IsoPlayer) => void = (
    cycle: number,
    player: IsoPlayer
  ) => {
    if (cycle == 0) player.Say("I'm starting to feel the effects!");
    const bodyPartList: ArrayList = player.getBodyDamage().getBodyParts();
    if (bodyPartList) {
      if (this.initialStiffness.isEmpty()) {
        for (let n = 0; n < bodyPartList.size(); n++) {
          this.initialStiffness.add(bodyPartList.get(n).getStiffness());
        }
      }
      for (let n = 0; n < this.initialStiffness.size(); n++) {
        const currStiffness = bodyPartList.get(n).getStiffness();
        const targetStiffness = currStiffness - 0.24 * 2 * this.onsetCycles;
        const reduction = luautils.round(targetStiffness / this.onsetCycles, 2);
        bodyPartList
          .get(n)
          .setStiffness(Math.max(currStiffness - reduction, 0));
      }
    }
  };

  public doPlateau: (cycle: number, player: IsoPlayer) => void = (
    cycle: number,
    player: IsoPlayer
  ) => {
    if (cycle == 0) player.Say("The effects have reached their max strength.");
  };

  public doOffset: (
    cycle: number,
    player: IsoPlayer,
    totalCycles: number
  ) => void = (cycle: number, player: IsoPlayer, totalCycles: number) => {
    if (cycle == 0) player.Say("The effects are starting to wear off...");
    const bodyPartList: ArrayList = player.getBodyDamage().getBodyParts();
    if (bodyPartList) {
      for (let n = 0; n < bodyPartList.size(); n++) {
        const targetStiffness =
          this.initialStiffness.get(n) - 0.24 * totalCycles;
        const increase = luautils.round(
          (bodyPartList.get(n).getStiffness() + targetStiffness) /
            this.offsetCycles,
          2
        );
        bodyPartList
          .get(n)
          .setStiffness(
            Math.min(
              bodyPartList.get(n).getStiffness() + increase,
              targetStiffness
            )
          );
      }
    }
  };
}

export class DrugInstance {
  public currentCycles: number = 0;
  public totalCycles: number = 0;
  public drug: Drug;
  public player: IsoPlayer;
  public finished: boolean = false;

  public constructor(drug: Drug, player: IsoPlayer) {
    this.drug = drug;
    this.player = player;
  }

  public doCycle: Function = () => {
    switch (this.drug.cycle) {
      case Cycles.Delay:
        break;
      case Cycles.Onset:
        this.drug.doOnset(this.currentCycles, this.player);
        break;
      case Cycles.Plateau:
        this.drug.doPlateau(this.currentCycles, this.player);
        break;
      case Cycles.Offset:
        this.drug.doOffset(this.currentCycles, this.player, this.totalCycles);
        break;
    }
    this.totalCycles++;
    this.currentCycles++;
    if (
      // Delay Cycles done or
      (this.currentCycles > this.drug.delayCycles &&
        this.drug.cycle == Cycles.Delay) ||
      // Onset Cycles done or
      (this.currentCycles > this.drug.onsetCycles &&
        this.drug.cycle == Cycles.Onset) ||
      // Plateau Cycles done or
      (this.currentCycles > this.drug.plateauCycles &&
        this.drug.cycle == Cycles.Plateau) ||
      // Offset Cycles done
      (this.currentCycles > this.drug.offsetCycles &&
        this.drug.cycle == Cycles.Offset)
    ) {
      // Move to the next cycle type and reset
      this.drug.cycle++;
      this.currentCycles = 0;
    }
  };
}

everyOneMinute.addListener(() => {
  const player = getPlayer();
  const drugList = (player.getModData().drugsTaken as [DrugInstance]) || [];
  if (drugList) {
    drugList.forEach((drug) => {
      drug.doCycle();
    });
    player.getModData().drugsTaken = drugList.filter((drug) => !drug.finished);
  }
});
