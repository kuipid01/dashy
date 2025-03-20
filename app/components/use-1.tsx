import Image from "next/image"
import { Pill } from "./pill"
import { ArrowDown, ArrowRight } from "lucide-react"
export const Use1 = () => {

    const features = [
        {
            step: "01",
            title: "Launch Your Store Instantly",
            description: "Create your ecommerce website and add your first product in minutes.",
            showArrow: true
        },
        {
            step: "02",
            title: "Effortless Setup & Customization",
            description: "Customize your store with ease, using our intuitive tools and templates.",
            showArrow: true
        },
        {
            step: "03",
            title: "Start Selling Today",
            description: "Begin accepting orders and growing your business right away.",
            showArrow: false
        },
    ]
    return (
        <div className="h-fit min-h-screen bg-primary flex flex-col w-full ">
            <div className="h-screen pt-[100px] lg:pt-0 flex flex-col relative overflow-y-clip justify-center items-center">

                <Image src="/assets/use-mountain.svg" alt="" width={3440} height={778} className="absolute z-0 bottom-0 left-0 right-0 object-cover" />

                <div className=" border-b relative flex-col-reverse lg:flex-row mb-4 flex-1 w-[80%] mx-auto border-dashed border-black flex items-center justify-between">
                    <div>
                        IMAGE GOES HERE
                    </div>
                    <div className=" lg:max-w-[40%] flex flex-col items-center lg:items-start w-full">
                        <Pill text="QUICK AD INTEGRATION" />

                        <h1 className=" text-black text-center lg:text-left text-[26px] md:text-[36px] lg:text-[46px] leading-[1.2] my-4">
                            Maximize Your Reach, Instantly, and Drive Real Conversions.
                        </h1>
                        <p className="mt-2 leading-[1.5] text-[15px] md:text-[20px] text-center lg:text-left lg:text-[20px] text-black">
                            Unlock your platform&apos;s potential with efficient ad integration. Reach your ideal audience across a wide network, optimizing for higher click-through rates and measurable results.
                        </p>
                    </div>
                </div>
            </div>


            <div className="bg-[#E7E3D6] py-[100px]">
                <div className="  flex flex-col items-center justify-center w-[90%] mx-auto">
                    <Pill text="3-step Process" />

                    <h1 className=" text-black text-[26px] md:text-[36px] lg:text-[46px] lg:max-w-[60%] text-center leading-[1.2] mt-4">
                        Maximize Your Reach, Instantly, and Drive Real Conversions.
                    </h1>


                    <div className=" flex flex-col lg:flex-row gap-3 mt-7">
                        {
                            features.map((feature) => (
                                <div key={feature.step} className="relative lg:first:rounded-l-[40px] rounded-2xl p-10 lg:last:rounded-r-[40px] bg-white flex flex-row items-start justify-start">
                                    <div className=" mr-5">
                                        <p className=" text-[30px] text-accent font-medium">{feature.step}</p>
                                    </div>
                                    <div className=" flex flex-col border-l border-dashed border-black pl-5">
                                        <h3 className="font-medium text-[15px] text-zinc-500 uppercase">{feature.title}</h3>
                                        <p className="leading-[1.5] font-medium mt-10 text-[20px] text-black">{feature.description}</p>
                                    </div>


                                   { feature.showArrow && <div className="bg-primary z-10 lg:top-1/2 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-translate-y-1/2 bottom-[-40px] lg:right-[-40px] lg:bottom-auto shrink-0 absolute  size-[60px]  rounded-full  grid place-items-center">
                                        <div className=" bg-white size-[45px] rounded-full grid place-items-center">
                                          
                                            <ArrowRight className=" hidden lg:block text-black" />
                                            <ArrowDown className=" lg:hidden text-black" />
                                        </div>
                                    </div>}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>


        </div>
    )
}