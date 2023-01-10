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
import * as React from "react"
import Controller from "./controller"

function makeid(length: number) {
    var result = ""
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

interface GameState {
    controllerConnected: boolean
    controllerOrientation: [number, number, number],
    ownId?: string
    host?: string
    level: GameLevel
    levelComplete: boolean
}

export default class Game extends React.Component<{}, GameState> {
    private peer?: Peer
    private controller?: DataConnection

    constructor (props: {}) {
        super(props)

        this.state = {
            controllerConnected: false,
            controllerOrientation: [0, 0, 0],
            ownId: undefined,
            host: undefined,
            level: levels.getStartingLevel(),
            levelComplete: false
        }

        this.setLevelComplete = this.setLevelComplete.bind(this)
        this.startingScreen = this.startingScreen.bind(this)
        this.nextLevel = this.nextLevel.bind(this)
        this.levelSelector = this.levelSelector.bind(this)
    }
    
    componentDidMount(): void {
        const path = location.pathname.split("/")
        path.pop()
        this.setState({ host: location.host + path.join("/") })
    }
    
    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<GameState>): void {
        if (!this.state.controllerConnected && !this.peer) {
            import("peerjs").then((peerjs) => {
                if (this.peer) return // This is to prevent race conditions with the dynamic import
                
                this.peer = new peerjs.Peer(
                    makeid(4)
                    // { host: "/", port: 3333, path: "/peerjs/block-match", debug: 10, secure: false }
                    )
                    this.peer.on("open", (id) => {
                        this.setState({ ownId: id })
                })

                this.peer.on("connection", (conn) => {
                    console.log("someone connected")
                    this.setState({ controllerConnected: true })
                    this.controller = conn
                    
                    conn.on("data", (data: any) => {
                        if ("type" in data && data.type === "orientation") {
                            if ("data" in data && Array.isArray(data.data)) {
                                this.setState({ controllerOrientation: data.data })
                            }
                        } else if ("type" in data && data.type === "action") {
                            if ("action" in data && data.action === "nextLevel") {
                                this.nextLevel()
                            }
                        }
                    })

                    conn.on("close", () => {
                        this.setState({ controllerConnected: false })
                        this.controller = undefined
                    })
                    
                    conn.on("error", (e) => {
                        console.error(e)
                        this.setState({ controllerConnected: false })
                    })
                })
                
                this.peer.on("error", (e) => {
                    this.setState({ controllerConnected: false })
                    alert(e)
                    console.error(e)
                    this.peer?.destroy()
                    this.peer = undefined
                })
            })
        } else if (this.state.level.name === "Start" && this.state.controllerConnected && this.peer) {
            this.setState({ level: levels.getNextLevel(this.state.level)! })
        }
    }

    setLevelComplete(v: boolean) {
    if (v != this.state.levelComplete) {
            this.setState({ levelComplete: v })

            if (this.controller) {
                this.controller.send({ type: "levelStatus", complete: v })
            }
        }
    }
    
    startingScreen()  {
        if (this.state.controllerConnected) return <></>
        return <StartingScreen host={this.state.host} ownId={this.state.ownId} />
    }

    nextLevel() {
        const nextLevel = levels.getNextLevel(this.state.level)
        if (nextLevel) {
            this.setState({ level: nextLevel })
        } else {
            alert("Congratulations! You have completed the game. There are no more levels")
        }
    }

    levelSelector() {
        if (this.state.levelComplete && this.state.controllerConnected) {
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
                            onClick={this.nextLevel}
                        >
                            Click here to start the next level
                        </button>
                    </div>
                </>
            )
        } else return <></>
    }

    // const [a, b, g] = controllerOrientation

    render () {
        return <div className="h-screen grid grid-cols-1">
            {/* <div className="fixed">
                <div>Alpha: {a}</div>
                <div>Beta: {b}</div>
                <div>Gamma: {g}</div>
            </div> */}

            {this.startingScreen()}
            {this.levelSelector()}

            <Head>
                <title>block-match {"//"} Game</title>
            </Head>

            <Canvas className="col-start-1 z-10" style={{ gridRow: "1" }}>
                <ControllerContext.Provider value={{ orientation: this.state.controllerOrientation }}>
                    <GameStateContext.Provider value={{ level: this.state.level, levelComplete: this.state.levelComplete }}>
                        <scene>
                            <ambientLight />
                            <pointLight position={[-8, 0, 0]} />

                            <BlockMatchPuzzle setLevelComplete={this.setLevelComplete} />
                        </scene>
                    </GameStateContext.Provider>
                </ControllerContext.Provider>
            </Canvas>
        </div>
    }
}
