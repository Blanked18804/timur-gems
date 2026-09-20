import PageLayout from "@/components/general/pageLayout";
import Image from "next/image";

export default function Home() {
  return (
    <PageLayout>
      <main>
        {/* hero */}
        <section className="grid grid-cols-[35%_65%] min-h-[calc(100vh-64px)] gap-16">
          {/* left side */}
          <div className="pl-16 my-auto space-y-8">
            <div className="space-y-1">
              <h2 className="text-base font-normal text-gold">Lorem ipsum idk</h2>
              <h1 className="text-6xl">Something cool heading regarding the stone</h1>
            </div>

            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut, sapiente! Veritatis praesentium quas eum distinctio voluptate odit id odio. Exercitationem a minima impedit, cum earum aspernatur iste vero possimus modi.</p>

            <div className="space-x-2">
              <button className="btn">Shop Jewlery</button>
              <button className="btn-secondary">Shop by Stones</button>
            </div>
          </div>

          {/* right side */}
          <div className="relative">
            <Image src={"/assets/stone-hero.jpg"} fill alt="hero image" className="object-cover" />
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
