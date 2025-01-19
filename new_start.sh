#!/bin/bash

# Ustawienie flagi na błąd
set -e

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

echo "=== Inicjalizacja frontend'u ==="

# Przejście do folderu frontend
cd frontend

# Instalacja zależności frontendu, jeśli brak folderu node_modules
if [ ! -d "node_modules" ]; then
  echo "Instalacja zależności frontendu..."
  npm install
fi

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

# Uruchomienie frontendu
echo "Uruchamianie frontendu..."
cd frontend
npm start &

# Zatrzymywanie backendu po zamknięciu frontendu
wait $BACKEND_PID
