import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Gunakan loginAdmin dari context
  const { loginAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Panggil fungsi context, biarkan context yang handle request API & State
      await loginAdmin(username, password);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login gagal. Cek username/password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Admin Portal
        </h2>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#b99556] focus:outline-none focus:ring-1 focus:ring-[#b99556]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#b99556] focus:outline-none focus:ring-1 focus:ring-[#b99556]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#b99556] py-2 text-white hover:bg-[#a3834b] disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
