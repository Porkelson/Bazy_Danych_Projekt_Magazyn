import React, { useEffect, useState } from "react";
import { getLowStock, getAvailableSuppliers, addZamowienieMagazyn } from "../services/api";
import Loader from '../components/Loader';

const LowStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableSuppliers, setAvailableSuppliers] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Pobierz produkty o niskim stanie magazynowym
  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const data = await getLowStock();
      setProducts(data);
    } catch (err) {
      setError("Błąd podczas ładowania produktów o niskim stanie magazynowym.");
    } finally {
      setLoading(false);
    }
  };

  // Pobierz dostępnych dostawców dla wybranego produktu
  const fetchAvailableSuppliers = async (productId, quantity) => {
    try {
      const suppliers = await getAvailableSuppliers(productId, quantity);
      setAvailableSuppliers(suppliers);
    } catch (err) {
      setError("Nie udało się pobrać dostępnych dostawców.");
    }
  };

  // Złóż zamówienie do magazynu
  const handleOrder = async () => {
    if (!selectedProduct || !orderQuantity) {
      setError("Proszę wybrać produkt i ilość.");
      return;
    }

    try {
      setLoading(true);
      await addZamowienieMagazyn({
        produkt_id: selectedProduct.id,
        ilosc: orderQuantity,
      });
      alert("Zamówienie zostało złożone pomyślnie!");
      fetchLowStockProducts(); // Odśwież listę produktów
      setSelectedProduct(null);
      setOrderQuantity(1);
    } catch (err) {
      setError("Nie udało się złożyć zamówienia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setCurrentPage((prevPage) => prevPage - 1);

  if (loading) return <Loader />;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div>
      <h1>Produkty o niskim stanie magazynowym</h1>
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
            Strona {currentPage} z {Math.ceil(products.length / itemsPerPage)}
          </div>
          <button 
            className="pagination-button" 
            onClick={handleNextPage} 
            disabled={indexOfLastItem >= products.length}
          >
            Następna
          </button>
        </div>
      
      {/* <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Poprzednia
        </button>
        <button
          onClick={handleNextPage}
          disabled={indexOfLastItem >= products.length}
        >
          Następna
        </button>
      </div>
      <div>
        Strona {currentPage} z {Math.ceil(products.length / itemsPerPage)}
      </div> */}
      {/* {loading && <p>Ładowanie danych...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>} */}
      <table>
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Obecna Ilość</th>
            <th>Minimalny Stan</th>
            <th>Cena Jednostkowa (Magazynowa)</th>
            <th>Cena Całościowa (Magazynowa)</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product) => (
            <tr key={product.id}>
              <td>{product.nazwa}</td>
              <td>{product.ilosc}</td>
              <td>{product.minimalny_stan}</td>
              <td>{product.cena_jednostkowa} PLN</td>
              <td>{product.calkowita_cena} PLN</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    fetchAvailableSuppliers(product.id, 1);
                  }}
                >
                  Zamów
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      {selectedProduct && (
        <div>
          <h2>Zamawianie produktu: {selectedProduct.nazwa}</h2>
          
            <input
              type="number"
              placeholder={`Ilość`} 
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(Number(e.target.value))}
              min={selectedProduct.minimalny_stan - selectedProduct.ilosc} 
            />
       
          <button onClick={handleOrder}>Potwierdź zamówienie</button>

          {availableSuppliers.length > 0 && (
            <div>
              <h3>Dostępni dostawcy i cena jednostkowa:</h3>
              <ul>
                {availableSuppliers.map((supplier) => (
                  <li key={supplier.id}>
                    {supplier.nazwa} - {supplier.cena} zł
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LowStock;
