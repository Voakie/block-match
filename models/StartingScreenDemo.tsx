import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh } from "three"
import { GLTF } from "three-stdlib"

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

export default function StartingScreenDemo() {
    const top = useRef<Mesh>(null!)
    const bottom = useRef<Mesh>(null!)
    useFrame((_, delta) => {
        top.current.rotateY(delta / 2)
        top.current.position.y = (Math.sin(Date.now() / 900) + 1.5) * 2
        bottom.current.rotation.copy(top.current.rotation)
    })

    const { nodes, materials } = useGLTF("/Easy1_.gltf") as unknown as GLTFResult
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
