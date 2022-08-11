import { ISBaseTimedAction, ISLogSystem, IsoGridSquare, IsoPlayer, ISTimedActionQueue } from "PipeWrench"

/**
 * Test Action
 * @param character The character that execute the action
 * @param square A new parameter for this timed action
 * @returns Return the action
 */
export function TestAction(character: IsoPlayer, square: IsoGridSquare) {
    const action = new ISBaseTimedAction(character)
    action.Type = "TestAction"
    action.maxTime = 80
    action.stopOnAim = true
    action.stopOnRun = true
    action.stopOnWalk = true

    // isValid
    action.isValid = () => {
        return square != null
    }

    // start
    action.start = () => {
        character.Say(`${character.getUsername()} is doing Test Action!`)
    }

    // update
    action.update = () => {

    }

    // stop
    action.stop = () => {
        character.Say(`${character.getUsername()} has stopped Test Action!`)
        
        ISTimedActionQueue.getTimedActionQueue(character).resetQueue()
    }

    // perform
    action.perform = () => {
        character.Say(`${character.getUsername()} has performed Test Action!`)

        ISTimedActionQueue.getTimedActionQueue(character).onCompleted(action)
        ISLogSystem.logAction(action)
    }

    return action
}
