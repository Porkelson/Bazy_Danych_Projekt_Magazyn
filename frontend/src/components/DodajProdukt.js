import React, { useState, useEffect } from "react";
import { getDostawcy, addProdukt } from "../services/api";
import "./dodajProdukt.css";

const DodajProdukt = () => {
  const [dostawcy, setDostawcy] = useState([]);
  const [nowyProdukt, setNowyProdukt] = useState({
    nazwa: "",
    kategoria: "",
    ilosc: "",
    cena_jednostkowa: "",
    dostawca_id: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Obsługa stanu wysyłania

  useEffect(() => {
    const fetchDostawcy = async () => {
      try {
        const data = await getDostawcy();
        setDostawcy(data);
      } catch (err) {
        alert("Nie udało się pobrać dostawców. Spróbuj ponownie później.");
      }
    };
    fetchDostawcy();
  }, []);

  const handleDodajProdukt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Blokowanie przycisku podczas wysyłania
    try {
      const response = await addProdukt(nowyProdukt);

      if (response.success) {
        alert(response.message || "Produkt został dodany pomyślnie!");
        setNowyProdukt({
          nazwa: "",
          kategoria: "",
          ilosc: "",
          cena_jednostkowa: "",
          dostawca_id: "",
        }); // Reset formularza
        window.location.reload(); // Reset podstrony
      } else {
        throw new Error(response.message || "Wystąpił błąd podczas dodawania produktu.");
      }
    } catch (err) {
      alert(err.message || "Nie udało się dodać produktu. Sprawdź dane i spróbuj ponownie.");
    } finally {
      setIsSubmitting(false); // Odblokowanie przycisku
    }
  };

  return (
    <form onSubmit={handleDodajProdukt}>
      <input
        type="text"
        placeholder="Nazwa"
        value={nowyProdukt.nazwa}
        onChange={(e) => setNowyProdukt({ ...nowyProdukt, nazwa: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Kategoria"
        value={nowyProdukt.kategoria}
        onChange={(e) => setNowyProdukt({ ...nowyProdukt, kategoria: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Ilość"
        value={nowyProdukt.ilosc}
        onChange={(e) => setNowyProdukt({ ...nowyProdukt, ilosc: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Cena jednostkowa"
        value={nowyProdukt.cena_jednostkowa}
        onChange={(e) => setNowyProdukt({ ...nowyProdukt, cena_jednostkowa: e.target.value })}
        required
      />

      <select
        name="dostawca_id"
        value={nowyProdukt.dostawca_id}
        onChange={(e) => setNowyProdukt({ ...nowyProdukt, dostawca_id: e.target.value })}
        required
      >
        <option value="">Wybierz dostawcę</option>
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
  );
};

export default DodajProdukt;
