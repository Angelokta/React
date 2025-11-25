// import React mengimpor modul React dari pustaka react.
// { Suspense } mengimpor komponen Suspense dari pustaka React. Suspense digunakan untuk menunda rendering komponen hingga data atau kode yang diperlukan telah siap.
import React, { Suspense } from "react";

// { BrowserRouter as Router } mengimpor BrowserRouter dari pustaka react-router-dom dan memberinya alias Router. BrowserRouter adalah komponen yang membungkus seluruh aplikasi untuk menyediakan fitur routing.
import { BrowserRouter as Router, Routes, Route, NavLink} from "react-router-dom";

// impor komponen 
const Home = React.lazy(() => import("./components/Home"));
const FakultasList = React.lazy(() => import("./components/Fakultas/List"));
const FakultasCreate = React.lazy(() => import("./components/Fakultas/Create"));
const ProdiList = React.lazy(() => import("./components/Prodi/List"));
const ProdiCreate = React.lazy(() => import("./components/Prodi/Create"));
const MahasiswaList = React.lazy(() => import("./components/Mahasiswa/List"));
const MahasiswaCreate = React.lazy(() => import("./components/Mahasiswa/Create"));

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/fakultas">
                  Fakultas
                </NavLink>
              </li>
               <li className="nav-item">
                <NavLink className="nav-link" to="/prodi">
                  Program Studi
                </NavLink>
              </li>
                <li className="nav-item">
                <NavLink className="nav-link" to="/mahasiswa">
                  Mahasiswa
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Kita bisa memberikan fallback (komponen pengganti) yang ditampilkan selama proses pemuatan. */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Routes mengimpor komponen Routes dari react-router-dom. Routes membungkus satu atau beberapa Route. Dengan menggunakan Routes, React akan mencari Route yang cocok dengan URL saat ini dan merender komponen yang sesuai. */}
        <Routes>
          {/* Route mengimpor komponen Route dari react-router-dom. Route digunakan untuk mendefinisikan satu jalur (route) dalam aplikasi. */}
          <Route path="/" element={<Home />} />
          <Route path="/fakultas" element={<FakultasList />} />
          <Route path="/fakultas/create" element={<FakultasCreate />} />
          <Route path="/prodi" element={<ProdiList />} />
          <Route path="/prodi/create" element={<ProdiCreate />} />
          <Route path="/mahasiswa" element={<MahasiswaList />} />
          <Route path="/mahasiswa/create" element={<MahasiswaCreate />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;