import { useFrame } from "@react-three/fiber"
import { useContext, useEffect, useState } from "react"
import { radToDeg } from "three/src/math/MathUtils"
import { ControllerContext } from "./ControllerContext"
import { GameStateContext } from "./GameState"

export default function BlockMatchPuzzle(props: { setLevelComplete: (c: boolean) => void }) {
    const controllerContext = useContext(ControllerContext)
    const gameStateContext = useContext(GameStateContext)

    const [winReachableTime, setWinReachableTime] = useState<number | undefined>(undefined)

    useFrame(() => {
        let [alpha, beta, gamma] = controllerContext.orientation

        alpha += radToDeg(gameStateContext.level.rotation?.y || 0)
        beta += radToDeg(gameStateContext.level.rotation?.z || 0)
        gamma += radToDeg(gameStateContext.level.rotation?.x || 0)

        alpha %= 360
        if (alpha < 0) alpha = 360 + alpha
        beta %= 180
        gamma %= 90

        if (
            (gameStateContext.level.frontBackSymmetric
                ? Math.abs(alpha - 90) < 5 || Math.abs(alpha - 270) < 5
                : Math.abs(alpha - 90) < 5) &&
            Math.abs(beta) < 5 &&
            Math.abs(gamma) < 5
        ) {
            if (winReachableTime === undefined) setWinReachableTime(Date.now())
            else if (Date.now() - winReachableTime > 1500) {
                props.setLevelComplete(true)
            }
        } else {
            setWinReachableTime(undefined)
        }
    })

    const { setLevelComplete } = props

    useEffect(() => {
        setLevelComplete(false)
        setWinReachableTime(undefined)
    }, [gameStateContext.level, setLevelComplete])

    return <gameStateContext.level.model top={{ onClick: () => props.setLevelComplete(false) }} />
}
