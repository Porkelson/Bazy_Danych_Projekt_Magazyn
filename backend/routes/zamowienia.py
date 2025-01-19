from flask import Blueprint, jsonify, request
from psycopg2 import IntegrityError  # Do obsługi błędów bazy danych
from db.models import connect_db
import requests


zamowienia_blueprint = Blueprint('zamowienia', __name__)

# Pobieranie zamówień klientów
@zamowienia_blueprint.route("/klienci", methods=["GET"])
def get_zamowienia_klienci():
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""SELECT 
    z.id, 
    z.produkt_id, 
    z.klient_id, 
    z.ilosc, 
    z.status, 
    z.data_zamówienia,
    p.nazwa AS produkt_nazwa,
    p.cena_jednostkowa,
    (p.cena_jednostkowa * z.ilosc) AS cena_calosc
FROM 
    magazyn2.zamowienia_klienci z
JOIN 
    magazyn2.produkty p ON z.produkt_id = p.id
ORDER BY 
    z.data_zamówienia DESC;""")
        zamowienia_klienci = cursor.fetchall()
    return jsonify(zamowienia_klienci)

# Pobieranie zamówień magazynu
@zamowienia_blueprint.route("/magazyn", methods=["GET"])
def get_zamowienia_magazyn():
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""SELECT 
    z.id, 
    z.produkt_id, 
    z.dostawca_id, 
    z.ilosc, 
    z.status, 
    z.data_zamówienia,
    p.nazwa AS produkt_nazwa,
    p.cena_jednostkowa,
    (p.cena_jednostkowa * z.ilosc) AS cena_calosc
FROM 
    magazyn2.zamowienia_magazyn z
JOIN 
    magazyn2.produkty p ON z.produkt_id = p.id
ORDER BY 
    z.data_zamówienia DESC;""")
        zamowienia_magazyn = cursor.fetchall()
    return jsonify(zamowienia_magazyn)

# Dodawanie zamówienia klienta
@zamowienia_blueprint.route("/klienci", methods=["POST"])
def add_zamowienie_klient():
    try:
        data = request.get_json()
        required_fields = ["produkt_id", "klient_id", "ilosc"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Brakujący atrybut: {field}"}), 400

        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO magazyn2.zamowienia_klienci (produkt_id, klient_id, ilosc) 
                VALUES (%s, %s, %s)
                """,
                (data["produkt_id"], data["klient_id"], data["ilosc"])
            )
            conn.commit()
        return jsonify({"message": "Zamówienie klienta dodane pomyślnie!"}), 201
    except Exception as e:
        return jsonify({"error": f"Błąd: {str(e)}"}), 500

# Dodawanie zamówienia magazynu
@zamowienia_blueprint.route("/magazyn", methods=["POST"])
def add_zamowienie_magazyn():
    try:
        data = request.get_json()
        required_fields = ["produkt_id", "dostawca_id", "ilosc"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Brakujący atrybut: {field}"}), 400

        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO magazyn2.zamowienia_magazyn (produkt_id, dostawca_id, ilosc) 
                VALUES (%s, %s, %s)
                """,
                (data["produkt_id"], data["dostawca_id"], data["ilosc"])
            )
            conn.commit()
        return jsonify({"message": "Zamówienie magazynu dodane pomyślnie!"}), 201
    except Exception as e:
        return jsonify({"error": f"Błąd: {str(e)}"}), 500


