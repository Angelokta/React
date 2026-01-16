import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

export default function MahasiswaList() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMahasiswa = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://newexpresssi5a-weld.vercel.app/api/mahasiswa"
        );
        setMahasiswa(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMahasiswa();
  }, []);

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: `Yakin hapus ${nama}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://newexpresssi5a-weld.vercel.app/api/mahasiswa/${id}`
          )
          .then(() => {
            setMahasiswa(mahasiswa.filter((m) => m._id !== id));
            Swal.fire("Deleted!", "Mahasiswa berhasil dihapus", "success");
          });
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Mahasiswa</h1>

      <NavLink to="/mahasiswa/create" className="btn btn-primary mb-3">
        Tambah Mahasiswa
      </NavLink>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>NPM</th>
            <th>Nama</th>
            <th>Tempat Lahir</th>
            <th>Tanggal Lahir</th>
            <th>Prodi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((mhs) => (
            <tr key={mhs._id}>
              <td>{mhs.npm}</td>
              <td>{mhs.nama}</td>
              <td>{mhs.tempat_lahir}</td>
              <td>
                {new Date(mhs.tanggal_lahir).toLocaleDateString("id-ID")}
              </td>
              <td>{mhs.prodi_id?.nama}</td>
              <td>
                <NavLink
                  to={`/mahasiswa/edit/${mhs._id}`}
                  className="btn btn-warning me-2"
                >
                  Edit
                </NavLink>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(mhs._id, mhs.nama)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
