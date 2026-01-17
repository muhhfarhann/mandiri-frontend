// src/components/admin/EditProductModal.tsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import api from "../../api";

const EditProductModal = ({ isOpen, onClose, product, onSuccess }: any) => {
  const goldColor = "#b99556";
  const fileInputRef = useRef<HTMLInputElement>(null); // Buat nembak input file

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk gambar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...product });

  useEffect(() => {
    setFormData({ ...product });
    setPreviewUrl(null);
    setSelectedFile(null);
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      api.get("/categories").then((res) => setCategories(res.data));
    }
  }, [isOpen]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("kode", formData.kode); // Pastikan kode ikut dikirim
    data.append("category_id", String(formData.category_id));
    data.append("price", String(formData.price));
    data.append("stock", String(formData.stock));
    data.append("satuan", formData.satuan);
    data.append("description", formData.description || "");

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      await api.put(`/products/${product.id}`, data);
      alert("Produk Berhasil Diperbarui!");
      onSuccess(); // Refresh tabel inventory
      onClose(); // Tutup modal
    } catch (error: any) {
      console.error("Gagal Update:", error.response?.data);
      alert("Gagal update data. Cek console browser atau terminal backend!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900"
                >
                  Edit Product
                </Dialog.Title>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  {/* Image Upload Area (UI TETAP SAMA) */}
                  <div className="flex items-center justify-center w-full">
                    <div className="flex flex-col items-center">
                      <img
                        // Logika preview: Gambar Baru -> Gambar Lama -> Placeholder
                        src={
                          previewUrl ||
                          (product.image_url
                            ? `http://202.10.38.120:5000${product.image_url}`
                            : "/placeholder.jpg")
                        }
                        alt={product.nama}
                        className="h-28 w-28 rounded-md object-cover"
                      />
                      {/* Tombol lo yang ini gue sambungin ke input file rahasia */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-xs font-semibold text-blue-600"
                      >
                        Change Image
                      </button>
                      {/* Input file rahasia */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
                  </div>

                  {/* Form Fields (GRID UI TETAP SAMA) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Kode Produk
                      </label>
                      <input
                        type="text"
                        name="kode"
                        value={formData.kode || ""}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Nama Produk
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kategori
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    >
                      <option value="">Pilih kategori produk</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Harga
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Satuan
                      </label>
                      <input
                        type="text"
                        name="satuan"
                        value={formData.satuan || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Stok
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={onClose}
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: goldColor }}
                    >
                      {isLoading ? "Updating..." : "Update Product"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditProductModal;
