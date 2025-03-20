import Image from "next/image"
import { Button } from "./button"
import { ArrowRight } from "lucide-react"

export const CTA = () => {
    return (
        <div className=" bg-[#E7E3D6] h-[80vh] lg:h-screen flex flex-col items-center justify-center">
            <div className="  w-[95%]  flex justify-center items-center  flex-col relative overflow-hidden mx-auto h-[60vh] lg:h-[70vh] bg-secondary  p-10 rounded-[30px]">
                <Image src="/assets/dashed.svg" alt="" width={500} height={500} className=" w-[300px] lg:w-[500px] h-[300px] lg:h-[500px]  absolute object-contain right-[-50px] top-[-80px]" />
                <Image src="/assets/dashed.svg" alt="" width={300} height={300} className="w-[300px] h-[300px]  absolute object-contain left-[-150px] lg:left-[-50px] bottom-[-80px]" />

                <h1 className=" text-black max-w-[700px] mb-10 text-center font-semibold lg:font-bold text-[40px] lg:text-[50px] sm:text-4xl">
                    Ready to maximize your store&apos;s potential on every page?
                </h1>
                <div className="flex flex-col lg:flex-row gap-5">
                    <Button text="See Pricing" icon={<ArrowRight size={18} color="white" />} className="!bg-black w-[250px] h-[50px] !text-white" />
                    <Button text="Try It Free" className=" justify-center w-[250px] h-[50px]" />
                </div>

            </div>
        </div>
    )
}