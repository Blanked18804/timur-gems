import Sidebar from "./sidebar";

export default function PageLayout({children}: {children: React.ReactNode}) {
  return (
    <section className="min-h-screen overflow-hidden flex gap-16">
        <Sidebar />
        {children}
    </section>
  )
}
