import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function WorkspaceHeader({fileName} : {fileName: string | undefined}) {
    return (
        <div className="p-3 flex justify-between shadow-md">
            <h2 className="text-md border-2 p-1 rounded-sm">{fileName}</h2>
            <Image src={'/studylmlogo.png'} alt="StudyLM Logo" width={140} height={50} />
            <UserButton />
        </div>
    )
}
