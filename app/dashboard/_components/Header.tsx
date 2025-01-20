import { UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
      <div className="flex justify-between p-3 shadow-sm">
         <h2 className="text-lg font-bold">Workspace</h2>
        <UserButton />
      </div>
    )
  }
  