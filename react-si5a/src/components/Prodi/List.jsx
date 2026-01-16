import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProdiList() {
  const [prodi, setProdi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://newexpresssi5a-weld.vercel.app/api/prodi"
        );
        setProdi(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProdi();
  }, []);

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: `Yakin hapus prodi ${nama}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://newexpresssi5a-weld.vercel.app/api/prodi/${id}`
          )
          .then(() => {
            setProdi(prodi.filter((p) => p._id !== id));
            Swal.fire("Deleted!", "Prodi berhasil dihapus", "success");
          });
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Program Studi</h1>

      <NavLink to="/prodi/create" className="btn btn-primary mb-3">
        Tambah Prodi
      </NavLink>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nama Prodi</th>
            <th>Fakultas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {prodi.map((item) => (
            <tr key={item._id}>
              <td>{item.nama}</td>
              <td>{item.fakultas_id?.nama}</td>
              <td>
                <NavLink
                  to={`/prodi/edit/${item._id}`}
                  className="btn btn-warning me-2"
                >
                  Edit
                </NavLink>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id, item.nama)}
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
