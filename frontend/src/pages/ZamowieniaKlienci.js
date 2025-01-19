import React, { useEffect, useState } from "react";
import { getZamowieniaKlienci, zmienStatusZamowieniaKlient, addZamowienieKlienta } from "../services/api";
import { getProdukty, getKlienci } from "../services/api";
import Loader from "../components/Loader";

const ZamowieniaKlienci = () => {
  const [zamowienia, setZamowienia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("nazwa");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 4;
  const [statusFilter, setStatusFilter] = useState("");
  const [produkty, setProdukty] = useState([]);
  const [zamowienie, setZamowienie] = useState({
    produkt_id: "",
    klient_id: "",
    ilosc: "",
  });
  const [koszt, setKoszt] = useState(0);
  const [klienci, setKlienci] = useState([]);

  const calculateCost = (ilosc, produkt_id) => {
    const selectedProdukt = produkty.find((p) => p[0] === parseInt(produkt_id));
    console.log("Obliczanie kosztu:", { ilosc, produkt_id });
    if (selectedProdukt) {
      const koszt = ilosc * selectedProdukt[4];
      setKoszt(koszt);
      console.log("Obliczony koszt:", koszt);
    } else {
      setKoszt(0);
    }
  }
  useEffect(() => {
    const fetchZamowieniaKlienci = async () => {
      try {
        setLoading(true);
        const data = await getZamowieniaKlienci(sortBy, sortOrder);
        setZamowienia(data);
      } catch (err) {
        setError(err.message || "Wystąpił błąd.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProdukty = async () => {
      try {
        const data = await getProdukty(sortBy, sortOrder);
        setProdukty(data);
      } catch (error) {
        alert("Nie udało się pobrać produktów.");
      }
    };

    const fetchKlienci = async () => {
      try {
        const data = await getKlienci();
        setKlienci(data);
      } catch (error) {
        alert("Nie udało się pobrać klientów.");
      }
    };

    fetchZamowieniaKlienci();
    fetchProdukty();
    fetchKlienci();
  }, [sortBy, sortOrder]);

  const handleProduktChange = (e) => {
    const produkt_id = e.target.value;
    setZamowienie((prev) => ({ ...prev, produkt_id }));
    calculateCost(zamowienie.ilosc, zamowienie.produkt_id);
    console.log("=====================================");
    console.log("Ilość:", zamowienie.ilosc);
    console.log("Dostawca ID:", zamowienie.produkt_id);
    console.log("Klient_id:", zamowienie.klient_id);
    console.log("=====================================");
  };

  const handleKlientChange = (e) => {
    const klient_id = e.target.value;
    setZamowienie((prev) => ({ ...prev, klient_id }));
  };

  const handleIloscChange = (e) => {
    const ilosc = e.target.value;
    setZamowienie((prev) => ({ ...prev, ilosc }));
    calculateCost(zamowienie.ilosc, zamowienie.produkt_id);
    console.log("=====================================");
    console.log("Ilość:", zamowienie.ilosc);
    console.log("Dostawca ID:", zamowienie.produkt_id);
    console.log("Klient_id:", zamowienie.klient_id);
    console.log("=====================================");
  };


  const handleStatusChange = async (zamowienieId, newStatus) => {
    const confirmation = window.confirm(`Czy na pewno zmienić status na "${newStatus}"?`);
    if (!confirmation) return;
  
    try {
      const response = await zmienStatusZamowieniaKlient(zamowienieId, newStatus);
      alert(response.message || "Status zamówienia zmieniony pomyślnie!");
      const data = await getZamowieniaKlienci(sortBy, sortOrder);
      setZamowienia(data);
    } catch (error) {
      alert("Nie udało się zmienić statusu zamówienia.");
    }
  };
  
  // useEffect(() => {
  //   if (zamowienie.produkt_id && zamowienie.ilosc) {
  //     calculateCost();
  //   }
  // }, [zamowienie.produkt_id, zamowienie.ilosc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
      try {
        await addZamowienieKlienta(zamowienie);
        alert("Zamówienie dodane pomyślnie!");
        setZamowienie({ produkt_id: "", dostawca_id: "", ilosc: "" }); // Reset formularza
        setKlienci([]); // Reset dostawców
        const data = await getZamowieniaKlienci();
        setZamowienia(data);
      } catch (error) {
        alert("Nie udało się dodać zamówienia.");
      } finally {
        setLoading(false);
      }
  };

  // const handleSort = (column) => {
  //   if (column === sortBy) {
  //     setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  //   } else {
  //     setSortBy(column);
  //     setSortOrder("asc");
  //   }
  // };

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
      <h1>Zamówienia Klientów</h1>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">Wszystkie statusy</option>
        <option value="oczekujące">Oczekujące</option>
        <option value="anulowane">Anulowane</option>
        <option value="zrealizowane">Zrealizowane</option>
      </select>

      {/* Paginacja */}
      {/* <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Poprzednia
        </button>
        <button
          onClick={handleNextPage}
          disabled={indexOfLastItem >= zamowienia.length}
        >
          Następna
        </button>
      </div>
      <div>
        Strona {currentPage} z {Math.ceil(filteredItems.length / itemsPerPage)}
      </div> */}

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

      {/* Tabela */}
      <table>
        <thead>
          <tr>
            <th>
              Nazwa
            </th>
            <th>Ilość</th>
            <th>Cena jednostkowa</th>
            <th>Cena całościowa</th>
            <th >
              Status 
            </th>
            <th>
              Data zamówienia
            </th>
            <th>Klient_ID</th>
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
              <td>{zamowienie[2]}</td> {/* Klient_ID */} 
              {/* <td>{zamowienie[1]}</td> Produkt_ID */}
              {/* <td>{zamowienie[0]}</td> ID  */}
              <td>
                <select
                  onChange={(e) => handleStatusChange(zamowienie[0], e.target.value)}
                  defaultValue={zamowienie[4]}
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


      
      <div className="form-wrapper">
      <h2>Dodaj Nowe Zamówienie dla Klienta</h2>
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
            {produkt[1]} (Cena: {produkt[4]} PLN)
          </option>
        ))}
      </select>

      <select
        name="klient_id"
        value={zamowienie.klient_id}
        onChange={handleKlientChange}
        required
      >
        <option value="">Wybierz klienta</option>
        {klienci.map((klient) => (
          <option key={klient.id} value={klient.id}>
            {klient.nazwa}
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

      <p>Koszt zamówienia: {koszt.toFixed(2)} PLN</p>

      <button type="submit">Złóż zamówienie</button>
    </form>
    </div>
    </div>
  );
};

export default ZamowieniaKlienci;
