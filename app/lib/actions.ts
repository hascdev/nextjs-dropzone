'use server'

import { put } from "@vercel/blob";

export type State = {
    type?: "success" | "danger" | "warning" | undefined;
    message: string;
}

export async function uploadFiles(prevState: State, formData: FormData) {

    try {

        // await new Promise((resolve) => setTimeout(resolve, 5000));

        const files = formData.getAll("dz-files") as File[];

        const saved = await Promise.all(
            files.map(async (file) => { 
                const blob = await put(file.name, file, {
                    access: 'public',
                });
                return blob;
            })
        );

        console.log(`${saved.length} files saved!`);        
        return { type: "success", message: "Archivos cargados con éxito." } as State;

    } catch (error) {
        console.log(error);
        return { type: "danger", message: "Error al cargar los archivos." } as State;
    }
}
