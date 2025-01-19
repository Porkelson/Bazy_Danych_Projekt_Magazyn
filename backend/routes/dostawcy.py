from flask import Blueprint, jsonify, request
from db.models import connect_db

dostawcy_blueprint = Blueprint('dostawcy', __name__)

@dostawcy_blueprint.route('/', methods=['GET'])
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


@dostawcy_blueprint.route("/", methods=["POST"])
def dodaj_dostawce():
    data = request.get_json()

    nazwa = data.get("nazwa")
    kontakt = data.get("kontakt")
    lokalizacja = data.get("lokalizacja")

    if not all([nazwa, kontakt, lokalizacja]):
        return jsonify({"error": "Wszystkie pola są wymagane"}), 400

    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO magazyn2.dostawcy (nazwa, kontakt, lokalizacja) 
            VALUES (%s, %s, %s)
        """, (nazwa, kontakt, lokalizacja))
        conn.commit()

    return jsonify({"message": "Dostawca dodany pomyślnie!"}), 201



