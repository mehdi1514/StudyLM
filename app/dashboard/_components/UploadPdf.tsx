"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useAction, useMutation } from "convex/react";
import { CircleAlert, Loader2Icon } from "lucide-react";
import { useState } from "react";
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';

export default function UploadPdf() {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
    const addPdfFileToDb = useMutation(api.fileStorage.addPdfFileToDb);
    const getFileUrl = useMutation(api.fileStorage.getFileUrl);
    const embedDocument = useAction(api.myActions.ingest);
    const { user } = useUser();
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const onFileSelect = (selectorFiles: FileList | null) => {
        selectorFiles && setFile(selectorFiles[0]);
        console.log(selectorFiles);
    }

    const onUpload = async () => {
        if(!file || !fileName) {
            setError("Please upload a file")
        } else {
            setIsLoading(true);
        
            // Step 1: Get a short-lived upload URL
            const postUrl = await generateUploadUrl();

            // Step 2: POST the file to the URL
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file?.type },
                body: file,
            });
            const { storageId } = await result.json();
            console.log("storageId", storageId);
            const fileId = uuidv4();
            const fileUrl = await getFileUrl({storageId: storageId});
            
            // Step 3: Save the newly allocated storage id to the database
            const response = await addPdfFileToDb({
                fileId: fileId,
                storageId: storageId,
                fileName: fileName ?? Date.now().toLocaleString,
                fileUrl: fileUrl as string,
                createdBy: user?.primaryEmailAddress?.emailAddress as string
            });

            console.log(response); // if sucessful, prints 'Inserted PDF file to DB'

            // GET request to get splitted pdf content
            const apiResult = await axios.get(`api/pdf-loader?pdfUrl=${fileUrl}`);
            console.log(apiResult.data.result);
            await embedDocument({
                splittedText: apiResult.data.result,
                fileId: fileId
            });
            setIsLoading(false);
            setIsModalOpen(false);
        }
    }

    return (
        <Dialog open={isModalOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsModalOpen(true)} className="w-full">+ Upload PDF File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload PDF File</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <div className="mt-5 p-3 rounded-md border">
                                <div className="flex-col gap-2">
                                    
                                    <Input required className="cursor-pointer" type="file" accept="application/pdf" onChange={(e) => onFileSelect(e.target.files)}/>
                                    <p className="flex justify-center text-xs mt-1 gap-1"><CircleAlert size={15}/> Only PDF is supported</p>
                                </div>
                                
                            </div>
                            <div className="mt-5">
                                <label htmlFor="file-name">File Name:</label>
                                <Input required placeholder="Enter file name..." id="file-name" type="text" onChange={(e) => setFileName(e.target.value)} />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>

                    <Button onClick={onUpload} disabled={isLoading}>
                        {isLoading ? <Loader2Icon className="animate-spin"/> : 'Upload'}
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}
