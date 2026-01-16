// src/pages/admin/Orders.tsx
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react"; // --- BARU ---
import api from "../../api"; // --- BARU ---

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null); // State stats agar tidak error
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // <--- REQUEST: 5 BARIS

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resOrders, resStats] = await Promise.all([
        api.get("/orders"),
        api.get("/admin/dashboard-stats"),
      ]);
      setOrders(resOrders.data);
      setStats(resStats.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      fetchData();
      alert("Status berhasil diupdate!");
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div className="p-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 bg-white p-5 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Total Transaksi
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
            title="Total Pembeli"
            value={stats?.totalPembeli || 0}
            unit="Pembeli"
          />
          <StatCard
            title="Total Pesanan"
            value={orders.length}
            unit="Pesanan"
          />
          <StatCard
            title="Pesanan Baru"
            value={stats?.pesananBaru || 0}
            unit="Pesanan"
            color="text-blue-600"
          />
          <StatCard
            title="Stok Habis"
            value={stats?.stokHabis || 0}
            unit="Produk"
            color="text-red-600"
          />
        </div>
      </div>

      {/* Bagian 2: Tabel Pesanan (DENGAN PAGINATION) */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Pesanan Masuk</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">ID Pesanan</th>
                <th className="px-6 py-4 text-left">Nama Pembeli</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-medium text-blue-600">
                    #INV-{order.id}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value)
                      }
                      className="border rounded p-1 text-xs focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Proses">Proses</option>
                      <option value="Dikirim">Dikirim</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between p-4 border-t">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component untuk Stat Card agar bersih
const StatCard = ({ title, value, unit, color = "text-gray-900" }: any) => (
  <div>
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-bold ${color}`}>
      {value}{" "}
      <span className="text-base font-normal text-gray-500">{unit}</span>
    </p>
  </div>
);

export default Orders;
