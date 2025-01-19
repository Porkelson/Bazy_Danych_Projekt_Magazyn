#!/bin/bash

# Uruchomienie backendu
echo "Uruchamiam backend..."
# Przechodzimy do katalogu, gdzie znajduje się backend (jeśli jest w osobnym katalogu)
cd backend
nohup python3 app.py &

# Uruchomienie frontend-u
echo "Uruchamiam frontend..."
# Przechodzimy do katalogu frontend (jeśli jest w osobnym katalogu)
cd ../frontend 
npm start
