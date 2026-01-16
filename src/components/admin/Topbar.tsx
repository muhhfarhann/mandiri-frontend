import { Search, ChevronDown, Bell, Menu } from "lucide-react";

type TopbarProps = {
  setSidebarOpen: (isOpen: boolean) => void;
};

const Topbar = ({ setSidebarOpen }: TopbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-[69px] flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      {/* --- PERUBAHAN: Wrapper untuk Search & Burger --- */}
      <div className="flex items-center gap-4">
        {/* --- BARU: Tombol Burger (Hanya tampil di mobile) --- */}
        <button
          type="button"
          className="text-gray-500 md:hidden" // Tampil di mobile, hilang di desktop
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Search Bar (Sekarang responsif) */}
        <div className="relative hidden md:block">
          {" "}
          {/* Sembunyikan di mobile kecil, biarkan burger yg utama */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="search"
            placeholder="Search product, supplier, order"
            className="w-64 rounded-md border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-gray-500 focus:outline-none focus:ring-0 lg:w-96" // --- PERUBAHAN: W-64 di tablet
          />
        </div>
      </div>

      {/* Admin Menu (Sekarang responsif) */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Tanggal (Hilang di mobile kecil) */}
        <div className="hidden items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm sm:flex">
          <span>25 Oktober 2025</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>

        {/* Notifikasi */}
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
          <Bell size={20} />
        </button>

        {/* Profil Admin (Sembunyikan teks di mobile) */}
        <button className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          <span className="hidden text-sm font-medium sm:block">
            Hai Admin
          </span>{" "}
          {/* --- PERUBAHAN: Sembunyikan 'Hai Admin' di mobile --- */}
          <ChevronDown size={16} className="hidden text-gray-500 sm:block" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
