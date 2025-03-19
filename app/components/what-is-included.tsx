import { Pill } from "./pill";

const features = [
    {
        title: "Actionable Insights",
        description: "Data-driven recommendations to grow your store and boost sales.",
        image: "/images/insights.png"
    },
    {
        title: "Smart Optimization",
        description: "Personalized tips to improve product visibility and conversions.",
        image: "/images/optimization.png"
    },
    {
        title: "Seamless Management",
        description: "Effortlessly update, track, and manage your store from any device.",
        image: "/images/management.png"
    },
    {
        title: "AI-Powered Assistance",
        description: "Smart tools to help with pricing, marketing, and customer engagement.",
        image: "/images/ai-assistance.png"
    },
    {
        title: "Multi-Platform Support",
        description: "Optimize your store for both desktop and mobile users.",
        image: "/images/multi-platform.png"
    },
    {
        title: "Scalable Growth",
        description: "Expand your store with advanced tools as your business grows.",
        image: "/images/scalable-growth.png"
    }
];



export const WhatIsIncluded = () => {
    return (
        <div className=" flex flex-col h-screen bg-[#E7E3D6] items-center justify-center w-full py-[100px]">
            <div className=" w-[80%] mx-auto flex items-center justify-center flex-col ">
                <Pill text="Your Store" />
                <h1 className="text-black text-[46px] max-w-[60%] text-center leading-[1.2] mt-4">
                    What is included
                </h1>


                <div className="grid grid-cols-3 mt-10 gap-10 mb-10 justify-between w-full">
                    {
                        features.slice(0, 3).map((feature) => (
                            <div key={feature.title} className=" bg-white p-10 rounded-[30px]">
                                {/* <Image src={feature.image} alt={feature.title} width={100} height={100} /> */}
                                <h3 className="font-medium text-black mb-5 text-[24px]">{feature.title}</h3>
                                <p className="text-black text-[18px]">{feature.description}</p>
                            </div>
                        ))
                    }

                </div>
                <div className="grid grid-cols-2 justify-between w-full gap-10   ">
                    {
                        features.slice(2, 4).map((feature) => (
                            <div key={feature.title} className=" bg-white p-10 rounded-[30px]">
                                {/* <Image src={feature.image} alt={feature.title} width={100} height={100} /> */}
                                <h3 className="font-medium text-black mb-5 text-[24px]">{feature.title}</h3>
                                <p className="text-black text-[18px]">{feature.description}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}