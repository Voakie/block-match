import * as React from "react"

export default function Box() {
    return (
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="green" />
        </mesh>
    )
}
