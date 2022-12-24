import { Canvas } from "@react-three/fiber"
import Head from "next/head"
import type Peer from "peerjs"
import { DataConnection } from "peerjs"
import { useCallback, useEffect, useRef, useState } from "react"
import BlockMatchPuzzle from "../components/BlockMatchPuzzle"
import { ControllerContext } from "../components/ControllerContext"
import StartingScreen from "../components/game/StartingScreen"
import { GameLevel, GameStateContext } from "../components/GameState"
import { levels } from "../models/Levels"

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
    const controller = useRef<DataConnection>()

    const setLevelCompleteCallback = useCallback(
        (v: boolean) => {
            if (v != levelComplete) {
                setLevelComplete(v)
                if (controller.current) {
                    controller.current.send({ type: "levelStatus", complete: v })
                }
            }
        },
        [levelComplete]
    )

    useEffect(() => {
        const path = location.pathname.split("/")
        path.pop()
        setHost(location.host + path.join("/"))
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
                    controller.current = conn

                    conn.on("data", (data: any) => {
                        if ("type" in data && data.type === "orientation") {
                            if ("data" in data && Array.isArray(data.data)) {
                                setControllerOrientation(data.data)
                            }
                        } else if ("type" in data && data.type === "action") {
                            if ("action" in data && data.action === "nextLevel") {
                                nextLevel()
                            }
                        }
                    })

                    conn.on("close", () => {
                        setControllerConnected(false)
                        controller.current = undefined
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
            setLevel(levels.getNextLevel(level)!)
        }
    }, [controllerConnected, level])

    const startingScreen = useCallback(() => {
        if (controllerConnected) return <></>
        return <StartingScreen host={host} ownId={ownId} />
    }, [host, ownId, controllerConnected])

    const nextLevel = useCallback(() => {
        const nextLevel = levels.getNextLevel(level)
        if (nextLevel) {
            setLevel(nextLevel)
        } else {
            alert("Congratulations! You have completed the game. There are no more levels")
        }
    }, [level])

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
                            onClick={nextLevel}
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

            <Head>
                <title>block-match {"//"} Game</title>
            </Head>

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
