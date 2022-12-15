import { GameLevel } from "../components/GameState"
import createLevelEasy1 from "./LevelEasy1"
import createLevelEasy2 from "./LevelEasy2"
import createLevelHard1 from "./LevelHard1"
import createLevelMedium1 from "./LevelMedium1"
import createLevelMedium2 from "./LeveMedium2"
import createStartingScreenLevel from "./StartingScreenLevel"

class Levels {
    levels = [
        createStartingScreenLevel(),
        createLevelEasy1(),
        createLevelEasy2(),
        createLevelMedium1(),
        createLevelMedium2(),
        // createLevelHard1(),
    ]

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
