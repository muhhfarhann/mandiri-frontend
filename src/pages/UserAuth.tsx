import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loginUser } = useAuth(); // Gunakan loginUser
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Panggil fungsi login user
        await loginUser(form.email, form.password);
        alert("Login Berhasil!");
        // Redirect ditangani context
      } else {
        // Register
        await api.post("/register", form);
        alert("Daftar Berhasil! Silakan Login.");
        setIsLogin(true); // Pindah ke tab login
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Terjadi kesalahan.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Masuk ke Akun" : "Daftar Akun Baru"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-[#9e6621] hover:underline"
            >
              {isLogin ? "Daftar Sekarang" : "Login Disini"}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <input
                type="text"
                required
                placeholder="Username"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#9e6621] focus:border-[#9e6621] sm:text-sm"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            )}
            <input
              type="email"
              required
              placeholder="Email Address"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-[#9e6621] focus:border-[#9e6621] sm:text-sm"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#9e6621] focus:border-[#9e6621] sm:text-sm"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#9e6621] hover:bg-[#8a5a1d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9e6621] disabled:opacity-50"
          >
            {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAuth;
