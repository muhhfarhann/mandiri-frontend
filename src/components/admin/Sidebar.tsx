import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Archive,
  ShoppingCart,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "../../context/AuthContext";

const goldColor = "#b99556";

type NavContentProps = {
  onNavigate?: () => void;
};

const NavContent = ({ onNavigate }: NavContentProps) => {
  const { logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) onNavigate(); // Tutup sidebar mobile dulu
    logout(); // Panggil fungsi logout
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/admin/inventory", icon: Archive },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-full flex-col justify-between border-r border-gray-200 bg-white">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-8 w-8"
            style={{ color: goldColor }}
          />
          <span className="text-xl font-bold" style={{ color: goldColor }}>
            Mandiri
          </span>
        </div>

        {/* Navigasi */}
        <nav className="mt-4 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors
                    ${
                      isActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer Sidebar */}
      <div className="border-t border-gray-200 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="#"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </li>

          <li>
            <a
              href="#"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

type SidebarProps = {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
};

const Sidebar = ({ isSidebarOpen, setSidebarOpen }: SidebarProps) => {
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* --- SIDEBAR DESKTOP --- */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0">
        <NavContent />
      </div>

      {/* --- SIDEBAR MOBILE (OVERLAY) --- */}
      <Transition.Root show={isSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          {/* Konten Sidebar Mobile */}
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-64 flex-1 flex-col bg-white">
                {/* Tombol Close di atas */}
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={closeSidebar} // Tutup pakai helper
                  >
                    <X size={24} />
                  </button>
                </div>
                <NavContent onNavigate={closeSidebar} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Sidebar;
