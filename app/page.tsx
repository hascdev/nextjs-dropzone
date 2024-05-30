import UploadForm from "./ui/upload-form";

export default function Home() {
    return (
        <main className="flex flex-col mx-auto max-w-6xl min-h-screen items-center justify-between p-24">
            <UploadForm />        
        </main>
    );
}
