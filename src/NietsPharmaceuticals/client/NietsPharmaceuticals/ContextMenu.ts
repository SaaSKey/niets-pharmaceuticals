import {
  DrainableComboItem,
  getSpecificPlayer,
  getText,
  InventoryItem,
  ISContextMenu,
  IsoPlayer,
  ISTakePillAction,
  ISTimedActionQueue,
  ISToolTip,
  luautils,
  _instanceof_,
} from "PipeWrench";
import { onFillInventoryObjectContextMenu } from "PipeWrench-Events";

function doUseDrug(player: IsoPlayer, item: InventoryItem) {
  ISTimedActionQueue.add(new ISTakePillAction(player, item, 165));
}

/* Thanks to Konijima for the template! */

onFillInventoryObjectContextMenu.addListener(
  (playerNum: number, context: ISContextMenu, items: any[]) => {
    const player = getSpecificPlayer(playerNum);

    // Find all selected items
    items.forEach((item) => {
      // Is it an InventoryItem?
      if (
        _instanceof_(item, "InventoryItem") &&
        (item as InventoryItem).getType() == "AntiInflammatory"
      ) {
        const option = context.addOptionOnTop(
          getText("ContextMenu_NP_TakePills"),
          player,
          doUseDrug,
          item
        );
        const tooltip = new ISToolTip();
        tooltip.setName(`Take ${item.getDisplayName()}`);
        const conditionPercent = luautils.round(
          (item.getCondition() / item.getConditionMax()) * 10,
          2
        );
        tooltip.description = `Left: ${conditionPercent}`;
        option.toolTip = tooltip;
      }

      // Or it's a collasped item
      else {
        const list: any[] = item.items;
        for (let i = 1; i < list.length; i++) {
          const item: InventoryItem = list[i];
          if (
            _instanceof_(item, "InventoryItem") &&
            (item as InventoryItem).getType() == "AntiInflammatory"
          ) {
            const option = context.addOptionOnTop(
              getText("ContextMenu_NP_TakePills"),
              player,
              doUseDrug,
              item
            );
            const tooltip = new ISToolTip();
            tooltip.setName(`Take ${item.getDisplayName()}`);
            tooltip.description = `Left: ${(
              item as DrainableComboItem
            ).getRemainingUses()}`;
            option.toolTip = tooltip;
          }
        }
      }
    });
  }
);
