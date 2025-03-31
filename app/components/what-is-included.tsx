import Image from "next/image";
import { Pill } from "./pill";

const features = [
    {
        title: "Actionable Insights",
        description: "Data-driven recommendations to grow your store and boost sales.",
        image: "/assets/mockp4.svg"
    },
    {
        title: "Smart Optimization",
        description: "Personalized tips to improve product visibility and conversions.",
        image: "/assets/Mockup1.svg"
    },
    {
        title: "Seamless Management",
        description: "Effortlessly update, track, and manage your store from any device.",
        image: "/assets/mockp2.svg"
    },
    {
        title: "AI-Powered Assistance",
        description: "Smart tools to help with pricing, marketing, and customer engagement.",
        image: "/assets/new-grouped.svg"
    },
    {
        title: "Multi-Platform Support",
        description: "Optimize your store for both desktop and mobile users.",
        image: "/assets/new-grouped2.svg"
    },

];



export const WhatIsIncluded = () => {
    return (
        <div className=" flex flex-col min-h-screen bg-[#E7E3D6] items-center justify-center w-full py-[100px]">
            <div className=" w-[80%] mx-auto flex items-center justify-center flex-col ">
                <Pill text="Your Store" />
                <h1 className="text-center mt-4 w-full lg:max-w-[80%] mb-10 mx-auto text-[26px] md:text-[36px] lg:text-[46px] text-black font-semibold">
                    What is included
                </h1>


                <div className="grid grid-cols-1 lg:grid-cols-3 mt-10 gap-10 mb-10 justify-between w-full">
                    {
                        features.slice(0, 3).map((feature) => (
                            <div key={feature.title} className=" relative h-[400px] bg-white p-10 rounded-[30px]">
                                {/* <Image src={feature.image} alt={feature.title} width={100} height={100} /> */}
                                <h3 className="font-medium text-black mb-5 text-[24px]">{feature.title}</h3>
                                <p className="text-black text-[18px]">{feature.description}</p>

                                <div className="  w-[70%] absolute bottom-0 left-1/2 -translate-x-1/2 h-[200px]">
                                    <Image src={feature.image} alt={feature.title} fill className=" object-contain" />
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 justify-between w-full gap-10   ">
                    {
                        features.slice(3, 5).map((feature) => (
                            <div key={feature.title} className=" bg-white relative h-[400px] p-10 rounded-[30px]">
                                {/* <Image src={feature.image} alt={feature.title} width={100} height={100} /> */}
                                <h3 className="font-medium text-black mb-5 text-[24px]">{feature.title}</h3>
                                <p className="text-black text-[18px]">{feature.description}</p>

                                <div className="  w-[90%] absolute bottom-0 left-1/2 -translate-x-1/2 h-[250px]">
                                    <Image src={feature.image} alt={feature.title} fill className=" object-contain" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}