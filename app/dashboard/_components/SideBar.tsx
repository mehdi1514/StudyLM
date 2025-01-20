import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CircleFadingArrowUp, Layout } from "lucide-react";
import Image from "next/image";
import UploadPdf from "./UploadPdf";

export default function SideBar() {
  return (
    <div className="shadow-sm h-screen p-5">
      <Image src={'/studylmlogo.png'} alt="StudyLM Logo" width={180} height={180} />
      <div className="mt-10">
        <UploadPdf />

        <div className="flex gap-2 itemss-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer">
            <Layout />
            <h2>Workspace</h2>
        </div>

        <div className="flex gap-2 itemss-center p-3 hover:bg-slate-100 rounded-lg cursor-pointer">
            <CircleFadingArrowUp />
            <h2>Upgrade</h2>
        </div>
      </div>
      <div className="absolute bottom-24 w-[85%]">
        <Progress value={33} />
        <p className="text-sm flex justify-center mt-1">3 out of 5 PDFs uploaded</p>
        <p className="text-xs text-gray-500 flex justify-center">Upgrade to upload more</p>
      </div>
    </div>
  )
}
