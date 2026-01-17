// src/pages/admin/Inventory.tsx
import { useState, useEffect } from "react";
import api from "../../api";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import AddProductModal from "../../components/admin/AddProductModal";
import EditProductModal from "../../components/admin/EditProductModal";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Tambah state kategori
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE FILTER & SEARCH ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [resProd, resCat] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);
      setProducts(resProd.data);
      setCategories(resCat.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // --- LOGIC FILTERING ---
  const filteredProducts = products
    .filter((p) => p.is_active === 1)
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.kode && p.kode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === "All" ||
        String(p.category_id) === String(selectedCategory);

      return matchSearch && matchCategory;
    });

  // Fungsi delete & edit tetap sama...
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchInitialData(); // Refresh tabel
      } catch (err: any) {
        // Tampilkan pesan error asli dari server di console
        console.error("Detail Error:", err.response?.data || err.message);
        alert("Gagal hapus. Cek console browser!");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section (Gunakan filteredProducts atau products) */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Ringkasan Stock</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Total Varian</p>
            <p className="text-xl font-bold">{products.length} Produk</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Hasil Filter</p>
            <p className="text-xl font-bold text-blue-600">
              {filteredProducts.length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5">
          <h3 className="text-lg font-semibold">Inventory List</h3>

          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari nama atau kode..."
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-[#b99556] px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Produk</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Harga</th>
                <th className="px-6 py-3">Stok</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          p.image_url
                            ? `http://202.10.38.120:5000${p.image_url}`
                            : "/placeholder.jpg"
                        }
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">
                          {p.kode || `ID-${p.id}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {categories.find(
                      (c) => String(c.id) === String(p.category_id)
                    )?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupiah(p.price)}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold ${
                      p.stock < 10 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {p.stock}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      Unit
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setEditModalOpen(true);
                        }}
                        className="text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchInitialData}
      />
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          product={selectedProduct}
          onSuccess={fetchInitialData}
        />
      )}
    </div>
  );
};

export default Inventory;
