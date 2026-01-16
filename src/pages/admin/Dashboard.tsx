// client/src/pages/admin/Dashboard.tsx
import { useEffect, useState, Fragment } from "react";
import api from "../../api";
import { Area, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign, ShoppingBag, Box, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "../../context/AuthContext";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

type DashboardStats = {
  totalPendapatan: number;
  pesananBaru: number;
  stokHabis: number;
  totalProduk: number;
  totalPembeli: number;
  produkTerjual: number;
  produkTerlaris: any[];
  transaksiTerakhir: any[];
};

const EMPTY_STATS: DashboardStats = {
  totalPendapatan: 0,
  pesananBaru: 0,
  stokHabis: 0,
  totalProduk: 0,
  totalPembeli: 0,
  produkTerjual: 0,
  produkTerlaris: [],
  transaksiTerakhir: [],
};

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState<{
    open: boolean;
    type: "products" | "transactions";
  }>({ open: false, type: "products" });

  const [modalData, setModalData] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchStats();
    }
  }, [authLoading, isAuthenticated]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/dashboard-stats");
      setStats(response.data);
    } catch (error: any) {
      console.error("Dashboard error:", error.response?.data || error.message);
      setStats(EMPTY_STATS); // ⬅⬅⬅ PENTING: jangan biarkan null
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="p-10 text-center font-bold">
        Loading Mandiri Steel Data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pendapatan"
          value={formatRupiah(stats.totalPendapatan)}
          icon={<DollarSign />}
        />
        <StatCard
          title="Pesanan Baru"
          value={stats.pesananBaru}
          icon={<ShoppingBag />}
        />
        <StatCard title="Stok Habis" value={stats.stokHabis} icon={<Box />} />
        <StatCard
          title="Jumlah Produk"
          value={stats.totalProduk}
          icon={<Box />}
        />
      </div>

      {/* PRODUK TERLARIS */}
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Produk Terlaris</h3>
        <ul className="divide-y">
          {stats.produkTerlaris.map((p: any, i) => (
            <li key={i} className="py-3 flex justify-between">
              <span>{p.name}</span>
              <strong>{p.total_terjual}</strong>
            </li>
          ))}
        </ul>
      </div>

      {/* MODAL */}
      <ViewAllModal
        isOpen={showModal.open}
        onClose={() => setShowModal({ ...showModal, open: false })}
        title="Detail"
        data={modalData}
        type={showModal.type}
      />
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
    <div className="mt-2">{icon}</div>
  </div>
);

const ViewAllModal = ({ isOpen, onClose, title, data }: any) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-xl">
          <div className="flex justify-between mb-4">
            <Dialog.Title>{title}</Dialog.Title>
            <button onClick={onClose}>
              <X />
            </button>
          </div>
          <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
        </Dialog.Panel>
      </div>
    </Dialog>
  </Transition>
);

export default Dashboard;
