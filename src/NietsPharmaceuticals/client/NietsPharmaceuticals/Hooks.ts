import {
  ISTakePillAction,
  IsoPlayer,
  _instanceof_,
  DrainableComboItem,
} from "PipeWrench";
import { hookInto } from "PipeWrench-Utils";
import { AntiInflammatory, DrugInstance } from "./DrugCycles";

// Hook into ISTakePillAction:perform
hookInto(
  "ISTakePillAction:perform",
  (_perform: Function, self: ISTakePillAction) => {
    const player = self.character as IsoPlayer;
    const item = self.item as DrainableComboItem;

    player.Say(`I took a ${item.getDisplayName()}!`);
    if (item.getType() == "AntiInflammatory") {
      const drugs: [DrugInstance] = player.getModData().drugsTaken || [];
      drugs.push(new DrugInstance(new AntiInflammatory(), player));
      player.getModData().drugsTaken = drugs;
    }
    item.Use();
    return _perform(self);
  }
);
