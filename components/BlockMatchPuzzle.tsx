import { useFrame } from "@react-three/fiber"
import { useContext, useEffect, useState } from "react"
import { BlockMatchModelProps} from "../models/BlockMatchModel"
import { ControllerContext } from "./ControllerContext"

export default function BlockMatchPuzzle(props: {
    puzzle: (props: BlockMatchModelProps) => JSX.Element
}) {
    const controllerContext = useContext(ControllerContext)

    const [winReachableTime, setWinReachableTime] = useState<number | undefined>(undefined)
    const [win, setWin] = useState(false)

    useFrame(() => {
        const [alpha, beta, gamma] = controllerContext.orientation

        if (Math.abs(alpha - 90) < 5 && Math.abs(beta) < 5 && Math.abs(gamma) < 5) {
            if (winReachableTime === undefined) setWinReachableTime(Date.now())
            else if (Date.now() - winReachableTime > 1500) {
                setWin(true)
            }
        } else {
            setWinReachableTime(undefined)
        }
    })

    useEffect(() => {
        setWin(false)
        setWinReachableTime(undefined)
    }, [props.puzzle])

    return <props.puzzle top={{ onClick: () => setWin(false) }} complete={win} />
}
