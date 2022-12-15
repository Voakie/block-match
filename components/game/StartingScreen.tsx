export default function StartingScreen({ host, ownId }: { host?: string; ownId?: string }) {
    return (
        <>
            <div
                className="col-start-1 text-[min(10vw,10vh)] text-center z-0"
                style={{ gridRow: "1" }}
            >
                block-match
            </div>

            <div
                className="col-start-1 top-0 flex flex-col justify-end items-center z-20"
                style={{ gridRow: "1" }}
            >
                <div className="bg-stone-200 text-stone-700 shadow-2xl p-8 rounded-xl text-xl text-center mb-20">
                    Use your smartphone as a controller
                    <div className="font-bold text-2xl">{host}/controller</div>
                    and enter code
                    <div className="font-bold text-4xl">{ownId || "..."}</div>
                </div>
            </div>
        </>
    )
}
