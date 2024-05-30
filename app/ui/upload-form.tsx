'use client';

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { clsx } from "clsx";
import Dropzone from "./dropzone";
import { State, uploadFiles } from "../lib/actions";
import useArrayFile from "../hook/useArrayFile";
import Alert from "./alert";

export default function UploadForm() {

    const initialState = { message: "" } as State;
    const [state, dispatch] = useFormState(uploadFiles, initialState);
    const [files, { add, remove, reset }] = useArrayFile([]);

    const filetypes = [".jpg", ".jpeg", ".png", ".gif"];
    const maxsize = 4.5 * 1024 * 1024; // Vercel has a 4.5 MB request body size limit on Vercel Functions. If you need to upload larger files, use client uploads.

    useEffect(() => {
      
        if (state && state.type === "success") {
            reset();
        }
      
    }, [state])    

    const handleSubmit = (formData: FormData) => {
        if (files.length <= 0) return;
        dispatch(formData);
    }

    return (
        <div className="w-full flex flex-col">
            <form action={handleSubmit}>            
                <Alert type={state.type} show={state.message !== ""}>{state.message}</Alert>
                <Dropzone name="dz-files" files={files} filetypes={filetypes} maxsize={maxsize} add={add} remove={remove} />
                <UploadButton />
            </form>
        </div>
    )
}

function UploadButton() {

    const { pending } = useFormStatus();

    return (
        <div className="border-b border-gray-900/10 py-4 mb-4">
            <button type="submit" className={clsx("w-full inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-sm text-white p-3 rounded-md", pending && "disabled:cursor-not-allowed")} disabled={pending}>
                <svg className={clsx("animate-spin -ml-1 mr-3 h-5 w-5 text-white", !pending && "hidden")} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                SUBIR ARCHIVOS
            </button>
        </div>
    );
}