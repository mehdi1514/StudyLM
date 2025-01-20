"use client"

import { useParams } from "next/navigation"
import WorkspaceHeader from "../_components/WorkspaceHeader";
import PdfViewer from "../_components/PdfViewer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import TextEditor from "../_components/TextEditor";

export default function Workspace() {
    const {fileId} = useParams<{fileId: string}>(); // the type for fileId is explicitly specified here
    const fileInfo = useQuery(api.fileStorage.getFileRecord, {
        fileId: fileId
    });
    
    useEffect(()=>{
        console.log(fileInfo);
    }, [fileInfo]);

    return (
        <div>
            <WorkspaceHeader fileName={fileInfo?.fileName}/>

            <div className="grid grid-cols-2">
                <div>
                    {/* Text Editor */}
                    <TextEditor fileId={fileId} />
                </div>
                <div>
                    {/* PDF Viewer */}
                    <PdfViewer fileUrl={fileInfo?.fileUrl}/>
                </div>
            </div>
        </div>
    )
}
