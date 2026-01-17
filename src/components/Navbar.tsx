// client/src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { User, Search, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import UserSidebar from "./UserSidebar";

const Navbar = () => {
  const { openCart, cartItems } = useCart();
  const totalItems = cartItems.length;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* LEFT: Burger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger (Mobile Only) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600"
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="text-2xl font-bold text-gray-800">
              Mandiri Steel
            </Link>
          </div>

          {/* Search (Desktop Only) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg relative"
          >
            <input
              type="text"
              placeholder="Cari besi, semen, atau bata..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-5 pr-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#9e6621] text-white rounded-full"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <Link to="/" className="text-gray-600 hover:text-[#9e6621]">
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-[#9e6621]"
              >
                Products
              </Link>
            </div>

            {/* Profile & Cart → DESKTOP ONLY */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-[#9e6621]"
              >
                <User size={22} />
              </Link>

              <button
                onClick={openCart}
                className="relative text-gray-600 hover:text-[#9e6621]"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* SIDEBAR MOBILE */}
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
