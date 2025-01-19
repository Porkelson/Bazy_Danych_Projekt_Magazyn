# Projekt Task Management System i Zarządzanie Zamówieniami

Projekt integruje komponenty backendowe i frontendowe, wykorzystując Pythona do backendu i Reacta do frontendowego interfejsu. System zarządza zadaniami, zamówieniami, produktami i dostawcami w aplikacji, oferując funkcjonalności do monitorowania stanu magazynowego, składania zamówień i raportowania.

## Wymagania

- Python 3.x
- Node.js
- npm
- MySQL lub PostgreSQL (do zarządzania bazą danych)

## Setup

1. Sklonuj repozytorium:

```bash
git clone <url_repozytorium>
cd <folder_projektu>
```
   
2. Wykorzystaj skrypty włączacjące:

 W trybie deweloperskim
   ```bash
   test_and_start.sh
   ```
 W trybie produkcyjnym:
   ```bash
   build_and_start.sh
   ```

3. Funkcjonalności
Zarządzanie zadaniami (Task Management System):

Tworzenie, edytowanie, usuwanie zadań.
Możliwość przypisywania zadań do osób lub zespołów.
Możliwość monitorowania statusów i daty wykonania zadań.
Zarządzanie zamówieniami:

Składanie zamówień na produkty w zależności od stanu magazynowego.
Zamówienia są kierowane do odpowiednich dostawców, a najtańsza opcja jest automatycznie wybierana.
Zarządzanie produktami:

Śledzenie dostępności produktów u różnych dostawców.
Możliwość dodawania nowych produktów do bazy danych.
Raporty:

Raporty miesięczne sprzedaży.
Analiza dostawców oraz sprzedaży produktów.
Historia zamówień z podziałem na zamówienia klientów i zamówienia do magazynu.

4. Baza danych
Aplikacja używa bazy danych do przechowywania informacji o produktach, zamówieniach, dostawcach i zadaniach. Używa się tabel takich jak:

produkt_dostawca: zawiera relacje między produktami a dostawcami.
zamowienia_klienci: przechowuje dane o zamówieniach składanych przez klientów.
magazyn: śledzi stan magazynowy produktów.
zamowienia_magazyn: tabela służąca do składania zamówień do magazynu.


5. Wykorzystane technologie
Backend: Python, Flask
Frontend: React, CSS (modularny)
Baza danych: PostgreSQL
SQL: Widoki, Triggery
Uwagi
Upewnij się, że masz zainstalowane wszystkie zależności przed uruchomieniem aplikacji. Możesz to zrobić, wykonując kroki w sekcji Setup.
Funkcjonalności mogą się rozrastać o dodatkowe elementy, takie jak symulacja dostaw czy analiza danych.
