import { useRouter } from "next/router"
import { useEffect } from "react"
import { isMobile } from "react-device-detect"
import BlockSpinner from "../components/BlockSpinner"
import Center from "../components/controller/Center"

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        if (isMobile) {
            router.push("/controller")
        } else {
            router.push("/game")
        }
    }, [router])

    return (
        <Center>
            <BlockSpinner />
        </Center>
    )
}
