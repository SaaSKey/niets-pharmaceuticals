import {
  ISTakePillAction,
  IsoPlayer,
  _instanceof_,
  DrainableComboItem,
} from "PipeWrench";
import { hookInto } from "PipeWrench-Utils";
import { AntiInflammatory, DrugInstance, TakenDrugs } from "./DrugCycles";

// Hook into ISTakePillAction:perform
hookInto(
  "ISTakePillAction:perform",
  (_perform: Function, self: ISTakePillAction) => {
    const player = self.character as IsoPlayer;
    const item = self.item as DrainableComboItem;
    const modData = player.getModData();

    player.Say(`I took a ${item.getDisplayName()}!`);
    if (item.getType() == "AntiInflammatory") {
      let drugs: TakenDrugs = modData.drugsTaken || ({} as TakenDrugs);
      let drugType: DrugInstance[] =
        drugs[item.getType()] || ([] as DrugInstance[]);

      const effectiveness = 1 - Object.keys(drugType).length * 0.5;
      player.Say(`Effectiveness: ${effectiveness}`);
      drugType.push(
        new DrugInstance(new AntiInflammatory(), player, effectiveness)
      );
      drugs[item.getType()] = drugType;
    }
    item.Use();
    return _perform(self);
  }
);
