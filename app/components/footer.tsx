import Link from "next/link";
import { CreditCard, Apple, CircleDollarSign } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#201E1F] text-white py-10 px-4 md:px-10">
      <div className=" flex flex-col">
        <div className="flex lg:flex-row flex-col justify-between">
          <h2 className=" font-medium">Dashy</h2>
          <div>
            <h3 className="text-white  text-xs uppercase mb-3">
              Be the first to know about the latest drops
            </h3>
            <div className="flex w-full sm:w-[280px] h-[40px] bg-[#4C5454] relative overflow-hidden rounded-md items-center gap-2">
              <input
                type="email"
                placeholder="Your Email"
                className="bg-transparent placeholder:uppercase text-xs flex-1 text-white px-4 py-2  focus:outline-none"
              />
              <button className="bg-white absolute right-0 bottom-0 top-0 h-full text-black px-4 py-2 rounded-md font-medium uppercase text-xs">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="grid mt-5 text-xs w-fit uppercase sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-10 gap-4 lg:gap-20">
          <div>
            <h3 className="text-gray-400 uppercase mb-3">Socials</h3>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="#" className="flex items-center gap-2">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2">
                  Twitter / X
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2">
                  YouTube
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-400 uppercase mb-3">Pages</h3>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="#">Index</Link>
              </li>
              <li>
                <Link href="#">Men</Link>
              </li>
              <li>
                <Link href="#">Women</Link>
              </li>
              <li>
                <Link href="#">About Us</Link>
              </li>
              <li>
                <Link href="#">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-400 uppercase mb-3">Help</h3>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="#">Contact</Link>
              </li>
              <li>
                <Link href="#">FAQ</Link>
              </li>
              <li>
                <Link href="#">Shipping & Payment</Link>
              </li>
              <li>
                <Link href="#">Returns</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-5 flex justify-between items-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Dashy</p>
        <div className="flex items-center gap-3">
          <CreditCard size={20} />
          <Apple size={20} />
          <CircleDollarSign size={20} />
        </div>
      </div>
    </footer>
  );
};
export default Footer;
