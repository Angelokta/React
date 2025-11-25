// Import hooks dari React untuk state management dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";

export default function MahasiswaList() {
  // State untuk menyimpan data fakultas dari API
  const [mahasiswa, setMahasiswa] = useState([]);
  // State untuk menandakan proses loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState(null);

  // useEffect akan dijalankan sekali saat komponen pertama kali di-render
  useEffect(() => {
    // Fungsi async untuk fetch data dari API
    const fetchMahasiswa = async () => {
      try {
        // Set loading true sebelum fetch data
        setLoading(true);
        // Mengambil data dari API menggunakan axios
        const response = await axios.get(
          "https://newexpresssi5a-weld.vercel.app/api/mahasiswa"
        );
        // Simpan data yang diterima ke state fakultas
        setMahasiswa(response.data);
        // Reset error jika fetch berhasil
        setError(null);
      } catch (err) {
        // Jika terjadi error, simpan pesan error ke state
        setError(err.message);
        console.error("Error fetching mahasiswa:", err);
      } finally {
        // Set loading false setelah proses selesai (berhasil atau gagal)
        setLoading(false);
      }
    };


    fetchMahasiswa();
  }, []); // Dependency array kosong = hanya dijalankan sekali saat mount

  // Tampilkan pesan loading jika data masih diambil
  if (loading) return <div>Loading...</div>;
  // Tampilkan pesan error jika ada kesalahan
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Mahasiswa List</h1>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>NPM</th>
            <th>Nama</th>
            <th>Tempat Lahir</th>
            <th>Tanggal Lahir</th>
            <th>Prodi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((mhs) => (
            <tr key={mhs._id}>
                <td>{mhs.npm}</td>
                <td>{mhs.nama}</td>
                <td>{mhs.tempat_lahir}</td>
                <td>{mhs.tanggal_lahir}</td>
                <td>{mhs.prodi_id.nama}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
