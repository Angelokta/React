import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function MahasiswaEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    npm: "",
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    prodi_id: "",
  });

  const [prodi, setProdi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);

        // ambil detail mahasiswa
        const mhsRes = await axios.get(
          `https://newexpresssi5a-weld.vercel.app/api/mahasiswa/${id}`
        );

        setFormData({
          npm: mhsRes.data.npm,
          nama: mhsRes.data.nama,
          tempat_lahir: mhsRes.data.tempat_lahir,
          tanggal_lahir: mhsRes.data.tanggal_lahir.split("T")[0],
          prodi_id: mhsRes.data.prodi_id?._id || "",
        });

        // ambil data prodi untuk dropdown
        const prodiRes = await axios.get(
          "https://newexpresssi5a-weld.vercel.app/api/prodi"
        );
        setProdi(prodiRes.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.patch(
        `https://newexpresssi5a-weld.vercel.app/api/mahasiswa/${id}`,
        formData
      );

      navigate("/mahasiswa");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>Edit Mahasiswa</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">NPM</label>
          <input
            type="text"
            className="form-control"
            name="npm"
            value={formData.npm}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nama</label>
          <input
            type="text"
            className="form-control"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tempat Lahir</label>
          <input
            type="text"
            className="form-control"
            name="tempat_lahir"
            value={formData.tempat_lahir}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tanggal Lahir</label>
          <input
            type="date"
            className="form-control"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Program Studi</label>
          <select
            className="form-select"
            name="prodi_id"
            value={formData.prodi_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih Prodi --</option>
            {prodi.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nama}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary me-2" disabled={loading}>
          {loading ? "Menyimpan..." : "Update"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/mahasiswa")}
        >
          Batal
        </button>
      </form>
    </div>
  );
}
