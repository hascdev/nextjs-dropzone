'use client'

import { useEffect, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import FileTypeIcon from "./filetypes-icons";
import { ErrorCode, FileRejection, useDropzone } from "react-dropzone";
import { getMimeTypeFromExtension, isImage } from "../lib/utils";

type DropzoneTypeProps = {
    name: string;
    files: File[];
    filetypes: string[];
    maxsize: number;
    add: (files: File[]) => void;
    remove: (index: number) => void;
}

export default function Dropzone({ name, files, filetypes, maxsize, add, remove }: DropzoneTypeProps) {

    const inputFileRef = useRef<HTMLInputElement>(null);

    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        multiple: true,
        onDrop: (acceptedFiles) => {
            add(acceptedFiles);
        },
        validator: customValidator
    });

    function customValidator(file: File) {

        if (file.size > maxsize) {

            return {
                code: ErrorCode.FileTooLarge,
                message: `El archivo ${file.name} supera el tamaño permitido de ${Number(maxsize / (1024 * 1024)).toFixed(1) + " MB"}`
            };

        } else if (!filetypes.find((value: string) => file.type ===  getMimeTypeFromExtension(value))) {

            return {
                code: ErrorCode.FileInvalidType,
                message: `El archivo ${file.name} tiene una extensión no permitida`
            };
        }

        return null;
    }

    useEffect(() => {

        if (files && files.length >= 0) {
            
            // Update hidden input file
            if (inputFileRef.current) {

                const dataTransfer = new DataTransfer();            
                files.forEach((item) => {
                    dataTransfer.items.add(item);
                });

                inputFileRef.current.files = dataTransfer.files;
            }
        }
      
    }, [files]);

    return (
        <div className="flex flex-col">
            <FileRejectionAlert fileRejections={fileRejections} />
            <div {...getRootProps({ onClick: () => { }, className: 'flex flex-col items-center p-4 bg-gray-50 border-dashed border-2 border-gray-200 hover:border-indigo-500 text-gray-500 cursor-pointer' })}>
                <input ref={inputFileRef} name={name} type="file" multiple={true} className="hidden" />
                <input {...getInputProps()} />
                <div className={clsx("my-4 flex flex-col items-center", files.length > 0 && "hidden")}>
                    <div className="flex flex-wrap gap-3 justify-center text-gray-400">
                        {
                            filetypes.map((value: string, index: number) => <FileTypeIcon key={index} ext={value} />)
                        }
                    </div>
                    <p className="mt-4 text-sm">Arrastra aquí el o los archivos a subir</p>
                    <em className="mt-2 text-sm text-indigo-500">{`Tamaño máximo por archivo ${Number(maxsize / (1024 * 1024)).toFixed(1)} MB`}</em>
                </div>
                <PreviewDropzone files={files} remove={remove} />
            </div>
        </div>
    );
}

function PreviewDropzone({ files, remove }: { files: File[], remove: (index: number) => void }) {

    return (
        <div className={clsx("flex flex-wrap gap-2 justify-center p-4", files.length <= 0 && "hidden")}>
            {files.map((file: File, index: number) => (
                <div key={index}>
                    <div className="group relative flex flex-col justify-center">
                        <div className="relative w-[120px] h-[120px] overflow-hidden">
                            <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                blurDataURL={URL.createObjectURL(file)}
                                placeholder="blur"
                                fill={true}
                                sizes="120px"
                                priority={true}
                                style={{ transform: "translate3d(0, 0, 0)", objectFit: 'cover' }}
                                className={clsx("transform brightness-90 transition hover:brightness-100 cursor-default rounded border", !isImage(file.name) && "hidden")}
                                onClick={(e) => { if (e && e.stopPropagation) e.stopPropagation(); }}
                            />
                            <div className={clsx("w-full h-full transform brightness-90 transition hover:brightness-100 cursor-default rounded border px-4 py-2", isImage(file.name) && "hidden")}>
                                <div className="flex-1 space-y-5 py-1">
                                    <div className="h-2 bg-gray-400 rounded"></div>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-gray-400 rounded col-span-2"></div>
                                            <div className="h-2 bg-gray-400 rounded col-span-1"></div>
                                        </div>
                                        <div className="h-2 bg-gray-400 rounded"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-gray-400 rounded col-span-2"></div>
                                            <div className="h-2 bg-gray-400 rounded col-span-1"></div>
                                        </div>
                                        <div className="h-2 bg-gray-400 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-36 scale-0 p-2 bg-white rounded border group-hover:scale-100 cursor-default" onClick={(e) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
                            <p className="text-xs text-gray-900 font-semibold">{Number(file.size / (1024 * 1024)).toFixed(2) + " MB"}</p>
                            <p className="text-xs text-gray-900 whitespace-nowrap">{file.name}</p>
                        </div>
                        <a onClick={(e) => { if (e && e.stopPropagation) e.stopPropagation(); remove(index); }}
                            className="flex justify-center mt-1 bg-red-50 text-red-800 text-xs rounded border border-red-800 hover:bg-red-100 cursor-default">
                            Eliminar
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

function FileRejectionAlert({ fileRejections }: { fileRejections: FileRejection[] }) {

    return (
        <div className={clsx(fileRejections.length > 0 ? "flex" : "hidden", "p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50")} role="alert">
            <svg className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
                <span className="font-medium">Los siguientes archivos no fueron cargados:</span>
                {
                    fileRejections.map(({ file, errors }, index: number) => (
                        <ul className="mt-1.5 list-disc list-inside" key={index}>
                            {
                                errors.map(e => (
                                    <li key={e.code}>{e.message}</li>
                                ))
                            }
                        </ul>
                    ))
                }
            </div>
        </div>
    )
}