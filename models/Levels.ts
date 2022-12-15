import { GameLevel } from "../components/GameState";
import createEasyLevel1 from "./LevelEasy1";
import createEasyLevel2 from "./LevelEasy2";
import createMediumLevel1 from "./LevelMedium1";
import createStartingScreenLevel from "./StartingScreenLevel";

class Levels {
    levels = [createStartingScreenLevel(), createEasyLevel1(), createEasyLevel2(), createMediumLevel1()]

    getStartingLevel() {
        return this.levels[0]
    }

    getNextLevel(current: GameLevel) {
        const currentIndex = this.levels.findIndex((v) => v.name === current.name)
        if (currentIndex >= 0 && currentIndex + 1 <= this.levels.length) {
            return this.levels[currentIndex + 1]
        } else return undefined
    }
}

export const levels = new Levels()
