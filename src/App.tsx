// client/src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import UserAuth from "./pages/UserAuth";
import Profile from "./pages/profile";

// Admin Imports
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />

        {/* RUTE USER */}
        <Route path="/login" element={<UserAuth />} />

        {/* Halaman yang butuh user login (bisa ditambahkan proteksi lebih lanjut jika perlu) */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
      </Route>

      {/* RUTE ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
