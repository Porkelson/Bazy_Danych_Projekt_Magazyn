import React, { useEffect, useState } from "react";
import { getZamowieniaKlienci, getZamowieniaMagazyn, addZamowienie } from "../services/api";
import Loader from "../components/Loader";

const Zamowienia = () => {
    const [zamowienia, setZamowienia] = useState([]);
    const [newZamowienie, setNewZamowienie] = useState({
        produkt_id: "",
        dostawca_id: "",
        klient_id: "",
        ilosc: 0,
        status: "oczekujące"
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState("produkt_id"); // Kolumna do sortowania
    const [sortOrder, setSortOrder] = useState("asc"); // Kolejność sortowania

    // Pobranie zamówień z API
    useEffect(() => {
        const fetchZamowienia = async () => {
            try {
                const data = await getZamowieniaMagazyn();
                setZamowienia(data);
            } catch (err) {
                setError("Nie udało się pobrać zamówień.");
            } finally {
                setLoading(false);
            }
        };
        fetchZamowienia();
    }, []);

    // Obsługa błędu i ładowania
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }

    // Obsługa sortowania
    const handleSort = (column) => {
        const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortOrder(newSortOrder);
    };

    // Sortowanie zamówień
    const sortedOrders = [...zamowienia].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // Obsługa formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addZamowienie(newZamowienie);
            const data = await getZamowieniaMagazyn();
            setZamowienia(data);
            setNewZamowienie({
                produkt_id: "",
                dostawca_id: "",
                klient_id: "",
                ilosc: 0,
                status: "oczekujące"
            });
        } catch (err) {
            console.error("Błąd podczas składania zamówienia:", err);
            setError("Nie udało się dodać zamówienia.");
        }
    };

    return (
        <div className="zamowienia-container">
            <h1>Lista Zamówień</h1>

            <table className="zamowienia-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("id")}>ID</th>
                        <th onClick={() => handleSort("produkt_id")}>Produkt ID</th>
                        <th onClick={() => handleSort("dostawca_id")}>Dostawca ID</th>
                        <th onClick={() => handleSort("ilosc")}>Ilość</th>
                        <th onClick={() => handleSort("status")}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOrders.map((zamowienie) => (
                        <tr key={zamowienie.id}>
                            <td>{zamowienie.id}</td>
                            <td>{zamowienie.produkt_id}</td>
                            <td>{zamowienie.dostawca_id}</td>
                            <td>{zamowienie.ilosc}</td>
                            <td>{zamowienie.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Dodaj Zamówienie</h2>
            <form className="zamowienia-form" onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Produkt ID"
                    value={newZamowienie.produkt_id}
                    onChange={(e) => setNewZamowienie({ ...newZamowienie, produkt_id: +e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Dostawca ID"
                    value={newZamowienie.dostawca_id}
                    onChange={(e) => setNewZamowienie({ ...newZamowienie, dostawca_id: +e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Klient ID"
                    value={newZamowienie.klient_id}
                    onChange={(e) => setNewZamowienie({ ...newZamowienie, klient_id: +e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Ilość"
                    value={newZamowienie.ilosc}
                    onChange={(e) => setNewZamowienie({ ...newZamowienie, ilosc: +e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={newZamowienie.status}
                    onChange={(e) => setNewZamowienie({ ...newZamowienie, status: e.target.value })}
                />
                <button type="submit">Dodaj Zamówienie</button>
            </form>
        </div>
    );
};

export default Zamowienia;
