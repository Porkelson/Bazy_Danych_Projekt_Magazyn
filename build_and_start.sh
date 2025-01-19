#!/bin/bash

# Ustawienie flagi na błąd
set -e

# Funkcja czyszcząca procesy po zamknięciu
cleanup() {
  echo "Zatrzymywanie procesów..."
  if [ -n "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
  fi
  echo "Procesy zatrzymane. Do widzenia!"
}

# Przechwycenie sygnałów zamknięcia (Ctrl+C, zakończenie skryptu)
trap cleanup EXIT

echo "=== Inicjalizacja środowiska backendu ==="

# Tworzenie wirtualnego środowiska, jeśli nie istnieje
if [ ! -d "backend/venv" ]; then
  echo "Tworzenie wirtualnego środowiska dla backendu..."
  python3 -m venv backend/venv
fi

# Aktywacja wirtualnego środowiska
echo "Aktywacja wirtualnego środowiska..."
source backend/venv/bin/activate

# Instalacja zależności backendu
echo "Instalacja zależności backendu..."
pip install -r backend/requirements.txt

# Dezaktywacja wirtualnego środowiska
deactivate

echo "=== Budowanie aplikacji frontendowej ==="

# Przejście do folderu frontend
cd frontend

# Instalacja zależności frontendu, jeśli brak folderu node_modules
if [ ! -d "node_modules" ]; then
  echo "Instalacja zależności frontendu..."
  npm install
fi

# Budowanie aplikacji produkcyjnej
echo "Budowanie aplikacji frontendowej..."
npm run build

cd ..

echo "=== Uruchamianie aplikacji ==="

# Uruchomienie backendu w tle
echo "Uruchamianie backendu..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
deactivate
cd ..

# Uruchomienie frontendu w trybie produkcyjnym w tle
echo "Uruchamianie frontendu (wersja produkcyjna)..."
cd frontend
# Serwowanie builda statycznego
serve -s build &
FRONTEND_PID=$!
cd ..

# Oczekiwanie na zakończenie pracy procesów
wait $BACKEND_PID $FRONTEND_PID
