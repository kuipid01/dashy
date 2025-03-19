import Image from "next/image"
import { Button } from "./button"
import { ArrowRight } from "lucide-react"

export const CTA = () => {
    return (
        <div className=" bg-[#E7E3D6] h-screen flex flex-col items-center justify-center">
            <div className="  w-[95%]  flex justify-center items-center  flex-col relative overflow-hidden mx-auto h-[70vh] bg-secondary  p-10 rounded-[30px]">
                <Image src="/assets/dashed.svg" alt="" width={500} height={500} className=" absolute object-contain right-[-50px] top-[-80px]" />
                <Image src="/assets/dashed.svg" alt="" width={300} height={300} className=" absolute object-contain left-[-50px] bottom-[-80px]" />

                <h1 className=" text-black max-w-[700px] mb-10 text-center font-bold text-[50px] sm:text-4xl">
                    Ready to maximize your store's potential on every page?
                </h1>
                <div className="flex gap-5">
                    <Button text="See Pricing" icon={<ArrowRight size={18} color="white" />} className="!bg-black !text-white" />
                    <Button text="Try It Free" />
                </div>

            </div>
        </div>
    )
}