import Header from "./_components/Header";
import SideBar from "./_components/SideBar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="md:w-64 h-screen fixed">
        <SideBar />
      </div>
      <div className="md:ml-64">
        <Header />
        <div>
            {children}
        </div>
      </div>
    </div>
  )
}
