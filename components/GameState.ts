import { createContext } from "react"
import { LevelModelProps } from "../models/BlockMatchModel"
import createStartingScreenLevel from "../models/StartingScreenLevel"

export interface GameLevel {
    name: string
    model: (props: LevelModelProps) => JSX.Element
    frontBackSymmetric?: boolean
}

export interface GameState {
    level: GameLevel
    levelComplete: boolean
}

export const GameStateContext = createContext<GameState>({
    level: createStartingScreenLevel(),
    levelComplete: false
})
