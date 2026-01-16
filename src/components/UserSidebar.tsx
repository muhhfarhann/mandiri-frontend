import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Home, Package, User, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

const UserSidebar = ({ open, onClose }: Props) => {
  const { openCart } = useCart();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Sidebar */}
        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="w-64 bg-white h-full shadow-xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <span className="font-bold text-lg text-[#9e6621]">
                  Mandiri Steel
                </span>
                <button onClick={onClose}>
                  <X size={22} />
                </button>
              </div>

              {/* Menu */}
              <nav className="flex-1 px-4 py-6 space-y-4 text-sm font-medium">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#9e6621]"
                >
                  <Home size={18} /> Home
                </Link>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#9e6621]"
                >
                  <Package size={18} /> Products
                </Link>
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#9e6621]"
                >
                  <User size={18} /> Profile
                </Link>

                <button
                  onClick={() => {
                    openCart();
                    onClose();
                  }}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#9e6621]"
                >
                  <ShoppingCart size={18} /> Cart
                </button>
              </nav>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserSidebar;
