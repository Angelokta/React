// Import useState dan useEffect untuk mengelola state dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request
import axios from "axios";
// Import useNavigate untuk navigasi dan useParams untuk mengambil parameter URL
import { useNavigate, useParams } from "react-router-dom";

export default function EditFakultas() {
  // useNavigate hook untuk redirect
  const navigate = useNavigate();
  // useParams hook untuk mengambil id dari URL
  const { id } = useParams();

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    nama: "",
    singkatan: "",
  });

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading
  const [loading, setLoading] = useState(false);

  // State untuk menandakan proses loading saat fetch data
  const [isLoadingData, setIsLoadingData] = useState(true);

  // useEffect untuk fetch data fakultas berdasarkan id
  useEffect(() => {
    const fetchFakultas = async () => {
      try {
        setIsLoadingData(true);
        const response = await axios.get(
          `https://newexpresssi5a-weld.vercel.app/api/fakultas/${id}`
        );
        // Set data ke form
        setFormData({
          nama: response.data.nama,
          singkatan: response.data.singkatan,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching fakultas:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Terjadi kesalahan saat mengambil data"
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchFakultas();
  }, [id]); // Dependency array berisi id, akan dijalankan ulang jika id berubah

  // Fungsi untuk handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fungsi untuk handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.nama || !formData.singkatan) {
      setError("Semua field harus diisi!");
      return;
    }

    // Tandai proses pengiriman data ke API
    setLoading(true);
    // Reset error
    setError(null);

    try {
      // Kirim patch request ke API untuk update data
      // Hanya kirim field yang diperlukan (nama dan singkatan)
      const response = await axios.patch(
        `https://newexpresssi5a-weld.vercel.app/api/fakultas/${id}`,
        {
          nama: formData.nama,
          singkatan: formData.singkatan,
        }
      );

      console.log("Fakultas updated:", response.data);
      // Redirect ke halaman list fakultas
      navigate("/fakultas");
    } catch (err) {
      console.error("Error updating fakultas:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengupdate data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan loading saat data sedang diambil
  if (isLoadingData) {
    return <div className="container-fluid mt-5">Loading...</div>;
  }

  // Render form edit
  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4">Edit Fakultas</h2>

      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Tampilkan state untuk debugging */}
      <div className="alert alert-info">
        <strong>State saat ini:</strong>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>

      {/* Form untuk input data fakultas */}
      <form onSubmit={handleSubmit}>
        {/* Input field untuk nama fakultas */}
        <div className="mb-3">
          <label htmlFor="nama" className="form-label">
            Nama Fakultas
          </label>
          <input
            type="text"
            className="form-control"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Contoh: Fakultas Teknik"
            disabled={loading}
          />
        </div>

        {/* Input field untuk singkatan fakultas */}
        <div className="mb-3">
          <label htmlFor="singkatan" className="form-label">
            Singkatan
          </label>
          <input
            type="text"
            className="form-control"
            id="singkatan"
            name="singkatan"
            value={formData.singkatan}
            onChange={handleChange}
            placeholder="Contoh: FT"
            disabled={loading}
          />
        </div>

        {/* Tombol submit */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Mengupdate..." : "Update"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/fakultas")}
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
