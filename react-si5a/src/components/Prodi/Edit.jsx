// Import useState dan useEffect untuk mengelola state dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request
import axios from "axios";
// Import useNavigate dan useParams
import { useNavigate, useParams } from "react-router-dom";

export default function EditProdi() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State form
  const [formData, setFormData] = useState({
    nama: "",
    singkatan: "",
    fakultas_id: "",
  });

  // State daftar fakultas (dropdown)
  const [fakultas, setFakultas] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch data prodi + fakultas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);

        const [prodiRes, fakultasRes] = await Promise.all([
          axios.get(`https://newexpresssi5a-weld.vercel.app/api/prodi/${id}`),
          axios.get(`https://newexpresssi5a-weld.vercel.app/api/fakultas`),
        ]);

        setFormData({
          nama: prodiRes.data.nama,
          singkatan: prodiRes.data.singkatan,
          fakultas_id:
            prodiRes.data.fakultas_id?._id || prodiRes.data.fakultas_id,
        });

        setFakultas(fakultasRes.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Gagal mengambil data"
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.singkatan || !formData.fakultas_id) {
      setError("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.patch(
        `https://newexpresssi5a-weld.vercel.app/api/prodi/${id}`,
        formData
      );

      navigate("/prodi");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengupdate data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Program Studi</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama Prodi</label>
          <input
            type="text"
            className="form-control"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Singkatan</label>
          <input
            type="text"
            className="form-control"
            name="singkatan"
            value={formData.singkatan}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fakultas</label>
          <select
            className="form-control"
            name="fakultas_id"
            value={formData.fakultas_id}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">-- Pilih Fakultas --</option>
            {fakultas.map((f) => (
              <option key={f._id} value={f._id}>
                {f.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Mengupdate..." : "Update"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/prodi")}
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
