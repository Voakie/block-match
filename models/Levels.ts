import { GameLevel } from "../components/GameState";
import createEasyLevel1 from "./LevelEasy1";
import createStartingScreenLevel from "./StartingScreenLevel";

class Levels {
    levels = [createStartingScreenLevel(), createEasyLevel1()]

    getStartingLevel() {
        return this.levels[0]
    }

    getNextLevel(current: GameLevel) {
        let nextLevel: GameLevel | undefined = undefined

        for (const l of this.levels) {
            const i = this.levels.indexOf(l)
            if (l.name === current.name && i > this.levels.length - 1) {
                nextLevel = this.levels[i + 1]
            }
        }

        return nextLevel
    }
}

export const levels = new Levels()
