import {
  ISTakePillAction,
  IsoPlayer,
  InventoryItem,
  _instanceof_,
} from "PipeWrench";
import { hookInto } from "PipeWrench-Utils";

// Hook into ISTakePillAction:perform
hookInto(
  "ISTakePillAction:perform",
  (_perform: Function, self: ISTakePillAction) => {
    const player = self.character as IsoPlayer;
    const item = self.item as InventoryItem;

    player.Say(`I took a ${item.getDisplayName()}!`);
    if (item.getType() == "AntiInflammatory") {
      player.getModData().antiInflammatoryTaken = true;
    }

    return _perform(self);
  }
);
