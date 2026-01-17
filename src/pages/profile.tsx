// client/src/pages/profile.tsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { LogOut, Camera, Save, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from "../api";

const Profile = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [loadingSave, setLoadingSave] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    profile_pic: null as string | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ambil data profil dari database
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      api
        .get("/user/profile")
        .then((res) => {
          setProfileData({
            username: res.data.username || "",
            email: res.data.email || "",
            profile_pic: res.data.profile_pic,
          });

          if (res.data.profile_pic) {
            setPreviewUrl(`http://202.10.38.120:5000${res.data.profile_pic}`);
          }
        })
        .catch((err) => {
          console.error("Gagal load profile:", err);
        });
    }
  }, [isAuthenticated, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProfileData((prev) => ({ ...prev, profile_pic: null }));
  };

  const handleSave = async () => {
    setLoadingSave(true);
    const formData = new FormData();
    formData.append("username", profileData.username);
    formData.append("email", profileData.email);

    if (selectedFile) {
      formData.append("profile_pic", selectedFile);
    } else if (previewUrl === null && profileData.profile_pic === null) {
      formData.append("remove_pic", "true");
    }

    try {
      await api.put("/user/profile", formData);
      alert("Profil berhasil diperbarui!");
      window.location.reload();
    } catch (err) {
      alert("Gagal update profil");
    } finally {
      setLoadingSave(false);
    }
  };

  if (isLoading)
    return <div className="p-10 text-center">Memuat Profil...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Profil */}
        <div className="bg-[#9e6621] p-8 text-center text-white relative">
          <div className="relative inline-block group">
            <div
              className="h-32 w-32 rounded-full bg-white border-4 border-white/30 flex items-center justify-center text-[#9e6621] text-5xl font-bold mx-auto overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: previewUrl ? `url(${previewUrl})` : "none",
              }}
            >
              {!previewUrl &&
                (profileData.username?.charAt(0).toUpperCase() || "U")}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-white text-gray-700 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <Camera size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold capitalize">
            {profileData.username || "User"}
          </h2>
          <p className="opacity-90 text-sm">Member Mandiri Steel</p>

          {previewUrl && (
            <button
              onClick={handleRemovePhoto}
              className="mt-3 text-xs bg-red-500/20 hover:bg-red-500/40 text-white px-3 py-1 rounded-full transition flex items-center gap-1 mx-auto"
            >
              <Trash2 size={12} /> Hapus Foto
            </button>
          )}
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Username
              </label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9e6621] focus:border-[#9e6621]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9e6621] focus:border-[#9e6621]"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={loadingSave}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#9e6621] text-white rounded-lg hover:bg-[#8a5a1d] font-semibold transition disabled:opacity-50"
            >
              {loadingSave ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save size={18} /> Simpan Perubahan
                </>
              )}
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition"
            >
              <LogOut size={18} /> Keluar Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
