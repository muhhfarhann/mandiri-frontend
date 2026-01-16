// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar"; // --- BARU ---

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />

      {/* --- BARU --- */}
      {/* Sidebar keranjang akan "hidup" di sini */}
      <CartSidebar />
      {/* --- BARU --- */}
    </div>
  );
};

export default Layout;
