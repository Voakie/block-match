import { Canvas } from "@react-three/fiber"
import type Peer from "peerjs"
import { useEffect, useRef, useState } from "react"
import { Color } from "three"
import BlockMatchPuzzle from "../components/BlockMatchPuzzle"
import { ControllerContext } from "../components/ControllerContext"
import { Easy1 } from "../models/Easy1"
import StartingScreenDemo from "../models/StartingScreenDemo"

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

    const peer = useRef<Peer>()

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
        }
    }, [controllerConnected])

    if (!controllerConnected) {
        return (
            <div className="h-screen grid grid-cols-1">
                <div
                    className="col-start-1 text-[min(10vw,10vh)] text-center -z-10"
                    style={{ gridRow: "1" }}
                >
                    block-match
                </div>

                <div
                    className="col-start-1 top-0 flex flex-col justify-end items-center z-10"
                    style={{ gridRow: "1" }}
                >
                    <div className="bg-stone-200 text-stone-700 shadow-2xl p-8 rounded-xl text-xl text-center mb-20">
                        Use your smartphone as a controller
                        <div className="font-bold text-2xl">{host}/controller</div>
                        and enter code
                        <div className="font-bold text-4xl">{ownId || "..."}</div>
                    </div>
                </div>

                <Canvas className="col-start-1 z-0" style={{ gridRow: "1" }}>
                    <scene>
                        <ambientLight />
                        <pointLight position={[-8, 0, 0]} />
                        <StartingScreenDemo />
                    </scene>
                </Canvas>
            </div>
        )
    }

    const [a, b, g] = controllerOrientation

    return (
        <div className="h-screen bg-stone-200">
            {/* <div className="fixed">
                <div>Alpha: {a}</div>
                <div>Beta: {b}</div>
                <div>Gamma: {g}</div>
            </div> */}
            <Canvas>
                <ControllerContext.Provider value={{ orientation: controllerOrientation }}>
                    <scene>
                        <ambientLight />
                        <pointLight position={[-8, 0, 0]} />

                        <BlockMatchPuzzle puzzle={Easy1} />
                    </scene>
                </ControllerContext.Provider>
            </Canvas>
        </div>
    )
}
