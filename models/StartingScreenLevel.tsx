import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh } from "three"
import { GLTF } from "three-stdlib"
import { GameLevel } from "../components/GameState"

type GLTFResult = GLTF & {
    nodes: {
        bottom: THREE.Mesh
        top: THREE.Mesh
    }
    materials: {
        BottomMaterial: THREE.MeshPhysicalMaterial
        TopMaterial: THREE.MeshPhysicalMaterial
    }
}

export default function createStartingScreenLevel(): GameLevel {
    return {
        name: "Start",
        model: StartingScreenLevelModel,
        frontBackSymmetric: true
    }
}

function StartingScreenLevelModel() {
    const top = useRef<Mesh>(null!)
    const bottom = useRef<Mesh>(null!)
    useFrame((_, delta) => {
        top.current.rotateY(delta / 10)
        top.current.position.y = (Math.sin(Date.now() / 2000) + 1.5) * 2
        bottom.current.rotation.copy(top.current.rotation)
    })

    const { nodes, materials } = useGLTF("/Easy1.gltf") as unknown as GLTFResult
    return (
        <group dispose={null} position={[0, 1, -10]}>
            <mesh
                name="bottom"
                ref={bottom}
                castShadow
                receiveShadow
                position={[0, -3, 2]}
                geometry={nodes.bottom.geometry}
                material={materials.BottomMaterial}
            />
            <mesh
                name="top"
                ref={top}
                castShadow
                receiveShadow
                geometry={nodes.top.geometry}
                material={materials.TopMaterial}
                rotation={[0, Math.PI / 2, 0]}
                position={[0, 1, 2]}
            />
        </group>
    )
}

useGLTF.preload("/Easy1.gltf")
