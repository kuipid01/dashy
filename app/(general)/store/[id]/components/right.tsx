import React from "react";
import {
  ChevronRight,
  ChevronLeft,
  Store,
  Phone,
  Clock,
  Shield
} from "lucide-react";
import StoreInfo from "./store/store-info";

interface RightSectionProps {
  isOpen: boolean;
  toggle: () => void;
}

export const RightSection: React.FC<RightSectionProps> = ({
  isOpen,
  toggle
}) => {
  return (
    <aside
      className={`fixed top-0 z-100 right-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "w-[320px]" : "w-[80px]"
      } z-10`}
    >
      <div className="h-full flex flex-col">
        <button
          onClick={toggle}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-200"
        >
          {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

        <div className={`mt-16 px-6 ${!isOpen && "opacity-0"}`}>
          <StoreInfo />
        </div>

        {!isOpen && (
          <div className="flex flex-col items-center mt-16 space-y-8">
            <div className="p-3 hover:bg-gray-100 rounded-full cursor-pointer">
              <Store size={24} />
            </div>
            <div className="p-3 hover:bg-gray-100 rounded-full cursor-pointer">
              <Phone size={24} />
            </div>
            <div className="p-3 hover:bg-gray-100 rounded-full cursor-pointer">
              <Clock size={24} />
            </div>
            <div className="p-3 hover:bg-gray-100 rounded-full cursor-pointer">
              <Shield size={24} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
