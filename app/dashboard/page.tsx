"use client";

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { FileText, Inbox } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const { user } = useUser();

    const userFiles = useQuery(api.fileStorage.getUserFiles, {
        userEmail: user?.primaryEmailAddress?.emailAddress as string,
    });

    console.log(userFiles);

    return (
        <>
            {userFiles && userFiles.length == 0 ? 
            <div className="flex flex-col h-screen items-center justify-center">
                <Inbox size={50} />
                <h1 className="text-sm mt-3">Workspace is empty. Upload a PDF file and start writing your notes.</h1>
            </div> 
            : 
            <div className="grid grid-cols-2 gap-5 mt-10 p-3 md:grid-cols-3 lg:grid-cols-4">
                {userFiles && userFiles.length > 0 ?
                    userFiles.map((file, index) => (
                        <Link key={index} href={`workspace/${file.fileId}`}>
                        <div key={index} className="flex p-5 shadow-md rounded-md flex-col items-center
                border-2 cursor-pointer hover:scale-105 transition-all h-32">
                            <FileText size={80} />
                            <h2 className="text-sm font-medium">{file.fileName}</h2>
                        </div>
                        </Link>
                    )) :
                    [1, 2, 3, 4].map((_, index) => (
                        <div key={index} className="bg-slate-200 rounded-md h-32 animate-pulse"></div>
                    ))
                }
            </div>}
            
        </>

    )
}
