import React, { useState, useEffect } from "react";
import { getDostawcy, dodajDostawce } from "../services/api"; // Importujemy funkcję dodawania dostawcy
import Loader from '../components/Loader';

const Dostawcy = () => {
  const [dostawcy, setDostawcy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // Stan dla nowego dostawcy
  const [nowyDostawca, setNowyDostawca] = useState({
    nazwa: "",
    kontakt: "",
    lokalizacja: ""
  });

  useEffect(() => {
    const fetchDostawcy = async () => {
      try {
        const data = await getDostawcy();
        setDostawcy(data);
      } catch (err) {
        setError("Nie udało się pobrać danych.");
      } finally {
        setLoading(false);
      }
    };
    fetchDostawcy();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNowyDostawca((prev) => ({ ...prev, [name]: value }));
  };

  const handleDodajDostawce = async (e) => {
    e.preventDefault();
    try {
      const response = await dodajDostawce(nowyDostawca);
      alert(response.message || "Dostawca został dodany pomyślnie!");

      // Po dodaniu dostawcy, odśwież listę dostawców
      const data = await getDostawcy();
      setDostawcy(data);

      // Wyczyść formularz
      setNowyDostawca({ nazwa: "", kontakt: "", lokalizacja: "" });
    } catch (error) {
      alert("Nie udało się dodać dostawcy. Sprawdź dane i spróbuj ponownie.");
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
  const currentItems = dostawcy.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div>
      <h1>Lista Dostawców</h1>

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
            Strona {currentPage} z {Math.ceil(dostawcy.length / itemsPerPage)}
          </div>
          <button 
            className="pagination-button" 
            onClick={handleNextPage} 
            disabled={indexOfLastItem >= dostawcy.length}
          >
            Następna
          </button>
        </div>

      <table border="1">
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Nazwa</th>
            <th>Kontakt</th>
            <th>Lokalizacja</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((dostawca) => (
            <tr key={dostawca.id}>
              {/* <td>{dostawca.id}</td> */}
              <td>{dostawca.nazwa}</td>
              <td>{dostawca.kontakt}</td>
              <td>{dostawca.lokalizacja}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-wrapper">
      <h2>Dodaj Nowego Dostawcę</h2>
      <form onSubmit={handleDodajDostawce}>
          <input
            type="text"
            name="nazwa"
            placeholder="Nazwa dostawcy"
            value={nowyDostawca.nazwa}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="kontakt"
            placeholder="Kontakt (email)"
            value={nowyDostawca.kontakt}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="lokalizacja"
            placeholder="Lokalizacja"
            value={nowyDostawca.lokalizacja}
            onChange={handleInputChange}
            required
          />
        <button type="submit">Dodaj Dostawcę</button>
      </form>
      </div>
    </div>
  );
};

export default Dostawcy;
