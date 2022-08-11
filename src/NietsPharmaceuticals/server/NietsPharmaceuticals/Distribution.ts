import { KahluaTable } from "PipeWrench"
import { onPostDistributionMerge } from "PipeWrench-Events"
import { getGlobal } from "PipeWrench-Utils"

// Add items to SuburbsDistributions

const SuburbsDistributions = getGlobal<KahluaTable>("SuburbsDistributions")

table.insert(SuburbsDistributions.all.inventorymale.items, "Baseball")
table.insert(SuburbsDistributions.all.inventorymale.items, 66)

// ------------------------------------------------------------------------------

// Add items to ProceduralDistributions

const ProceduralDistributions = getGlobal<KahluaTable>("ProceduralDistributions")

table.insert(ProceduralDistributions.list.Antiques.items, "Baseball")
table.insert(ProceduralDistributions.list.Antiques.items, 66)

// ------------------------------------------------------------------------------

// Create typing for RemoveItemFromDistribution function
type RemoveItemFromDistributionFunction = (_dist: KahluaTable, _item: string, _chance: number, _dorecursive: boolean) => void
    
// Get global function RemoveItemFromDistribution
const RemoveItemFromDistribution = getGlobal<RemoveItemFromDistributionFunction>("RemoveItemFromDistribution")

// Remove items from distribution
onPostDistributionMerge.addListener(() => {
    RemoveItemFromDistribution(SuburbsDistributions, "Baseball", 66, true)
    RemoveItemFromDistribution(ProceduralDistributions, "Baseball", 66, true)
})
