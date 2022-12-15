import React from "react"

export default function Center(props: React.PropsWithChildren) {
    return (
        <div className="flex justify-center items-center h-full flex-col text-stone-700 p-5 text-center">
            {props.children}
        </div>
    )
}
