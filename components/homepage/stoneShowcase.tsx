"use client"

import { ArrowRight, Dot } from "lucide-react"
import { useState } from "react"

export default function StoneShowcase() {
    const gridOptions = [
        { name: "Lapis Lazuli", attribute: ["Celestial", "Mystical"], subtitle: "The Stone of Royalty", desc: "Revered by ancient civilizations, lapis lazuli adorned royal treasures and sacred objects. Its deep celestial blue, flecked with golden pyrite, evokes a night sky filled with stars." },
        { name: "Sapphire", attribute: ["Regal", "Timeless"], subtitle: "A Legacy of Nobility", desc: "For centuries, sapphire has been associated with wisdom, nobility, and timeless elegance. Its captivating blue hue makes it a symbol of refined taste and enduring beauty." },
        { name: "Opal", attribute: ["Ethereal", "Enigmatic"], subtitle: "A Universe Within", desc: "Opal has inspired legends of celestial origins and magical fire. Its shifting flashes of color make every stone distinctive, as though an entire spectrum lives beneath its surface." },
        { name: "Topaz", attribute: ["Radiant", "Shining"], subtitle: "The Warmth of Light", desc: "Topaz has long been admired for its luminous colors and association with warmth and abundance. Its golden and honey-toned varieties bring a sense of understated luxury." },
        { name: "Opal", attribute: ["Ethereal", "Enigmatic"], subtitle: "A Universe Within", desc: "Opal has inspired legends of celestial origins and magical fire. Its shifting flashes of color make every stone distinctive, as though an entire spectrum lives beneath its surface." },
        { name: "Topaz", attribute: ["Radiant", "Shining"], subtitle: "The Warmth of Light", desc: "Topaz has long been admired for its luminous colors and association with warmth and abundance. Its golden and honey-toned varieties bring a sense of understated luxury." },
    ];

    const [activeStone, setActiveStone] = useState(null);
    const [selectedStone, setSelectedStone] = useState(null);

    const displayedStone = activeStone ?? selectedStone;
    const stone = displayedStone !== null ? gridOptions[displayedStone] : null;

    return (
        <section className=" text-white bg-olive-green py-32 px-16 w-full flex gap-16 items-center">
            <div className="w-[40%] space-y-4 py-auto">
                <h2 className="text-xl">{stone ? stone.name : "Shop by Stone"}</h2>
                <h1 className="text-6xl mt-1">{stone ? stone.subtitle : "Every Stone, Every Meaning"}</h1>
                <p>{stone ? stone.desc : "Every stone carries a legacy, a story, and a character that makes it uniquely its own. Discover the beauty and history behind nature's finest treasures."}</p>
                <button className="btn-arrow group flex gap-2 items-center text-lg">Explore {stone ? stone.name : "all stones"} <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" /></button>
            </div>

            <div className="grid w-[60%] grid-cols-2">
                {
                    gridOptions.map((item, index) => {
                        return (
                            <button 
                                key={index} 
                                onMouseEnter={() => setActiveStone(index)} 
                                onMouseLeave={() => setActiveStone(null)} 
                                onFocus={() => setActiveStone(index)} 
                                onBlur={() => setActiveStone(null)}
                                onClick={() => setSelectedStone(index)}
                                className={`flex items-start gap-4 px-8 py-8 text-left border`}>
                                    <span className="text-xs mb-1">0{index + 1}</span>
                                    <div className="flex flex-col">
                                        <span className="text-xl">{item.name}</span>
                                        <span className="text-sm text-[#aab8b1] flex items-center">{item.attribute[0]}  <Dot /> {item.attribute[0]}</span>
                                    </div>
                            </button>
                        )
                    })
                }
            </div>
        </section>
    )
}
