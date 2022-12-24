import Head from "next/head"
import type { DataConnection } from "peerjs"
import React, { Component } from "react"
import Center from "../components/controller/Center"

interface ControllerState {
    deviceSupported: boolean
    orientation: number[]
    paused: boolean
    peerId: string
    connect: boolean
    connecting: boolean
    connection?: DataConnection
}

export default class Controller extends Component<{}, ControllerState> {
    connectTimeout?: number

    constructor(props: {}) {
        super(props)

        this.state = {
            deviceSupported: false,
            orientation: [0, 0, 0],
            paused: false,
            peerId: "",
            connect: false,
            connecting: false,
            connection: undefined
        }

        this.onDeviceOrientation = this.onDeviceOrientation.bind(this)
        this.onPeerIdChange = this.onPeerIdChange.bind(this)
        this.onPeerIdKeyboardEvent = this.onPeerIdKeyboardEvent.bind(this)
        this.onConnectClick = this.onConnectClick.bind(this)
    }

    onDeviceOrientation(ev: DeviceOrientationEvent) {
        if (!this.state.deviceSupported) this.setState({ deviceSupported: true })
        if (this.state.paused) return
        if (ev.alpha === null || ev.beta === null || ev.gamma === null) return

        const orientation = [ev.alpha, ev.beta, ev.gamma]

        this.setState({ orientation })

        if (this.state.connection && this.state.connection.open) {
            this.state.connection.send({ type: "orientation", data: orientation })
        }
    }

    componentDidMount() {
        addEventListener("deviceorientation", this.onDeviceOrientation)
    }

    componentWillUnmount() {
        removeEventListener("deviceorientation", this.onDeviceOrientation)
    }

    onPeerIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ peerId: e.target.value.toUpperCase() })
    }

    onPeerIdKeyboardEvent(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            this.onConnectClick()
        }
    }

    async onConnectClick() {
        this.setState({ connecting: true, connect: true })

        const { Peer } = await import("peerjs")
        const peer = new Peer({
            // host: "/",
            // port: 3333,
            // path: "/peerjs/block-match",
            // debug: 10,
            // secure: false
        })

        peer.on("open", () => {
            console.log("Connecting now...")
            const conn = peer.connect(this.state.peerId, { reliable: true })

            conn.on("open", () => {
                console.log("connection opened", conn)
                clearTimeout(this.connectTimeout)

                if (!this.state.connection) {
                    this.setState({ connecting: false, connection: conn })
                }
            })

            conn.on("error", (e) => {
                alert(e)
                conn.close()
                this.setState({ connect: false, connecting: false, connection: undefined })
                peer.destroy()
            })

            conn.on("close", () => {
                console.log("Connection closed")
                this.setState({ connect: false, connecting: false, connection: undefined })
                peer.destroy()
            })
        })

        this.connectTimeout = window.setTimeout(() => {
            alert("Unable to connect to the game client. Please try again.")
            peer.destroy()
            this.setState({ connect: false, connecting: false, connection: undefined })
        }, 10000)
    }

    render() {
        // if (!this.state.deviceSupported)
        //     return (
        //         <div className="flex justify-center items-center h-screen flex-col">
        //             <div className="text-4xl p-10 pb-5 text-center">
        //                 Your device is not supported because the Gyroscope or Accelerometer is
        //                 unavailable
        //             </div>
        //             <div className="text-2xl">
        //                 Try to use this device as the <Link href="/game">game</Link> host instead
        //             </div>
        //         </div>
        //     )

        if (!this.state.connect) {
            return (
                <Center>
                    <div className="text-3xl">Please enter the ID of the game</div>
                    <input
                        className="border-2 text-5xl p-5 m-5 rounded-xl bg-stone-300 text-center focus:outline-stone-500 focus:outline max-w-full"
                        type="text"
                        value={this.state.peerId}
                        onChange={this.onPeerIdChange}
                        onKeyDown={this.onPeerIdKeyboardEvent}
                    />
                    <button
                        className="p-5 bg-stone-500 text-stone-100 font-semibold rounded-xl text-2xl"
                        onClick={this.onConnectClick}
                    >
                        Connect
                    </button>
                </Center>
            )
        }

        if (this.state.connecting)
            return (
                <Center>
                    <div className="text-5xl">Connecting...</div>
                </Center>
            )

        const [a, b, g] = this.state.orientation

        return (
            <Center>
                <Head>
                    <title>block-match {"//"} Controller</title>
                </Head>

                <div className="text-3xl font-semibold pb-5">
                    Move this device to control the bottom block
                </div>
                <div className="text-2xl pb-5">Make both blocks align to solve the puzzle</div>
                <div>Alpha: {a}</div>
                <div>Beta: {b}</div>
                <div>Gamma: {g}</div>
            </Center>
        )
    }
}
