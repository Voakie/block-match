import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ManualPage() {
    const router = useRouter()

    return (
        <div className="flex justify-center">
            <div className="text-2xl grow max-w-[1000px] m-10">
                <button
                    onClick={() => {
                        router.back()
                    }}
                    className="text-xl flex items-center py-2 px-4 bg-stone-700 text-white rounded-xl"
                >
                    <ArrowLeftIcon className="h-6" /> <span className="ml-3">Back</span>
                </button>
                <div className="font-bold text-6xl mt-4 mb-4">block-match</div>
                is a simple single-player browser game that challenges the players rotational skills
                using a gyroscope-enabled mobile device.
                <div className="font-bold text-4xl mt-10 mb-4">How to play</div>
                Open the game on your computer and then, on your smartphone, navigate to the URL
                shown at the bottom of the screen. Once there, enter the code that is displayed on
                your computer screen.
                <br className="mb-5" />
                Once the game has started, you can rotate the bottom part by simply rotating your
                device (if not, see the Troubleshooting section below). While the first level is
                relatively simple, the levels get more challenging later on.
                <div className="font-bold text-4xl mt-10 mb-4">Troubleshooting</div>
                If you have trouble getting connected, make sure you are not connected to a VPN and
                that you have a stable connection. Try using an Android phone if you are having
                issues on iOS.
                <br className="mb-5" />
                If you are having trouble getting to the smartphone view, use{" "}
                <Link href="./controller">this link</Link>
                <div className="font-bold text-4xl mt-10 mb-4">But why?</div>
                This small game was created as part of an exercise for the Mobile Computing and
                Internet of Things lecture at KIT
            </div>
        </div>
    )
}
