import {
  ISTakePillAction,
  IsoPlayer,
  InventoryItem,
  getPlayer,
  ISTimedActionQueue,
  KahluaTable,
  _instanceof_,
  getText,
} from "PipeWrench";
import { hookInto } from "PipeWrench-Utils";
import {
  onFillInventoryObjectContextMenu,
  onGameStart,
} from "PipeWrench-Events";

// Hook into ISTakePillAction:perform
hookInto(
  "ISTakePillAction:perform",
  (_perform: Function, self: ISTakePillAction) => {
    const player = self.character as IsoPlayer;
    const item = self.item as InventoryItem;

    player.Say(`I took a ${item.getDisplayName()}!`);

    return _perform(self);
  }
);

onGameStart.addListener(() => {
  const player = getPlayer();
  player.getInventory().AddItem("NietPharma.AntiInflammatory");
});

const UseDrug = (item: any) => {
  ISTimedActionQueue.add(new ISTakePillAction(getPlayer(), item, 165));
};

function OnFillInventoryObjectContextMenu(
  playerNum: number,
  table: KahluaTable,
  items: KahluaTable
) {
  const thing = ipairs(items[1].items);
  for (const [k, v] of ipairs(items[1].items)) {
    if (_instanceof_(v, "InventoryItem")) {
      const item: InventoryItem | any = v;
      if (item.getType() == "AntiInflammatory") {
        table.addOption(getText("ContextMenu_NP_TakePills"), item, UseDrug);
      }
      break;
    }
  }
}

onFillInventoryObjectContextMenu.addListener(OnFillInventoryObjectContextMenu);
