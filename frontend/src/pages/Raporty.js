import React, { useState, useEffect } from 'react';
import { getNajbardziejOplacalniKlienci, getRaportNajlepszeProdukty, getRaportKlientow, getRaportDostawcow, getRaportZyskow } from '../services/api';
import Loader from '../components/Loader';
import '../styles/Raporty.css'; // Używamy pliku CSS, który zdefiniujemy poniżej

const Raporty = () => {
    const [oplacalniKlienci, setOplacalniKlienci] = useState([]);
    const [raportNajlepszeProdukty, setRaportNajlepszeProdukty] = useState([]);
    const [raportKlientow, setRaportKlientow] = useState([]);
    const [raportDostawcow, setRaportDostawcow] = useState([]);
    const [raportZyskow, setRaportZyskow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const oplacalniData = await getNajbardziejOplacalniKlienci();
                setOplacalniKlienci(oplacalniData);

                const najlepszeProduktyData = await getRaportNajlepszeProdukty();
                setRaportNajlepszeProdukty(najlepszeProduktyData);

                const klientowData = await getRaportKlientow();
                setRaportKlientow(klientowData);

                const dostawcowData = await getRaportDostawcow();
                setRaportDostawcow(dostawcowData);

                const zyskowData = await getRaportZyskow();
                setRaportZyskow(zyskowData);
            } catch (error) {
                setError(error.message || 'Wystąpił błąd.');
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    if (loading) return <Loader />;
    if (error) return <div>Błąd: {error}</div>;


    return (
        <div className="raport-container">
            <h1>Raporty</h1>
            <button className="refresh-button" onClick={() => window.location.reload()}>
                Odśwież Raport
            </button>
            <h2>Najbardziej Opłacalni Klienci</h2>
            <table className="raport-table">
                <thead>
                    <tr>
                        <th>Klient</th>
                        <th>Łączna wartość zamowieni</th>
                        {/* <th>Data Zamówienia</th>
                        <th>Status</th>
                        <th>Produkt</th>
                        <th>Ilość</th>
                        <th>Wartość Zamówienia</th> */}
                    </tr>
                </thead>
                <tbody>
                    {oplacalniKlienci.map((row, index) => (
                        <tr key={index}>
                            <td>{row.klient_nazwa}</td>
                            <td>{row.laczna_wartosc_zamowien} PLN</td>
                            {/* <td>{row.data_zamówienia}</td>
                            <td>{row.status}</td>
                            <td>{row.produkt_nazwa}</td>
                            <td>{row.ilosc}</td>
                            <td>{row.wartosc_zamowienia}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Najlepiej Sprzedające się Produkty</h2>
            <table className="raport-table">
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Liczba Sprzedaży</th>
                        <th>Wartość Sprzedaży</th>
                    </tr>
                </thead>
                <tbody>
                    {raportNajlepszeProdukty.map((row, index) => (
                        <tr key={index}>
                            <td>{row.produkt_nazwa}</td>
                            <td>{row.laczna_sprzedaz}</td>
                            <td>{row.wartosc_sprzedazy} PLN</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Raport Sprzedaży Miesięcznej</h2>
            <table className="raport-table">
                <thead>
                    <tr>
                        <th>Rok</th>
                        <th>Miesiąc</th>
                        <th>Liczba Sprzedaży</th>
                    </tr>
                </thead>
                <tbody>
                    {raportKlientow.map((row, index) => (
                        <tr key={index}>
                            <td>{row.rok}</td>
                            <td>{row.miesiac}</td>
                            <td>{row.laczna_sprzedaz} PLN</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Analiza Dostawców</h2>
            <table className="raport-table">
                <thead>
                    <tr>
                        <th>Dostawca</th>
                        <th>Liczba Zamówień</th>
                        <th>Wartość Zamówień</th>
                    </tr>
                </thead>
                <tbody>
                    {raportDostawcow.map((row, index) => (
                        <tr key={index}>
                            <td>{row.dostawca_nazwa}</td>
                            <td>{row.liczba_zamowien}</td>
                            <td>{row.wartosc_zamowien} PLN</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <h2>Raport Zysków i Wydatków Miesięczny</h2>

            {loading ? (
                <p>Ładowanie danych...</p>
            ) : (
                <table className="raport-table">
                    <thead>
                        <tr>
                            <th>Rok</th>
                            <th>Miesiąc</th>
                            <th>Zyski</th>
                            <th>Wydatki</th>
                            <th>Balans</th>
                        </tr>
                    </thead>
                    <tbody>
                        {raportZyskow.map((row, index) => (
                            <tr key={index}>
                                <td>{row.rok}</td>
                                <td>{row.miesiac}</td>
                                <td>{row.zyski} PLN</td>
                                <td>{row.wydatki} PLN</td>
                                <td>{row.zyski - row.wydatki} PLN</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>


    );
};

export default Raporty;
