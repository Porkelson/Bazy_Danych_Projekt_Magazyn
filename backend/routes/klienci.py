from flask import Blueprint, jsonify, request
from db.models import connect_db

klienci_blueprint = Blueprint('klienci', __name__)

@klienci_blueprint.route('/', methods=['GET'])
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


@klienci_blueprint.route("/", methods=["POST"])
def dodaj_klienta():
    data = request.get_json()

    nazwa = data.get("nazwa")
    email = data.get("email")
    telefon = data.get("telefon")
    adres = data.get("adres")

    if not all([nazwa, email, telefon, adres]):
        return jsonify({"error": "Wszystkie pola są wymagane"}), 400

    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO magazyn2.klienci (nazwa, email, telefon, adres) 
            VALUES (%s, %s, %s, %s)
        """, (nazwa, email, telefon, adres))
        conn.commit()

    return jsonify({"message": "Klient dodany pomyślnie!"}), 201


