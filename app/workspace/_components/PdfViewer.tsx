import { Loader2Icon } from "lucide-react";

export default function PdfViewer({fileUrl} : {fileUrl: string | undefined}) {
  return (
    <div>
        {!fileUrl ?
        <div className="flex h-screen items-center justify-center bg-slate-200">
            <Loader2Icon className="animate-spin" size={20} />  <h2 className="text-md text-gray-500">Loading PDF</h2>
        </div>
        : 
        <iframe src={`${fileUrl}#toolbar=0`} height="90vh" width='100%' className="h-[90vh]" /> 
        }
    </div>
  )
}
