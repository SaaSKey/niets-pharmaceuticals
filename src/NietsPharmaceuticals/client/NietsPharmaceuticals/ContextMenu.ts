import { getSpecificPlayer, HandWeapon, InventoryItem, ISContextMenu, ISEquipWeaponAction, IsoGridSquare, IsoObject, IsoPlayer, ISTimedActionQueue, ISToolTip, ISUnloadBulletsFromFirearm, luautils, sendClientCommand, _instanceof_ } from "PipeWrench"
import { onFillInventoryObjectContextMenu, onFillWorldObjectContextMenu } from "PipeWrench-Events"
import { TestAction } from "./TimedActions/TestAction"

function doTestAction(player: IsoPlayer, square: IsoGridSquare) {
    ISTimedActionQueue.add(TestAction(player, square))
}

function doSendPing(player: IsoPlayer) {
    player.Say("Sending command ping!")
    sendClientCommand("TestMod", "ping", {})
}

onFillWorldObjectContextMenu.addListener((playerNum: number, context: ISContextMenu, worldObjects: IsoObject[], test: boolean) => {
    if (test) return

    const player = getSpecificPlayer(playerNum)

    if (player.getVehicle()) return

    context.addOptionOnTop("Do test action", player, doTestAction, player.getSquare())
    context.addOptionOnTop("Send ping to server", player, doSendPing)
})

function doEquipHammer(player: IsoPlayer, hammer: HandWeapon) {
    ISTimedActionQueue.add(new ISEquipWeaponAction(player, hammer, 50, true, false))
}

onFillInventoryObjectContextMenu.addListener((playerNum: number, context: ISContextMenu, items: any[]) => {
    const player = getSpecificPlayer(playerNum)

    const hammers: InventoryItem[] = [];

    // Find all selected hammers
    items.forEach(item => {
        // Is it an InventoryItem?
        if (_instanceof_(item, "InventoryItem")) {
            if ((item as InventoryItem).hasTag("Hammer")) {
                hammers.push(item);
            }
        }
        // Or it's a collasped item
        else {
            const list: any[] = item.items
            for (let i = 1; i < list.length; i++) {
                const item: InventoryItem = list[i]
                if (_instanceof_(item, "InventoryItem") && item.hasTag("Hammer")) {
                    hammers.push(item)
                }
            }
        }
    })

    if (hammers.length > 0) {

        // Create context sub-menu
        const hammersOption = context.addOptionOnTop("Equip Hammer")
        const hammersContext = context.getNew(context) as ISContextMenu
        context.addSubMenu(hammersOption, hammersContext)
    
        // Add hammers to context sub-menu
        hammers.forEach((hammer: InventoryItem) => {
            const option = hammersContext.addOption(hammer.getDisplayName(), player, doEquipHammer, hammer)

            const tooltip = new ISToolTip();
            tooltip.setName(`Equip ${hammer.getDisplayName()}`)
            const conditionPercent = luautils.round(hammer.getCondition() / hammer.getConditionMax() * 100, 2)
            tooltip.description = `Condition: ${conditionPercent}%`
            
            option.toolTip = tooltip
        })

    }

})
