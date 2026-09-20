import Header from "./header";

export default function PageLayout({children}: {children: React.ReactNode}) {
  return (
    <section className="min-h-screen overflow-hidden">
        <Header />
        {children}
    </section>
  )
}
