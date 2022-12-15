/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React from "react"
import { useGLTF } from "@react-three/drei"
import { GenericLevelModel, LevelModelProps } from "./GenericLevelModel"
import { GameLevel } from "../components/GameState"
import { Euler } from "three"

export default function createLevelHard1(): GameLevel {
    return {
        name: "Hard 1",
        model: LevelHard1Model,
        rotation: new Euler(Math.PI, 0, Math.PI / 4, "XYZ")
    }
}

function LevelHard1Model(props: LevelModelProps) {
    return <GenericLevelModel {...props} modelPath="/Medium1.glb" />
}

useGLTF.preload("/Medium1.glb")
