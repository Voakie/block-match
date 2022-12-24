import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex justify-center items-center h-screen text-center">
            <div>
                <div className="font-bold text-[min(20vh,_20vw)]">404</div>
                <div className="text-2xl">The page you are looking for does not exist</div>
                <Link href="/" className="text-2xl">
                    Play block-match
                </Link>
            </div>
        </div>
    )
}
