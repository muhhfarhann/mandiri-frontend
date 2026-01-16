import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import api from "../api";
import InvoiceModal from "../components/InvoiceModal";
import { useAuth } from "../context/AuthContext";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

const Payment = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
    kota: "Jakarta",
    alamat: "",
    perusahaan: "",
    catatan: "",
  });

  // --- PROTEKSI RUTE ---
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      alert("Silakan login terlebih dahulu!");
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

    try {
      const payload = {
        customer_name: form.nama,
        customer_email: form.email,
        customer_phone: form.telepon,
        customer_city: form.kota,
        customer_address: form.alamat,
        company_name: form.perusahaan,
        order_notes: form.catatan,
        total_amount: total,
        items: cartItems,
      };

      const res = await api.post("/orders", payload);

      setInvoiceData({
        id: `INV-${res.data.orderId}`,
        nama: form.nama,
        total: total,
        tanggal: new Date().toLocaleDateString("id-ID"),
        metode: "Bayar Di Tempat",
      });

      setShowInvoice(true);
      clearCart();
    } catch (err) {
      alert("Gagal order. Pastikan sudah login!");
    }
  };

  if (isLoading) return null;

  return (
    <>
      <div className="bg-white">
        <section className="py-16">
          <div className="container mx-auto px-6">
            <form
              onSubmit={handleOrder}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div className="space-y-5">
                <h2 className="text-2xl font-semibold mb-6">Detail Tagihan</h2>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
                <select
                  required
                  className="mt-1 block w-full rounded-md"
                  value={form.kota}
                  onChange={(e) => setForm({ ...form, kota: e.target.value })}
                >
                  <option value="Jakarta">Jakarta</option>
                  <option value="Depok">Depok</option>
                  <option value="Bogor">Bogor</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Bekasi">Bekasi</option>
                </select>
                <textarea
                  required
                  placeholder="Alamat Pengiriman"
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="mt-1 block w-full rounded-md"
                />
                <input
                  type="tel"
                  required
                  placeholder="Nomor Telepon"
                  value={form.telepon}
                  onChange={(e) =>
                    setForm({ ...form, telepon: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md"
                />
                <input
                  type="email"
                  required
                  placeholder="Alamat Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 block w-full rounded-md"
                />
                <input
                  type="text"
                  placeholder="Perusahaan (Opsional)"
                  value={form.perusahaan}
                  onChange={(e) =>
                    setForm({ ...form, perusahaan: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md"
                />
                <textarea
                  placeholder="Catatan Tambahan (Opsional)"
                  rows={3}
                  value={form.catatan}
                  onChange={(e) =>
                    setForm({ ...form, catatan: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md"
                />
              </div>

              {/* KOLOM KANAN: RINGKASAN */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 h-fit">
                <h3 className="text-xl font-semibold mb-4 border-b pb-4">
                  Pesanan Anda
                </h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#9e6621]">
                    {formatRupiah(
                      cartItems.reduce(
                        (acc, i) => acc + i.price * i.quantity,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="px-12 py-3 bg-[#9e6621] text-white font-bold rounded-md shadow-md hover:bg-[#8a5a1d] transition-all cursor-pointer"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>

      {invoiceData && (
        <InvoiceModal
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
          data={invoiceData}
        />
      )}
    </>
  );
};

export default Payment;
