// client/src/pages/Products.tsx
import { useState, useEffect } from "react";
import api from "../api";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Filter, ShoppingCart } from "lucide-react";

// --- Komponen Product Card ---
const ProductCard = ({ product, addToCart }: any) => {
  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  // URL Gambar: Menggunakan URL dari database (localhost:5000/uploads/...) atau fallback ke public folder
  // --- LOGIC URL GAMBAR YANG LEBIH PINTAR ---
  const getImageUrl = (url: string | null) => {
    // 1. Jika di database kosong/null, pakai gambar default
    if (!url) return "/Home/bata.jpg";

    // 2. Jika di database tersimpan URL lengkap (misal dari internet), pakai langsung
    if (url.startsWith("http")) return url;

    // 3. Bersihkan URL: Hapus 'public/' jika tidak sengaja tersimpan di database
    // Contoh salah: "public/uploads/foto.jpg" -> Jadi: "/uploads/foto.jpg"
    let cleanUrl = url.replace("public/", "").replace("//", "/");

    // 4. Pastikan diawali dengan '/'
    if (!cleanUrl.startsWith("/")) {
      cleanUrl = `/${cleanUrl}`;
    }

    // 5. Gabungkan dengan URL Backend
    return `http://202.10.38.120:5000${cleanUrl}`;
  };
  const imageUrl = getImageUrl(product.image_url);

  // Logic diskon dummy
  const isDiscount = product.id % 3 === 0;
  const discountPrice = isDiscount ? product.price * 1.2 : null;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {isDiscount && (
        <span className="absolute top-3 left-3 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
          HOT DEAL
        </span>
      )}

      {/* --- Image Section --- */}
      <div className="relative w-full pt-[100%] bg-gray-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          // LOGIC ERROR: Jika gambar asli gagal dimuat (404), baru ganti ke default
          onError={(e) => {
            console.warn(`Gagal memuat gambar: ${imageUrl}`); // Cek console F12 untuk debug
            (e.target as HTMLImageElement).src = "/Home/bata.jpg";
          }}
        />

        {/* Overlay Add to Cart */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
          <button
            onClick={() => addToCart({ ...product, imageUrl })}
            className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#b5872a] hover:text-white flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* --- Product Info --- */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            {product.kode || "ITEM-001"}
          </p>
          <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#b5872a] transition-colors h-10 md:h-12">
            {product.name}
          </h3>
        </div>

        <div className="mt-2">
          {discountPrice && (
            <span className="text-xs text-gray-400 line-through block mb-0.5">
              {formatRupiah(discountPrice)}
            </span>
          )}
          <div className="flex items-center justify-between">
            <span className="text-base md:text-lg font-bold text-[#b5872a]">
              {formatRupiah(product.price)}
            </span>
            <span className="text-[10px] md:text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Stok: {product.stock}
            </span>
          </div>
        </div>
      </div>

      {/* --- Mobile Add Button --- */}
      <button
        onClick={() => addToCart({ ...product, imageUrl })}
        className="w-full bg-[#b5872a] text-white py-3 font-semibold text-sm md:hidden hover:bg-[#8a5a1d] transition-colors"
      >
        + Keranjang
      </button>
    </div>
  );
};

// --- Halaman Produk Utama ---
const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  // Filter State
  const [showCount, setShowCount] = useState(16);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Gagal ambil produk:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Logic Sort
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "price-asc") return a.price - b.price;
    if (sortOrder === "price-desc") return b.price - a.price;
    return 0;
  });

  // Logic Pagination (Limit Tampil)
  const displayedProducts = sortedProducts.slice(0, showCount);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-[#b5872a] font-bold animate-pulse text-xl">
          Loading Products...
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* 1. Header */}
      <section
        className="relative h-[200px] md:h-[300px] lg:h-[350px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/Home/besi.png')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
            Our Products
          </h1>
          <nav className="text-sm md:text-base text-gray-300 font-medium flex items-center justify-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Catalog</span>
          </nav>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="sticky top-[68px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between md:justify-start gap-3">
              <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Filter size={16} className="md:w-[18px] md:h-[18px]" />
                <span>Filter</span>
              </button>
              <span className="text-xs md:text-sm text-gray-500 hidden lg:block ml-2">
                Showing 1–{displayedProducts.length} of {products.length}{" "}
                results
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                <label className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                  Show:
                </label>
                <select
                  value={showCount}
                  onChange={(e) => setShowCount(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-[#b5872a] focus:border-[#b5872a] block p-2 cursor-pointer outline-none"
                >
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={32}>32</option>
                </select>
              </div>

              <div className="flex items-center gap-2 min-w-max">
                <label className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-[#b5872a] focus:border-[#b5872a] block p-2 cursor-pointer outline-none"
                >
                  <option value="default">Latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
              {displayedProducts.map((p) => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">
                Produk belum tersedia saat ini.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
