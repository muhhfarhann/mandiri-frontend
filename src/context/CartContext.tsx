// client/src/context/CartContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type CartContextType = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[];
  addToCart: (item: any) => void; // Fungsi nambah barang
  removeFromCart: (id: number) => void; // Fungsi hapus barang
  updateQuantity: (id: number, quantity: number) => void; // Fungsi ubah qty
  clearCart: () => void; // Fungsi kosongin keranjang
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Awalnya kosong

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // LOGIC: Tambah ke keranjang
  const addToCart = (product: any) => {
    setCartItems((prevItems) => {
      // Cek apakah barang sudah ada di keranjang?
      const isExist = prevItems.find((item) => item.id === product.id);
      if (isExist) {
        // Kalau ada, naikkan jumlahnya saja
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Kalau belum ada, tambah barang baru dengan qty 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
    openCart(); // Otomatis buka sidebar keranjang biar user tau barang masuk
  };

  // LOGIC: Hapus satu item
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // LOGIC: Update jumlah (Plus/Minus)
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return removeFromCart(id); // Kalau 0, hapus aja
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // LOGIC: Kosongin semua (setelah checkout berhasil)
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
