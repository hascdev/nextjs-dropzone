'use client'

import clsx from "clsx";
import { useState } from "react";

type AlertProp = {
    children: string;
    type: "warning" | "danger" | "success" | undefined;
    show: boolean;
}

export default function Alert({ children, type, show }: AlertProp) {

    const [close, setClose] = useState(false);

    return (
        <div className={clsx("w-full py-4", (!show || type === undefined || close) && "hidden")}>
            <div className={clsx("flex items-center p-4 text-sm rounded-lg",
                    type === "danger" && "text-red-800 bg-red-50 border border-red-500",
                    type === "success" && "text-green-800 bg-green-50 border border-green-500",
                    type === "warning" && "text-yellow-800 bg-yellow-50 border border-yellow-500")} 
                    role="alert">
                <div className="ms-3 text-sm font-normal">{children}</div>
                <button type="button" onClick={() => setClose(true)}
                    className={clsx("ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8",
                    type === "danger" && "text-red-800 bg-red-50 hover:bg-red-200",
                    type === "success" && "text-green-800 bg-green-50 hover:bg-green-200",
                    type === "warning" && "text-yellow-800 bg-yellow-50 hover:bg-yellow-200")} aria-label="Close">
                    <span className="sr-only">Cerrar</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </div>
        </div>

        
    )
}