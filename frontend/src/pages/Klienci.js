import React, { useState, useEffect } from "react";
import { getKlienci, dodajKlienta } from "../services/api"; // Importujemy funkcję dodawania klienta
import Loader from '../components/Loader';

const Klienci = () => {
  const [klienci, setKlienci] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // Stan dla nowego klienta
  const [nowyKlient, setNowyKlient] = useState({
    nazwa: "",
    email: "",
    telefon: "",
    adres: ""
  });

  useEffect(() => {
    const fetchKlienci = async () => {
      try {
        const data = await getKlienci();
        setKlienci(data);
      } catch (err) {
        setError("Nie udało się pobrać danych.");
      } finally {
        setLoading(false);
      }
    };
    fetchKlienci();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNowyKlient((prev) => ({ ...prev, [name]: value }));
  };

  const handleDodajKlienta = async (e) => {
    e.preventDefault();
    try {
      const response = await dodajKlienta(nowyKlient);
      alert(response.message || "Klient został dodany pomyślnie!");

      // Po dodaniu klienta, odśwież listę klientów
      const data = await getKlienci();
      setKlienci(data);

      // Wyczyść formularz
      setNowyKlient({ nazwa: "", email: "", telefon: "", adres: "" });
    } catch (error) {
      alert("Nie udało się dodać klienta. Sprawdź dane i spróbuj ponownie.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = klienci.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div>
      <h1>Lista Klientów</h1>

      {/* Paginacja */}
      <div className="pagination-container">
          <button 
            className="pagination-button" 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            Poprzednia
          </button>
          <div className="page-counter">
            Strona {currentPage} z {Math.ceil(klienci.length / itemsPerPage)}
          </div>
          <button 
            className="pagination-button" 
            onClick={handleNextPage} 
            disabled={indexOfLastItem >= klienci.length}
          >
            Następna
          </button>
        </div>

      <table border="1">
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Nazwa</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Adres</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((klient) => (
            <tr key={klient.id}>
              {/* <td>{klient.id}</td> */}
              <td>{klient.nazwa}</td>
              <td>{klient.email}</td>
              <td>{klient.telefon}</td>
              <td>{klient.adres}</td>
            </tr>
          ))}
        </tbody>
      </table>

<div className="form-wrapper">
      <h2>Dodaj Nowego Klienta</h2>
  <form onSubmit={handleDodajKlienta}>
    <input
      type="text"
      name="nazwa"
      placeholder="Nazwa"
      value={nowyKlient.nazwa}
      onChange={handleInputChange}
      required
    />
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={nowyKlient.email}
      onChange={handleInputChange}
      required
    />
    <input
      type="text"
      name="telefon"
      placeholder="Telefon"
      value={nowyKlient.telefon}
      onChange={handleInputChange}
      required
    />
    <input
      type="text"
      name="adres"
      placeholder="Adres"
      value={nowyKlient.adres}
      onChange={handleInputChange}
      required
    />
    <button type="submit" className="btn-submit">Dodaj Klienta</button>
  </form>
</div>


      {/* <h2>Dodaj Nowego Klienta</h2>
      <form onSubmit={handleDodajKlienta}>
          <input
            type="text"
            name="nazwa"
            placeholder="Nazwa"
            value={nowyKlient.nazwa}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={nowyKlient.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="telefon"
            placeholder="Telefon"
            value={nowyKlient.telefon}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="adres"
            placeholder="Adres"
            value={nowyKlient.adres}
            onChange={handleInputChange}
            required
          />
        <button type="submit">Dodaj Klienta</button>
      </form> */}
    </div>
  );
};

export default Klienci;
