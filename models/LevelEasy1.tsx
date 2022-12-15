/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React from "react"
import { useGLTF } from "@react-three/drei"
import { GenericLevelModel, LevelModelProps } from "./BlockMatchModel"
import { GameLevel } from "../components/GameState"

export default function createEasyLevel1(): GameLevel {
    return {
        name: "Easy 1",
        model: LevelEasy1Model,
        frontBackSymmetric: true
    }
}

function LevelEasy1Model(props: LevelModelProps) {
    return <GenericLevelModel {...props} modelPath="/Easy1_.gltf" />
}

useGLTF.preload("/Easy1_.gltf")
