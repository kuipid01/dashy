import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import Link from "next/link";
// import hey from "../../../../public/animated/lottie/Hey.json";
import Image from "next/image";
export function ProductModal({
  showModal,
  setShowModal
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}) {
  return (
    <>
      {/* Trigger the modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <button className="btn hidden btn-primary">Add Product</button>
        </DialogTrigger>

        {/* Modal content */}
        <DialogContent>
          <Image
            src="/animated/hey.gif"
            className="mx-auto flex"
            width={100}
            height={100}
            alt="Hey"
          />

          <DialogTitle className="text-3xl font-bold">
            Add Your First Product
          </DialogTitle>
          <DialogDescription className=" uppercase text-xl font-medium">
            We notice you don&lsquo;t have a product yet.
          </DialogDescription>
          <p className="text-[16px] text-muted-foreground">
            Please ADD A PRODUCT TO START YOUR JOURNEY WITH THE FULL POWERS OF
            Kuipid.
          </p>

          <DialogFooter>
            {/* Link button to product page */}
            <Link
              className="w-full mt-5
            "
              href="/products"
            >
              <button className=" cursor-pointer w-full bg-black py-2 rounded-md text-white">
                Go to Product Page
              </button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
