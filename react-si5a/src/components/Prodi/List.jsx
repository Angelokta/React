// Import hooks dari React untuk state management dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProdiList() {
  // State untuk menyimpan data prodi dari API
  const [prodi, setProdi] = useState([]);
  // State untuk menandakan proses loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState(null);

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
        // Simpan data yang diterima ke state prodi
        setProdi(response.data);
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


    fetchProdi();
  }, []); // Dependency array kosong = hanya dijalankan sekali saat mount

  // Tampilkan pesan loading jika data masih diambil
  if (loading) return <div>Loading...</div>;
  // Tampilkan pesan error jika ada kesalahan
  if (error) return <div>Error: {error}</div>;

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: `Yakin mau menghapus prodi ${nama}`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if(result.isConfirmed){
          // panggil endpoint API express pakai axios.delete()
          axios.delete(`https://newexpresssi5a-weld.vercel.app/api/prodi/${id}`)
          .then((response) => {
            // hapus baris pada tabel sesuai id / refresh state
            setProdi(prodi.filter((f) => f._id !== id))

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        })
      } // akhir if
    });
  }

  return (
    <div>
      <h1>Prodi List</h1>
      <NavLink to="/prodi/create" className="btn btn-primary mb-3">
        Tambah Prodi
      </NavLink>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Singkatan</th>
            <th>Fakultas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {prodi.map((prodi) => (
            <tr key={prodi._id}>
              <td>{prodi.nama}</td>
              <td>{prodi.singkatan}</td>
              <td>{prodi.fakultas_id? prodi.fakultas_id.nama : null}</td>
              <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(prodi._id, prodi.nama)}
                    >Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
