import {
  ISTakePillAction,
  IsoPlayer,
  _instanceof_,
  DrainableComboItem,
} from "PipeWrench";
import { hookInto } from "PipeWrench-Utils";

// Hook into ISTakePillAction:perform
hookInto(
  "ISTakePillAction:perform",
  (_perform: Function, self: ISTakePillAction) => {
    const player = self.character as IsoPlayer;
    const item = self.item as DrainableComboItem;

    player.Say(`I took a ${item.getDisplayName()}!`);
    if (item.getType() == "AntiInflammatory") {
      player.getModData().antiInflammatoryTaken = true;
    }
    item.Use();
    return _perform(self);
  }
);
