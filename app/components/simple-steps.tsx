import clsx from "clsx";
import Image from "next/image";

export const SimpleSteps = () => {
    const steps = [
        {
            step: 1,
            title: "Sign Up",
            description: "Create an account using your email and set up your password.",
        },
        {
            step: 2,
            title: "Set Up Your Store",
            description: "Enter your store name, logo, and basic details to personalize your shop.",
        },
        {
            step: 3,
            title: "Add Products",
            description: "Upload product images, set prices, and add descriptions for your items.",
        },
        {
            step: 4,
            title: "Manage Inventory",
            description: "Keep track of stock levels and update product availability as needed.",
        },
        {
            step: 5,
            title: "Start Selling",
            description: "Launch your store and start receiving orders from customers.",
        }
    ];

    console.log(steps);


    return (
        <div className="flex flex-col  bg-secondary relative justify-end items-center p-10 gap-4 w-full h-[70vh]">
            <div className=" w-fit p-10 bg-[#E7E3D6] overflow-hidden flex items-center gap-10 absolute h-[500px] top-[-250px] left-1/2 -translate-x-1/2 rounded-[60px] border border-black border-dashed">
                <div className="w-[400px] relative rounded-[60px] overflow-hidden">
                    <Image fill src="/assets/bg1.jpg" alt="" />
                </div>
                <div className="flex flex-col w-[400px]">
                    {steps.map((step) => (
                        <div key={step.step} className="flex flex-col p-5 h-[300px] items-start gap-4">
                            <div className={clsx(`w-10 h-10 text-black font-medium rounded-full flex items-center justify-center`, step.step % 2 === 0 ? "bg-accent" : "bg-secondary")}>
                                <p className="text-white">{step.step}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-[30px]">{step.title}</h3>
                                <p className="text-[20px] font-medium text-zinc-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <small className=" p-2 border border-black rounded-[60px] font-bold uppercase text-[20px]">Brands we have worked with</small>
            <h1></h1>
        </div>
    )
};