import type { DataConnection } from "peerjs"
import React, { Component } from "react"

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
    gyroscope?: Gyroscope

    constructor(props: {}) {
        super(props)

        this.state = {
            deviceSupported: true,
            orientation: [0, 0, 0],
            paused: false,
            peerId: "",
            connect: false,
            connecting: false,
            connection: undefined
        }

        this.togglePause = this.togglePause.bind(this)
        this.gyroscopeReading = this.gyroscopeReading.bind(this)
        this.onPeerIdChange = this.onPeerIdChange.bind(this)
        this.onConnectClick = this.onConnectClick.bind(this)
    }

    togglePause() {
        if (this.state.paused) {
            this.gyroscope?.start()
        } else {
            this.gyroscope?.stop()
        }

        this.setState({ paused: !this.state.paused })
    }

    gyroscopeReading() {
        if (this.state.paused || !this.gyroscope) return

        const [x, y, z] = this.state.orientation
        const orientation = [
            this.gyroscope.x ? x + this.gyroscope.x : x,
            this.gyroscope.y ? x + this.gyroscope.y : y,
            this.gyroscope.z ? x + this.gyroscope.z : z
        ]

        this.setState({ orientation })

        if (this.state.connection && this.state.connection.open) {
            this.state.connection.send({ type: "orientation", data: orientation })
        }
    }

    componentDidMount() {
        if (!("Gyroscope" in window) || window.Gyroscope === undefined) {
            this.setState({ deviceSupported: false })
            return
        }

        this.gyroscope = new Gyroscope({ frequency: 30 })
        this.gyroscope.start()
        this.gyroscope.addEventListener("reading", this.gyroscopeReading)
    }

    componentWillUnmount() {
        this.gyroscope?.stop()
        this.gyroscope?.removeEventListener("reading", this.gyroscopeReading)
    }

    onPeerIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ peerId: e.target.value.toUpperCase() })
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
    }

    render() {
        if (!this.state.deviceSupported)
            return <div>Your device is not supported because the Gyroscope is unavailable</div>

        if (!this.state.connect) {
            return (
                <div>
                    Please enter the ID of the game
                    <input
                        className="border-2"
                        type="text"
                        value={this.state.peerId}
                        onChange={this.onPeerIdChange}
                    />
                    <button className="p-5 bg-slate-200" onClick={this.onConnectClick}>
                        Connect
                    </button>
                </div>
            )
        }

        if (this.state.connecting) return <div>Connecting...</div>

        const [x, y, z] = this.state.orientation

        return (
            <div>
                {/* Current orientation: {`X: ${x} Y: ${y} Z: ${z}`}{" "} */}
                <button className="p-5 bg-slate-200" onClick={this.togglePause}>
                    {this.state.paused ? "Continue" : "Pause"}
                </button>
            </div>
        )
    }
}
