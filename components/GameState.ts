import { createContext } from "react"
import { Euler } from "three"
import { LevelModelProps } from "../models/GenericLevelModel"
import createStartingScreenLevel from "../models/StartingScreenLevel"

export interface GameLevel {
    name: string
    model: (props: LevelModelProps) => JSX.Element
    frontBackSymmetric?: boolean
    rotation?: Euler
}

export interface GameState {
    level: GameLevel
    levelComplete: boolean
}

export const GameStateContext = createContext<GameState>({
    level: createStartingScreenLevel(),
    levelComplete: false
})
