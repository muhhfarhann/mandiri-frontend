// src/components/admin/AddProductModal.tsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react"; // Tambah icon X
import api from "../../api";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const AddProductModal = ({ isOpen, onClose, onSuccess }: ModalProps) => {
  const goldColor = "#b99556";

  // --- LOGIC BACKEND JALAN ---
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk File & Preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    kode: "",
    category_id: "",
    price: "",
    satuan: "",
    stock: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("kode", formData.kode);
    data.append("category_id", String(formData.category_id));
    data.append("price", String(formData.price));
    data.append("stock", String(formData.stock));
    data.append("satuan", formData.satuan);
    data.append("description", formData.description || "");

    if (selectedFile) {
      // Nama 'image' ini harus SAMA dengan upload.single('image') di backend
      data.append("image", selectedFile);
    }

    try {
      // JANGAN SET HEADERS MANUAL, Biarkan Axios handle otomatis
      await api.post("/products", data);

      alert("Produk & Gambar Berhasil Diupload!");
      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error Upload:", error.response?.data);
      console.log("Pesan Error Server:", error.response?.data);
      alert("Gagal upload produk. Cek terminal backend!");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Pilih Gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Buat preview sementara
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      kode: "",
      category_id: "",
      price: "",
      satuan: "",
      stock: "",
      description: "", // <-- Tambahkan ini biar TypeScript nggak error lagi
    });
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Opsional: Hapus memory preview lama
      setPreviewUrl(null);
    }
  };

  // Ambil data kategori saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await api.get("/categories");
          setCategories(response.data);
        } catch (error) {
          console.error("Gagal ambil kategori:", error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // --- AKHIR LOGIC BACKEND ---

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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  New Product
                </Dialog.Title>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  {/* UPLOAD UI DINAMIS */}
                  <div className="flex items-center justify-center w-full">
                    {!previewUrl ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud size={32} className="text-gray-400" />
                          <p className="mt-2 text-xs text-gray-500">
                            Click to upload image
                          </p>
                        </div>
                        <input
                          type="file"
                          name="image"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                    ) : (
                      <div className="relative w-full h-32">
                        <img
                          src={previewUrl}
                          className="w-full h-full object-contain rounded-lg border"
                          alt="Preview"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Form Fields (Semua Input Konek ke state formData) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Kode Produk
                      </label>
                      <input
                        type="text"
                        name="kode"
                        value={formData.kode}
                        onChange={handleChange}
                        placeholder="e.g. BATA-001"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Nama Produk
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nama barang"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kategori
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Satuan
                      </label>
                      <input
                        type="text"
                        name="satuan"
                        value={formData.satuan}
                        onChange={handleChange}
                        placeholder="Buah/Sack"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Stok
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  {/* Buttons (UI Original Lo) */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        resetForm(); // Bersihkan form
                        onClose(); // Tutup modal
                      }}
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: goldColor }}
                    >
                      {isLoading ? "Saving..." : "Add Product"}
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

export default AddProductModal;
