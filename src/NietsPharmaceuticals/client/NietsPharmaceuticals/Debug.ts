import { getPlayer } from "PipeWrench";
import { onGameStart } from "PipeWrench-Events";
import { TakenDrugs } from "./DrugCycles";

const debugItems = true;

onGameStart.addListener(() => {
  if (debugItems) {
    const player = getPlayer();
    player.getInventory().AddItem("NietPharma.AntiInflammatory");
    player.getInventory().AddItem("Base.DigitalWatch");
    player.getModData().drugsTaken = {} as TakenDrugs;
  }
});
