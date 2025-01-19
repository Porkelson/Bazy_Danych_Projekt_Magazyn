import React, { useEffect, useState } from 'react';
import { getZamowieniaMagazyn, zmienStatusZamowieniaMagazyn, addZamowienieMagazynu } from "../services/api";
import { getProdukty } from '../services/api';
import { getDostawcy, getAvailableSuppliers, addWarehouseOrder   } from '../services/api';
import Loader from '../components/Loader';

const ZamowieniaMagazyn = () => {
  const [zamowienia, setZamowienia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [statusFilter, setStatusFilter] = useState("");
  const [zamowienie, setZamowienie] = useState({
    produkt_id: "",
    dostawca_id: "",
    ilosc: "",
  });
    const [sortBy, setSortBy] = useState("nazwa");
    const [sortOrder, setSortOrder] = useState("asc");

  const [produkty, setProdukty] = useState([]);
  const [dostawcy, setDostawcy] = useState([]);
  const [koszt, setKoszt] = useState(0); // Nowy stan dla kosztu

  const calculateCost = (ilosc, dostawca_id) => {
    console.log("Obliczanie kosztu:", { ilosc, dostawca_id });
    const selectedDostawca = dostawcy.find((d) => d.id === parseInt(dostawca_id));
    console.log("Wybrany dostawca:", selectedDostawca);
  
    if (selectedDostawca) {
      const koszt = ilosc * selectedDostawca.cena;
      console.log("Obliczony koszt:", koszt);
      setKoszt(koszt);
    } else {
      setKoszt(0);
    }
  };
  
  

  
  useEffect(() => {
    const fetchZamowieniaMagazyn = async () => {
      try {
        setLoading(true);
        const data = await getZamowieniaMagazyn();
        setZamowienia(data);
        const dataProdukty = await getProdukty(sortBy, sortOrder); // Pobierz wszystkie produkty
        setProdukty(dataProdukty);
      } catch (err) {
        setError(err.message || 'Wystąpił błąd.');
      } finally {
        setLoading(false);
      }
    };

    fetchZamowieniaMagazyn();
    // fetchProdukty();
  }, []);

  // Obsługa zmiany produktu - pobierz dostępnych dostawców
  const handleProduktChange = async (e) => {
    const produkt_id = e.target.value;
    setZamowienie((prev) => ({ ...prev, produkt_id, dostawca_id: "" })); // Resetuj dostawcę
    if (!produkt_id){
      setDostawcy([]);
      return;
    } 

    try {
      const data = await getAvailableSuppliers(produkt_id, zamowienie.ilosc || 0);
      setDostawcy(data);
    } catch (error) {
      alert("Nie udało się pobrać dostawców dla wybranego produktu.");
    }
  };

  // Obsługa zmiany pola formularza
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setZamowienie((prev) => ({ ...prev, [name]: value }));
  };

  // Dodanie zamówienia do magazynu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addZamowienieMagazynu(zamowienie);
      alert("Zamówienie dodane pomyślnie!");
      setZamowienie({ produkt_id: "", dostawca_id: "", ilosc: "" }); // Reset formularza
      setDostawcy([]); // Reset dostawców
      const data = await getZamowieniaMagazyn();
      setZamowienia(data);
    } catch (error) {
      alert("Nie udało się dodać zamówienia.");
    } finally {
      setLoading(false);
    }
  };

  const handleIloscChange = (e) => {
    const ilosc = e.target.value;
    setZamowienie((prev) => ({ ...prev, ilosc }));
    calculateCost(ilosc, zamowienie.dostawca_id); // Oblicz koszt przy zmianie ilości
    console.log("Ilość:", zamowienie.ilosc);
    console.log("Dostawca ID:", zamowienie.dostawca_id);

  };
  
  const handleDostawcaChange = (e) => {
    const dostawca_id = e.target.value;
    setZamowienie((prev) => ({ ...prev, dostawca_id }));
    calculateCost(zamowienie.ilosc, dostawca_id); // Oblicz koszt przy zmianie dostawcy
    console.log("Ilość:", zamowienie.ilosc);
    console.log("Dostawca ID:", zamowienie.dostawca_id);

  };
  
  
  const handleStatusChange = async (zamowienieId, newStatus) => {
    const confirmation = window.confirm(`Czy na pewno zmienić status na "${newStatus}"?`);
    if (!confirmation) return;
  
    try {
      const response = await zmienStatusZamowieniaMagazyn(zamowienieId, newStatus);
      alert(response.message || "Status zamówienia zmieniony pomyślnie!");
      const data = await getZamowieniaMagazyn();
      setZamowienia(data);
    } catch (error) {
      alert("Nie udało się zmienić statusu zamówienia.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = zamowienia.filter((zamowienie) =>
    statusFilter ? zamowienie[4] === statusFilter : true
  );
  
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  
  // const currentItems = zamowienia.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (indexOfLastItem < filteredItems.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (indexOfFirstItem > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div>
  <h1>Zamówienia do Magazynu</h1>
  <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">Wszystkie statusy</option>
        <option value="oczekujące">Oczekujące</option>
        <option value="anulowane">Anulowane</option>
        <option value="zrealizowane">Zrealizowane</option>
    </select>
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
          Strona {currentPage} z {Math.ceil(filteredItems.length / itemsPerPage)}
        </div>
        <button 
          className="pagination-button" 
          onClick={handleNextPage} 
          disabled={indexOfLastItem >= filteredItems.length}
        >
          Następna
        </button>
      </div>
  <table>
    <thead>
      <tr>
        <th>Nazwa</th>
        <th>Ilość</th>
        <th>Cena jednostkowa</th>
        <th>Cena całościowa</th>
        <th>Status</th>
        <th>Data zamówienia</th>
        <th>Dostawca_ID</th>
        {/* <th>Produkt_ID</th> */}
        {/* <th>ID</th> */}
        <th>Akcje</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((zamowienie) => (
        <tr key={zamowienie[0]}>
          <td>{zamowienie[6]}</td> {/* Nazwa */}
          <td>{zamowienie[3]}</td> {/* Ilość */}
          <td>{zamowienie[7]} PLN</td> {/* Cena jednostkowa */}
          <td>{zamowienie[8]} PLN</td> {/* Cena całościowa */}
          <td>
            <span className={`status-${zamowienie[4].toLowerCase()}`}>
              {zamowienie[4]}
            </span>
          </td> {/* Status */}
          <td>{zamowienie[5]}</td> {/* Data zamówienia */}
          <td>{zamowienie[2]}</td> {/* Dostawca_ID */}
          {/* <td>{zamowienie[1]}</td> Produkt_ID  */}
          {/* <td>{zamowienie[0]}</td> ID */}
          <td>
            <select
              onChange={(e) => handleStatusChange(zamowienie[0], e.target.value)}
              defaultValue={zamowienie[4]} // Ustawia domyślny status na aktualny status
            >
              <option value="oczekujące">Oczekujące</option>
              <option value="anulowane">Anulowane</option>
              <option value="zrealizowane">Zrealizowane</option>
            </select>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  
  <div className='form-wrapper'>
  <h2>Dodaj Zamówienie do Magazynu</h2>
  <form onSubmit={handleSubmit}>
  <select
    name="produkt_id"
    value={zamowienie.produkt_id}
    onChange={handleProduktChange}
    required
  >
    <option value="">Wybierz produkt</option>
    {produkty.map((produkt) => (
      <option key={produkt[0]} value={produkt[0]}>
        {produkt[1]}
      </option>
    ))}
  </select>

  <select
    name="dostawca_id"
    value={zamowienie.dostawca_id}
    onChange={handleDostawcaChange}
    required
  >
    <option value="">Wybierz dostawcę</option>
    {dostawcy.map((dostawca) => (
      <option key={dostawca.id} value={dostawca.id}>
        {dostawca.nazwa} (Cena: {dostawca.cena})
      </option>
    ))}
  </select>

  <input
    type="number"
    name="ilosc"
    value={zamowienie.ilosc}
    onChange={handleIloscChange}
    min="1"
    required
    placeholder="Ilość"
  />

  <p>Koszt zamówienia: {koszt.toFixed(2)} PLN</p> {/* Wyświetlanie kosztu */}
  
  <button type="submit">Złóż zamówienie</button>
</form>
      </div>
</div>

  );
};

export default ZamowieniaMagazyn;
