import { Canvas } from "@react-three/fiber"
import type Peer from "peerjs"
import { useEffect, useRef, useState } from "react"
import { ControllerContext } from "../components/ControllerContext"
import { Easy1 } from "../models/Easy1"

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
    const [ownId, setOwnId] = useState("")

    const peer = useRef<Peer>()

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
    }, [])

    if (!controllerConnected) {
        return <div>Connect with your Mobile Device: {ownId}</div>
    }

    const [x, y, z] = controllerOrientation

    return (
        <div className="h-screen">
            <div className="fixed">
                <div>X: {x}</div>
                <div>Y: {y}</div>
                <div>Z: {z}</div>
            </div>
            <Canvas>
                <ControllerContext.Provider value={{ orientation: controllerOrientation }}>
                    <ambientLight />
                    <pointLight position={[-8, 0, 0]} />
                    {/* <Box /> */}
                    <Easy1 />
                </ControllerContext.Provider>
            </Canvas>
        </div>
    )
}
