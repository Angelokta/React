// Import useState untuk mengelola state
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request
import axios from "axios";

export default function CreateMahasiswa() {
  // State untuk menyimpan list Fakultas dari API
  const [prodiList, setProdiList] = useState([]);

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    npm: "",
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    prodi_id: "",
  });

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading
  const [loading, setLoading] = useState(false);

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
    if (!formData.npm || !formData.nama || !formData.tempat_lahir || !formData.tanggal_lahir || !formData.prodi_id) {
      setError("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Kirim POST request ke API
      const response = await axios.post(
        "https://newexpresssi5a-weld.vercel.app/api/mahasiswa",
        formData
      );

      console.log("Mahasiswa created:", response.data);
      alert("Data berhasil disimpan!");

      // Reset form setelah berhasil
      setFormData({
        npm: "",
        nama: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        prodi_id: "",
      });
    } catch (err) {
      console.error("Error creating prodi:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  // useEffect akan dijalankan sekali saat komponen pertama kali di-render
  useEffect(() => {
    // Fungsi async untuk fetch data dari API
    const fetchProdi = async () => {
      try {
        // Set loading true sebelum fetch data
        setLoading(true);
        // Mengambil data dari API menggunakan axios
        const response = await axios.get(
          "https://newexpresssi5a-weld.vercel.app/api/prodi"
        );
        // Simpan data yang diterima ke state fakultas
        setProdiList(response.data);
        // Reset error jika fetch berhasil
        setError(null);
      } catch (err) {
        // Jika terjadi error, simpan pesan error ke state
        setError(err.message);
        console.error("Error fetching prodi:", err);
      } finally {
        // Set loading false setelah proses selesai (berhasil atau gagal)
        setLoading(false);
      }
    };

    // Panggil fungsi fetchProdi
    fetchProdi();
  }, []); // Dependency array kosong = hanya dijalankan sekali saat mount

  // Render form dengan integrasi API
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tambah Mahasiswa</h2>

      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="npm" className="form-label">
            NPM
          </label>
          <input
            type="text"
            className="form-control"
            id="npm"
            name="npm"
            value={formData.npm}
            onChange={handleChange}
            placeholder="Contoh: 2327240142"
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="nama" className="form-label">
            Nama
          </label>
          <input
            type="text"
            className="form-control"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Contoh: Angel"
            disabled={loading}
          />
        </div>

         <div className="mb-3">
          <label htmlFor="tempat_lahir" className="form-label">
            Tempat Lahir
          </label>
          <input
            type="text"
            className="form-control"
            id="tempat_lahir"
            name="tempat_lahir"
            value={formData.tempat_lahir}
            onChange={handleChange}
            placeholder="Contoh: Jerman"
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tanggal_lahir" className="form-label">
            Tanggal Lahir
          </label>
          <input
            type="date"
            className="form-control"
            id="tanggal_lahir"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            placeholder="Contoh: 20-10-2005"
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="prodi_id" className="form-label">
            ID Prodi Pakai Select
          </label>
          {/* <input
            type="text"
            className="form-control"
            id="fakultas_id"
            name="fakultas_id"
            value={formData.fakultas_id}
            onChange={handleChange}
            placeholder="Masukkan ID Fakultas"
            disabled={loading}
          /> */}
          <select name="prodi_id" id="prodi_id" value={formData.prodi_id} onChange={handleChange} className="form-control">
            {prodiList.map((prodiItem) => (
              <option value={prodiItem._id} key={prodiItem._id}>
                {prodiItem.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
