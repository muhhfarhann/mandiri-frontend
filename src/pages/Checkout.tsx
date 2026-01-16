import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

const Checkout = () => {
  const { isAuthenticated } = useAuth(); // <--- Cek status login
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // --- LOGIC PROTEKSI: BELUM LOGIN? TAMPILKAN INI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Dulu, Yuk!
          </h2>
          <p className="text-gray-500 mb-6">
            Untuk keamanan dan riwayat pesanan, kamu harus masuk akun dulu
            sebelum checkout.
          </p>
          <Link
            to="/login"
            className="block w-full py-3 bg-[#9e6621] text-white rounded-lg font-bold hover:bg-[#8a5a1d] transition"
          >
            Login / Daftar Akun
          </Link>
          <Link
            to="/products"
            className="block mt-4 text-sm text-gray-400 hover:underline"
          >
            Kembali Belanja
          </Link>
        </div>
      </div>
    );
  }

  // Kalau keranjang kosong
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Keranjang Belanja Kosong</h2>
        <Link to="/products" className="text-[#9e6621] hover:underline">
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <section className="relative h-[200px] bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabel Produk */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4">Produk</th>
                      <th className="px-6 py-4">Harga</th>
                      <th className="px-6 py-4">Qty</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {formatRupiah(item.price)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center border rounded w-max">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-2"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-2"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold">
                          {formatRupiah(item.price * item.quantity)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Ringkasan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold mb-4">Ringkasan</h3>
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-[#9e6621]">{formatRupiah(subtotal)}</span>
              </div>
              <Link
                to="/payment"
                className="flex items-center justify-center gap-2 w-full bg-[#9e6621] text-white py-3 rounded-lg font-bold hover:bg-[#8a5a1d]"
              >
                Lanjut Pembayaran <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
