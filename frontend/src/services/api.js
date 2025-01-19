import axios from 'axios';

// URL dla API
const API_URL_PRODUKTY = "http://127.0.0.1:5000/api/produkty/";
const API_URL_ZAMOWIENIA = "http://127.0.0.1:5000/api/zamowienia/";
const API_URL_RAPORTY = "http://127.0.0.1:5000/api/raporty/";
const API_URL_KLIENCI = "http://127.0.0.1:5000/api/klienci/";
const API_URL_DOSTAWCY = "http://127.0.0.1:5000/api/dostawcy/";
// const API_BASE = "http://127.0.0.1:5000/api";

// Logowanie do konsoli (opcjonalne: do celów debugowania)
const logRequest = (message, data) => {
    console.log(`[API] ${message}:`, data);
};

// Funkcja do pobierania produktów
export const getProdukty = async (sortBy = "id", sortOrder = "asc") => {
    try {
        logRequest("Fetching produkty", { sortBy, sortOrder });
        const response = await axios.get(`${API_URL_PRODUKTY}?sort_by=${sortBy}&sort_order=${sortOrder}`);
        logRequest("Produkty fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching produkty:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do dodawania produktu
export const addProdukt = async (produkt) => {
    try {
        logRequest("Adding produkt", produkt);
        const response = await axios.post(API_URL_PRODUKTY, produkt);
        logRequest("Produkt added successfully", response.data);
    } catch (error) {
        console.error('[API] Error adding produkt:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do pobierania zamówień klientow
export const getZamowieniaKlienci = async () => {
    try {
        logRequest("Fetching zamówienia");
        const response = await axios.get(`${API_URL_ZAMOWIENIA}/klienci`);
        logRequest("Zamówienia fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching zamówienia:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do pobierania zamówień do magazynu
export const getZamowieniaMagazyn = async () => {
  try {
      logRequest("Fetching zamówienia");
      const response = await axios.get(`${API_URL_ZAMOWIENIA}/magazyn`);
      logRequest("Zamówienia fetched successfully", response.data);
      return response.data;
  } catch (error) {
      console.error('[API] Error fetching zamówienia:', error.response?.data || error.message);
      throw error;
  }
};

// Funkcja do dodawania zamówienia
export const addZamowienie = async (zamowienie) => {
    try {
        logRequest("Adding zamówienie", zamowienie);
        const response = await axios.post(API_URL_ZAMOWIENIA, zamowienie);
        logRequest("Zamówienie added successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error adding zamówienie:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do dodawania zamówienia klienta
export const addZamowienieKlienta = async (zamowienie) => {
    try {
        logRequest("Adding zamówienie", zamowienie);
        const response = await axios.post(`${API_URL_ZAMOWIENIA}klienci`, zamowienie);
        logRequest("Zamówienie added successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error adding zamówienie:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do dodawania zamówienia magazynu
export const addZamowienieMagazynu = async (zamowienie) => {
    try {
        logRequest("Adding zamówienie", zamowienie);
        const response = await axios.post(`${API_URL_ZAMOWIENIA}magazyn`, zamowienie);
        logRequest("Zamówienie added successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error adding zamówienie:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do pobierania produktów o niskim stanie
export const getLowStock = async () => {
    try {
        logRequest("Fetching low stock products");
        const response = await axios.get(`${API_URL_PRODUKTY}low_stock`);
        logRequest("Low stock products fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching low stock products:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do pobierania klientów
export const getKlienci = async () => {
    try {
        logRequest("Fetching klienci");
        const response = await axios.get(`${API_URL_KLIENCI}`);
        logRequest("Klienci fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching klienci:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do składania zamówień brakujących produktów
export const zamowienieBrakujace = async (produkt_id) => {
    try {
        logRequest("Ordering missing product", { produkt_id });
        const response = await axios.post(`${API_URL_ZAMOWIENIA}zamowienie_brakujace`, { produkt_id });
        logRequest("Missing product ordered successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error ordering missing product:', error.response?.data || error.message);
        throw error;
    }
};


// Funkcja do pobierania listy dostawcow
export const getDostawcy = async () => {
    try {
        logRequest("Fetching dostawcy");
        const response = await axios.get(`${API_URL_DOSTAWCY}`);
        logRequest("Dostawcy fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching dostawcy:', error.response?.data || error.message);
        throw error;
    }
};

// Pobiera dostępnych dostawców dla produktu
// export const getAvailableSuppliers = async (produktId, minimalnaIlosc) => {
//     const response = await axios.get(`${API_URL_PRODUKTY}${produktId}/dostawcy`, {
//       params: { ilosc: minimalnaIlosc },
//     });
//     return response.data;
//   };
  

// Wysyła zamówienie brakujące
export const addZamowienieMagazyn = async (zamowienieData) => {
    const response = await axios.post(`${API_URL_ZAMOWIENIA}zamowienie_brakujace`, zamowienieData);
    return response.data;
  };
  

// Zmienia status zamówienia klienta
export const zmienStatusZamowieniaKlient = async (zamowienieId, status) => {
try {
    const response = await axios.patch(
    `${API_URL_ZAMOWIENIA}zamowienia_klienci/${zamowienieId}/status`,
    {
        status: status
    }
    );
    return response.data; // Zwraca odpowiedź z serwera, np. komunikat o sukcesie
} catch (error) {
    console.error("Błąd podczas zmiany statusu zamówienia klienta:", error);
    throw new Error("Nie udało się zmienić statusu zamówienia klienta");
}
};


// Zmienia status zamówienia magazynowego
export const zmienStatusZamowieniaMagazyn = async (zamowienieId, status) => {
try {
    const response = await axios.patch(
    `${API_URL_ZAMOWIENIA}zamowienia_magazyn/${zamowienieId}/status`,
    {
        status: status
    }
    );
    return response.data; // Zwraca odpowiedź z serwera, np. komunikat o sukcesie
} catch (error) {
    console.error("Błąd podczas zmiany statusu zamówienia magazynowego:", error);
    throw new Error("Nie udało się zmienić statusu zamówienia magazynowego");
}
};


// Funkcja do pobierania raportu sprzedaży
export const getNajbardziejOplacalniKlienci = async () => {
    try {
        logRequest("Fetching najbardziej oplacalni klienci");
        const response = await axios.get(`${API_URL_RAPORTY}najbardziej-oplacalni-klienci`);
        logRequest("Najbardziej oplacalni klienci fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching najbardziej oplacalni klienci:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do pobierania raportu najlepiej sprzedających się produktów
export const getRaportNajlepszeProdukty = async () => {
    try {
        logRequest("Fetching raport magazynowy");
        const response = await axios.get(`${API_URL_RAPORTY}najlepiej-sprzedajace-produkty`);
        logRequest("Raport magazynowy fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching raport magazynowy:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do pobierania raportu klientów
export const getRaportKlientow = async () => {
    try {
        logRequest("Fetching raport sprzedazy miesiecznej");
        const response = await axios.get(`${API_URL_RAPORTY}raport-sprzedazy-miesieczny`);
        logRequest("Raport sprzedazy miesiecznej fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching raport sprzedazy miesiecznej:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do pobierania raportu dostawców
export const getRaportDostawcow = async () => {
    try {
        logRequest("Fetching raport dostawcow");
        const response = await axios.get(`${API_URL_RAPORTY}analiza-dostawcow`);
        logRequest("Raport dostawcow fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching raport dostawcow:', error.response?.data || error.message);
        throw error;
    }
};

// Funkcja do pobierania raportu zyskow i wydatkow
export const getRaportZyskow = async () => {
    try {
        logRequest("Fetching raport zyskow");
        const response = await axios.get(`${API_URL_RAPORTY}raport-zyskow-wydatkow`);
        logRequest("Raport zyskow fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching raport zyskow:', error.response?.data || error.message);
        throw error;
    }
};

export const dodajKlienta = async (klient) => {
    const response = await fetch(`${API_URL_KLIENCI}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(klient)
    });
  
    if (!response.ok) {
      throw new Error("Nie udało się dodać klienta.");
    }
  
    return await response.json();
  };
  

  export const dodajDostawce = async (dostawca) => {
    const response = await fetch(`${API_URL_DOSTAWCY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dostawca)
    });
  
    if (!response.ok) {
      throw new Error("Nie udało się dodać dostawcy.");
    }
  
    return await response.json();
  };
  

  // Funkcja do pobierania listy dostawców dla produktu
export const getAvailableSuppliers = async (produktId, ilosc = 0) => {
    try {
      const response = await fetch(`${API_URL_PRODUKTY}${produktId}/dostawcy?ilosc=${ilosc}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Błąd podczas pobierania dostawców: ${response.statusText}`);
      }
  
      const suppliers = await response.json();
      return suppliers; // Lista dostawców
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // Funkcja do dodawania zamówienia do magazynu
  export const addWarehouseOrder = async (produktId, dostawcaId, ilosc) => {
    try {
      const response = await fetch(`${API_URL_ZAMOWIENIA}magazyn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produkt_id: produktId,
          dostawca_id: dostawcaId,
          ilosc: ilosc,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Błąd podczas dodawania zamówienia: ${errorData.error}`);
      }
  
      const result = await response.json();
      return result; // Potwierdzenie dodania zamówienia
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

    // Funkcja do pobierania balansu-podsumowania
export const getBalans = async () => {
    try {
        logRequest("Fetching balans");
        const response = await axios.get(`${API_URL_RAPORTY}balans-podsumowanie`);
        logRequest("Balans fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Error fetching balans:', error.response?.data || error.message);
        throw error;
    }
}