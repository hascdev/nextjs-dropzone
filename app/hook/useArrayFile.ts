import { useState } from "react"

const useArrayFile = (initialState: File[] = []) => {

    const [files, setFiles] = useState(initialState);

    const add = (files: File[]) => {
        setFiles((currentFiles: File[]) => [...currentFiles, ...files]);
    }

    const remove = (index: number) => {
        setFiles((currentFiles: File[]) => {
            const newFiles = [...currentFiles];
            newFiles.splice(index, 1);
            return newFiles;
        });
    }

    const reset = () => {
        setFiles(initialState);
    }

    return [ files, { add, remove, reset } ] as const;
}

export default useArrayFile;