@zamowienia_blueprint.route('/zamowienie_brakujace', methods=['POST'])
def zamowienie_brakujace():
    """
    Tworzy zamówienie do magazynu dla brakujących produktów.
    """
    try:
        data = request.get_json()

        # Wymagane pola
        required_fields = ["produkt_id", "ilosc"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Brakujący atrybut: {field}"}), 400

        produkt_id = data["produkt_id"]
        ilosc = data["ilosc"]

        with connect_db() as conn:
            cursor = conn.cursor()

            # Znajdź najtańszego dostawcę dla danego produktu
            cursor.execute("""
                SELECT d.id AS dostawca_id, d.nazwa AS dostawca_nazwa, pd.cena AS cena
                FROM magazyn2.produkt_dostawca pd
                JOIN magazyn2.dostawcy d ON pd.dostawca_id = d.id
                WHERE pd.produkt_id = %s AND pd.dostepnosc >= %s
                ORDER BY pd.cena ASC
                LIMIT 1
            """, (produkt_id, ilosc))
            dostawca = cursor.fetchone()

            if not dostawca:
                return jsonify({"message": "Brak dostępnych dostawców spełniających wymagania."}), 400

            dostawca_id, dostawca_nazwa, cena = dostawca

        # Przygotuj dane do wysłania do endpointa `/magazyn`
        zamowienie_data = {
            "produkt_id": produkt_id,
            "dostawca_id": dostawca_id,
            "ilosc": ilosc
        }

        # Wywołaj endpoint `/magazyn`
        response = requests.post(
            "http://127.0.0.1:5000/api/zamowienia/magazyn",
            json=zamowienie_data
        )

        if response.status_code != 201:
            return jsonify({"error": "Nie udało się złożyć zamówienia."}), 500

        # Zamówienie dodane pomyślnie
        return jsonify({
            "message": f"Zamówienie do magazynu zostało utworzone. Dostawca: {dostawca_nazwa}",
            "dostawca_id": dostawca_id,
            "ilosc": ilosc,
            "cena": cena
        }), 201

    except Exception as e:
        return jsonify({"error": f"Błąd serwera: {str(e)}"}), 500


@zamowienia_blueprint.route('/klienci_lista', methods=['GET'])
def get_klienci():
    conn = connect_db()
    cursor = conn.cursor()

    try:
        # Pobierz wszystkich klientów
        cursor.execute("SELECT id, nazwa, email, telefon, adres FROM magazyn2.klienci")
        klienci = cursor.fetchall()

        # Przekształć dane do formatu JSON
        klienci_list = [
            {
                "id": klient[0],
                "nazwa": klient[1],
                "email": klient[2],
                "telefon": klient[3],
                "adres": klient[4]
            } for klient in klienci
        ]

        return jsonify(klienci_list), 200
    except Exception as e:
        return jsonify({"error": "Nie udało się pobrać klientów", "details": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@zamowienia_blueprint.route('/dostawcy_lista', methods=['GET'])
def get_dostawcy():
    conn = connect_db()
    cursor = conn.cursor()

    try:
        # Pobierz wszystkich dostawców
        cursor.execute("SELECT id, nazwa, kontakt, lokalizacja FROM magazyn2.dostawcy")
        dostawcy = cursor.fetchall()

        # Przekształć dane do formatu JSON
        dostawcy_list = [
            {
                "id": dostawca[0],
                "nazwa": dostawca[1],
                "kontakt": dostawca[2],
                "lokalizacja": dostawca[3]
            } for dostawca in dostawcy
        ]

        return jsonify(dostawcy_list), 200
    except Exception as e:
        return jsonify({"error": "Nie udało się pobrać dostawców", "details": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@zamowienia_blueprint.route("/zamowienia_magazyn/<int:zamowienie_id>/status", methods=["PATCH"])
def update_status_zamowienia_magazyn(zamowienie_id):
    try:
        data = request.get_json()
        new_status = data.get("status")
        
        if not new_status:
            return jsonify({"error": "Brakujący status"}), 400
        
        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE magazyn2.zamowienia_magazyn
                SET status = %s
                WHERE id = %s
                """,
                (new_status, zamowienie_id)
            )
            conn.commit()
        
        return jsonify({"message": "Status zamówienia magazynowego zaktualizowany pomyślnie!"}), 200
    except Exception as e:
        return jsonify({"error": f"Błąd serwera: {str(e)}"}), 500



@zamowienia_blueprint.route("/zamowienia_klienci/<int:zamowienie_id>/status", methods=["PATCH"])
def update_status_zamowienia_klient(zamowienie_id):
    try:
        data = request.get_json()
        new_status = data.get("status")
        
        if not new_status:
            return jsonify({"error": "Brakujący status"}), 400
        
        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE magazyn2.zamowienia_klienci
                SET status = %s
                WHERE id = %s
                """,
                (new_status, zamowienie_id)
            )
            conn.commit()
        
        return jsonify({"message": "Status zamówienia klienta zaktualizowany pomyślnie!"}), 200
    except Exception as e:
        return jsonify({"error": f"Błąd serwera: {str(e)}"}), 500

