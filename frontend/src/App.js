import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Produkty from "./pages/Produkty";
import ZamowieniaKlienci from "./pages/ZamowieniaKlienci";
import ZamowieniaMagazyn from "./pages/ZamowieniaMagazyn";
import LowStock from "./pages/LowStock";
import Klienci from "./pages/Klienci";
import Dostawcy from "./pages/Dostawcy";
import Raporty from "./pages/Raporty";
import './styles/global.css';
import './styles/header.css';
import './styles/table.css';
import './styles/nav.css';
import './styles/select.css';
import './styles/status.css';
import './styles/forms.css';
import './styles/pagination.css';

const App = () => {
  return (
    <Router>
      <div>
        {/* Nawigacja */}
        <div className="nav-links">
          <NavLink 
            to="/produkty" 
            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
          >
            Produkty
          </NavLink>
          <NavLink 
            to="/low-stock" 
            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
          >
            Niskie Stany
          </NavLink>
          <NavLink 
            to="/zamowienia-klienci" 
            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
          >
            Zamówienia Klienci
          </NavLink>
          <NavLink 
            to="/zamowienia-magazyn" 
            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
          >
            Zamówienia Magazyn
          </NavLink>
          <NavLink 
            to="/raporty" 
            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
          >
            Raporty
          </NavLink>
          <NavLink 
            to="/klienci" 
            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
            >Klienci</NavLink>
          <NavLink
            to="/dostawcy"
            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
          >Dostawcy</NavLink>

        </div>
        {/* Routing */}
        <Routes>
          <Route path="/produkty" element={<Produkty />} />
          <Route path="/zamowienia-klienci" element={<ZamowieniaKlienci />} />
          <Route path="/zamowienia-magazyn" element={<ZamowieniaMagazyn />} />
          <Route path="/low-stock" element={<LowStock />} />
          <Route path="/raporty" element={<Raporty />} />
          <Route path="/klienci" element={<Klienci />} />
          <Route path="/dostawcy" element={<Dostawcy />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
