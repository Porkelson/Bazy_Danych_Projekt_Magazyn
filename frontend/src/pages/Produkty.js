import React, { useEffect, useState } from "react";
import { getProdukty, addProdukt, getDostawcy } from "../services/api"; // Zakładamy, że `getDostawcy` jest dostępne
import Loader from "../components/Loader";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Produkty = () => {
  const [produkty, setProdukty] = useState([]);
  const [dostawcy, setDostawcy] = useState([]); // Dodano do trzymania listy dostawców
  const [newProdukt, setNewProdukt] = useState({
    nazwa: "",
    kategoria: "",
    ilosc: "",
    cena_jednostkowa: "",
    dostawca_id: "", // Nowe pole dla dostawcy
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Obsługa stanu wysyłania
  const [sortBy, setSortBy] = useState("nazwa");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produktyData = await getProdukty(sortBy, sortOrder);
        const dostawcyData = await getDostawcy(); // Pobranie listy dostawców
        setProdukty(produktyData);
        setDostawcy(dostawcyData);
      } catch {
        setError("Nie udało się pobrać danych.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy, sortOrder]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSort = debounce((column) => {
    if (column === sortBy) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }, 500);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Blokowanie przycisku podczas wysyłania
    try {
      await addProdukt(newProdukt);
      const updatedProdukty = await getProdukty(sortBy, sortOrder);
      setProdukty(updatedProdukty);
      alert("Produkt został dodany pomyślnie!");
      setNewProdukt({
        nazwa: "",
        kategoria: "",
        ilosc: "",
        cena_jednostkowa: "",
        dostawca_id: "",
      });
    } catch (err) {
      console.error("Błąd podczas dodawania produktu:", err);
      alert("Nie udało się dodać produktu. Sprawdź dane i spróbuj ponownie.");
    } finally {
      setIsSubmitting(false); // Odblokowanie przycisku
    }
    
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = produkty.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  return (
    <>
      <div>
        <h1>Lista Produktów</h1>

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
            Strona {currentPage} z {Math.ceil(produkty.length / itemsPerPage)}
          </div>
          <button 
            className="pagination-button" 
            onClick={handleNextPage} 
            disabled={indexOfLastItem >= produkty.length}
          >
            Następna
          </button>
        </div>


        {/* Tabela produktów */}
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("nazwa")}>
                Nazwa {sortBy === "nazwa" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("kategoria")}>
                Kategoria {sortBy === "kategoria" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("ilosc")}>
                Ilość {sortBy === "ilosc" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("cena_jednostkowa")}>
                Cena jednostkowa {sortBy === "cena_jednostkowa" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((produkt) => (
              <tr key={produkt[0]}>
                <td>{produkt[1]}</td>
                <td>{produkt[2]}</td>
                <td>{produkt[3]}</td>
                <td>{produkt[4]} PLN</td>
              </tr>
            ))}
          </tbody>
        </table>



        {/* Formularz do dodawania produktu */}
        <div className="form-wrapper">
        <h2>Dodaj produkt</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nazwa"
            value={newProdukt.nazwa}
            onChange={(e) => setNewProdukt({ ...newProdukt, nazwa: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Kategoria"
            value={newProdukt.kategoria}
            onChange={(e) => setNewProdukt({ ...newProdukt, kategoria: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Ilość"
            value={newProdukt.ilosc}
            onChange={(e) => setNewProdukt({ ...newProdukt, ilosc: +e.target.value })}
            required
            min="0"
          />
          <input
            type="number"
            placeholder="Cena jednostkowa"
            value={newProdukt.cena_jednostkowa}
            onChange={(e) => setNewProdukt({ ...newProdukt, cena_jednostkowa: +e.target.value })}
            required
            min="0"
            step="0.01"
          />
          <select
            value={newProdukt.dostawca_id}
            onChange={(e) => setNewProdukt({ ...newProdukt, dostawca_id: e.target.value })}
            required
          >
            <option value="" disabled>
              Wybierz dostawcę
            </option>
            {dostawcy.map((dostawca) => (
              <option key={dostawca.id} value={dostawca.id}>
                {dostawca.nazwa}
              </option>
            ))}
          </select>
          <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Dodawanie..." : "Dodaj Produkt"}
        </button>
        </form>
        </div>
      </div>
    </>
  );
};

export default Produkty;
