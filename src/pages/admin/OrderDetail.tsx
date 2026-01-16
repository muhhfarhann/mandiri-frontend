// src/pages/admin/OrderDetail.tsx
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { useState, useEffect } from "react"; // --- BARU ---
import api from "../../api"; // --- BARU ---

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

const OrderDetail = () => {
  const { id } = useParams(); // Ambil ID dari URL (e.g., "INV250920250001")

  // --- STATE BARU ---
  const [order, setOrder] = useState<any>(null); // State untuk detail pesanan
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchOrderDetail = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/orders/${id}`);
          setOrder(response.data);
        } catch (error) {
          console.error("Gagal mengambil detail pesanan:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrderDetail();
    }
  }, [id]); // Panggil API setiap kali 'id' berubah
  // --- AKHIR STATE BARU ---

  if (isLoading || !order) {
    return <div>Loading order detail...</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">{order.id}</h2>
        <button className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download size={16} />
          <span>Download</span>
        </button>
      </div>

      {/* Konten Detail */}
      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Kolom Kiri: Detail Pesanan */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Detail Pesanan
          </h3>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500">Nama Pembeli</span>
              <span className="col-span-2 text-sm font-medium text-gray-900">
                {order.customer_name}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500">Nama Perusahaan</span>
              <span className="col-span-2 text-sm font-medium text-gray-900">
                {order.company_name || "-"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500">Kota</span>
              <span className="col-span-2 text-sm font-medium text-gray-900">
                {order.customer_city}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500">Alamat Lengkap</span>
              <span className="col-span-2 text-sm font-medium text-gray-900">
                {order.customer_address}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500">Nomor Telepon</span>
              <span className="col-span-2 text-sm font-medium text-gray-900">
                {order.customer_phone}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500">Alamat Email</span>
              <span className="col-span-2 text-sm font-medium text-gray-900">
                {order.customer_email}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500">
                Informasi / Catatan Tambahan
              </span>
              <span className="col-span-2 text-sm font-medium text-gray-900">
                {order.order_notes || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Produk Pesanan */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Produk Pesanan
          </h3>
          <div className="mt-4 rounded-lg border border-gray-200">
            {/* Tabel Produk */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Nama Produk
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Jumlah
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Harga
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item: any) => (
                    <tr key={item.product_name}>
                      {" "}
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.product_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatRupiah(item.price_per_unit * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Total */}
            <div className="flex justify-between bg-gray-50 px-4 py-3">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-sm font-bold text-gray-900">
                {formatRupiah(order.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
