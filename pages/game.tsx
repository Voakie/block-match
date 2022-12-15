import { Canvas } from "@react-three/fiber"
import type Peer from "peerjs"
import { useCallback, useEffect, useRef, useState } from "react"
import { Color } from "three"
import BlockMatchPuzzle from "../components/BlockMatchPuzzle"
import { ControllerContext } from "../components/ControllerContext"
import StartingScreen from "../components/game/StartingScreen"
import { GameLevel, GameStateContext } from "../components/GameState"
import createEasyLevel1 from "../models/LevelEasy1"
import { levels } from "../models/Levels"
import createStartingScreenLevel from "../models/StartingScreenLevel"

function makeid(length: number) {
    var result = ""
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export default function Game() {
    const [controllerConnected, setControllerConnected] = useState(false)
    const [controllerOrientation, setControllerOrientation] = useState([0, 0, 0])
    const [ownId, setOwnId] = useState<string>()
    const [host, setHost] = useState<string>()

    const [level, setLevel] = useState(levels.getStartingLevel())
    const [levelComplete, setLevelComplete] = useState(false)

    const peer = useRef<Peer>()

    const setLevelCompleteCallback = useCallback((v: boolean) => {
        setLevelComplete(v)
    }, [])

    const setLevelCallback = useCallback((l: GameLevel) => {
        setLevel(l)
    }, [])

    useEffect(() => {
        setHost(location.host)
    }, [])

    useEffect(() => {
        if (!controllerConnected && !peer.current) {
            import("peerjs").then((peerjs) => {
                if (peer.current) return // This is to prevent race conditions with the dynamic import

                peer.current = new peerjs.Peer(
                    makeid(4)
                    // { host: "/", port: 3333, path: "/peerjs/block-match", debug: 10, secure: false }
                )
                peer.current.on("open", (id) => {
                    setOwnId(id)
                })

                peer.current.on("connection", (conn) => {
                    console.log("someone connected")
                    setControllerConnected(true)

                    conn.on("data", (data: any) => {
                        if ("type" in data && data.type === "orientation") {
                            if ("data" in data && Array.isArray(data.data)) {
                                setControllerOrientation(data.data)
                            }
                        }
                    })

                    conn.on("close", () => {
                        setControllerConnected(false)
                    })

                    conn.on("error", (e) => {
                        console.error(e)
                        setControllerConnected(false)
                    })
                })

                peer.current.on("error", (e) => {
                    setControllerConnected(false)
                    alert(e)
                    console.error(e)
                    peer.current?.destroy()
                    peer.current = undefined
                })
            })
        } else if (level.name === "Start" && controllerConnected && peer.current) {
            setLevel(createEasyLevel1())
        }
    }, [controllerConnected, level.name])

    const startingScreen = useCallback(() => {
        if (controllerConnected) return <></>
        return <StartingScreen host={host} ownId={ownId} />
    }, [host, ownId, controllerConnected])

    const levelSelector = useCallback(() => {
        if (levelComplete && controllerConnected) {
            return (
                <>
                    <div
                        className="col-start-1 text-[min(10vw,10vh)] text-center"
                        style={{ gridRow: "1" }}
                    >
                        level complete
                    </div>
                    <div
                        className="flex justify-end items-center flex-col col-start-1 z-20"
                        style={{ gridRow: "1" }}
                    >
                        <button
                            className="mb-[80px] p-8 shadow-2xl rounded-2xl text-2xl text-stone-700 bg-stone-300"
                            onClick={() => {
                                const nextLevel = levels.getNextLevel(level)
                                if (nextLevel) {
                                    setLevel(nextLevel)
                                } else {
                                    alert(
                                        "Congratulations! You have completed the game. There are no more levels"
                                    )
                                }
                            }}
                        >
                            Click here to start the next level
                        </button>
                    </div>
                </>
            )
        } else return <></>
    }, [levelComplete, level, controllerConnected])

    // const [a, b, g] = controllerOrientation

    return (
        <div className="h-screen grid grid-cols-1">
            {/* <div className="fixed">
                <div>Alpha: {a}</div>
                <div>Beta: {b}</div>
                <div>Gamma: {g}</div>
            </div> */}

            {startingScreen()}
            {levelSelector()}

            <Canvas className="col-start-1 z-10" style={{ gridRow: "1" }}>
                <ControllerContext.Provider value={{ orientation: controllerOrientation }}>
                    <GameStateContext.Provider value={{ level, levelComplete }}>
                        <scene>
                            <ambientLight />
                            <pointLight position={[-8, 0, 0]} />

                            <BlockMatchPuzzle setLevelComplete={setLevelCompleteCallback} />
                        </scene>
                    </GameStateContext.Provider>
                </ControllerContext.Provider>
            </Canvas>
        </div>
    )
}
