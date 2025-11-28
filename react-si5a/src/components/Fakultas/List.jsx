// Import hooks dari React untuk state management dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

export default function FakultasList() {
  // State untuk menyimpan data fakultas dari API
  const [fakultas, setFakultas] = useState([]);
  // State untuk menandakan proses loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState(null);

  // useEffect akan dijalankan sekali saat komponen pertama kali di-render
  useEffect(() => {
    // Fungsi async untuk fetch data dari API
    const fetchFakultas = async () => {
      try {
        // Set loading true sebelum fetch data
        setLoading(true);
        // Mengambil data dari API menggunakan axios
        const response = await axios.get(
          "https://newexpresssi5a-weld.vercel.app/api/fakultas"
        );
        // Simpan data yang diterima ke state fakultas
        setFakultas(response.data);
        // Reset error jika fetch berhasil
        setError(null);
      } catch (err) {
        // Jika terjadi error, simpan pesan error ke state
        setError(err.message);
        console.error("Error fetching fakultas:", err);
      } finally {
        // Set loading false setelah proses selesai (berhasil atau gagal)
        setLoading(false);
      }
    };

    // Panggil fungsi fetchFakultas
    fetchFakultas();
  }, []); // Dependency array kosong = hanya dijalankan sekali saat mount

  // Tampilkan pesan loading jika data masih diambil
  if (loading) return <div>Loading...</div>;
  // Tampilkan pesan error jika ada kesalahan
  if (error) return <div>Error: {error}</div>;

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: `Yakin mau menghapus fakultas ${nama}`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if(result.isConfirmed){
          // panggil endpoint API express pakai axios.delete()
          axios.delete(`https://newexpresssi5a-weld.vercel.app/api/fakultas/${id}`)
          .then((response) => {
            // hapus baris pada tabel sesuai id / refresh state
            setFakultas(fakultas.filter((f) => f._id !== id))

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        })
      } // akhir if
    });
  }

  // Render tabel fakultas jika data sudah tersedia
  return (
    <div>
      <h1>Fakultas List</h1>
      <NavLink to="/fakultas/create" className="btn btn-primary mb-3">
        Tambah Fakultas
      </NavLink>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Singkatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop data fakultas dan tampilkan dalam baris tabel */}
          {fakultas.map((fak) => (
            // key={fak._id} untuk identifikasi unik setiap baris
            <tr key={fak._id}>
              <td>{fak.nama}</td>
              <td>{fak.singkatan}</td>
              <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(fak._id, fak.nama)}
                    >Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
