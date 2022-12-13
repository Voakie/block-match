import { createContext } from "react"

interface ControllerContextData {
    orientation: number[]
}

export const ControllerContext = createContext<ControllerContextData>({ orientation: [0, 0, 0] })
