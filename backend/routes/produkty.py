from flask import Blueprint, jsonify, request
from db.models import connect_db

produkty_blueprint = Blueprint('produkty', __name__)

@produkty_blueprint.route("/", methods=["GET"])
def get_produkty():
    # Pobieramy parametry z zapytania (domyślnie sortujemy po nazwie rosnąco)
    sort_by = request.args.get('sort_by', 'nazwa')
    sort_order = request.args.get('sort_order', 'asc')
    kategoria = request.args.get('kategoria', None)  # Opcjonalny filtr po kategorii
    
    # Walidacja danych wejściowych
    valid_sort_columns = ['nazwa', 'kategoria', 'cena_jednostkowa', 'ilosc']
    if sort_by not in valid_sort_columns:
        return jsonify({'error': 'Nieprawidłowy parametr sort_by'}), 400

    valid_sort_orders = ['asc', 'desc']
    if sort_order not in valid_sort_orders:
        return jsonify({'error': 'Nieprawidłowy parametr sort_order'}), 400
    
    # Łączymy się z bazą danych
    conn = connect_db()
    cursor = conn.cursor()
    
    # Budujemy zapytanie SQL
    query = "SELECT * FROM magazyn2.produkty"
    query_params = []
    
    # Jeśli podano kategorię, dodajemy filtr
    if kategoria:
        query += " WHERE kategoria = %s"
        query_params.append(kategoria)
    
    query += f" ORDER BY {sort_by} {sort_order}"
    
    try:
        cursor.execute(query, tuple(query_params))
        produkty = cursor.fetchall()

        # Zwracamy wyniki w formacie JSON
        return jsonify(produkty)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Zamykamy połączenie z bazą
        cursor.close()
        conn.close()

# @produkty_blueprint.route("/", methods=["POST"])
# def add_produkt():
#     data = request.get_json()
#     conn = connect_db()
#     cursor = conn.cursor()
#     cursor.execute(
#         "INSERT INTO magazyn2.produkty (nazwa, kategoria, ilosc, cena_jednostkowa) VALUES (%s, %s, %s, %s)",
#         (data["nazwa"], data["kategoria"], data["ilosc"], data["cena_jednostkowa"])
#     )
#     conn.commit()
#     conn.close()
#     return jsonify({"message": "Produkt dodany pomyślnie!"})

@produkty_blueprint.route("/", methods=["POST"])
def dodaj_produkt():
    data = request.get_json()

    nazwa = data.get("nazwa")
    kategoria = data.get("kategoria")
    ilosc = data.get("ilosc")
    cena_jednostkowa = data.get("cena_jednostkowa")
    dostawca_id = data.get("dostawca_id")

    if not all([nazwa, kategoria, cena_jednostkowa, dostawca_id]):
        return jsonify({"error": "Wszystkie pola są wymagane"}), 400

    with connect_db() as conn:
        cursor = conn.cursor()

        # Dodanie nowego produktu
        cursor.execute("""
            INSERT INTO magazyn2.produkty (nazwa, kategoria, ilosc, cena_jednostkowa) 
            VALUES (%s, %s, %s, %s) RETURNING id
        """, (nazwa, kategoria, ilosc, cena_jednostkowa))
        produkt_id = cursor.fetchone()[0]

        # Dodanie relacji w tabeli produkt_dostawca
        cursor.execute("""
            INSERT INTO magazyn2.produkt_dostawca (produkt_id, dostawca_id, cena, dostepnosc) 
            VALUES (%s, %s, %s, %s)
        """, (produkt_id, dostawca_id, cena_jednostkowa, 100))

        conn.commit()

    return jsonify({"message": "Produkt został dodany pomyślnie!"}), 201


@produkty_blueprint.route("/low_stock", methods=["GET"])
def get_low_stock():
    """
    Endpoint zwracający produkty, których ilość jest poniżej minimalnego stanu magazynowego.
    """
    conn = connect_db()
    cursor = conn.cursor()
    
    try:
        # Zapytanie do bazy danych
        query = """
            SELECT id, nazwa, kategoria, ilosc, minimalny_stan, cena_jednostkowa, ((minimalny_stan - ilosc) * cena_jednostkowa) AS calkowita_cena
            FROM magazyn2.produkty
            WHERE ilosc < minimalny_stan
        """
        cursor.execute(query)
        produkty = cursor.fetchall()

        # Przygotowanie odpowiedzi w formacie JSON
        produkty_json = [
            {
                "id": row[0],
                "nazwa": row[1],
                "kategoria": row[2],
                "ilosc": row[3],
                "minimalny_stan": row[4],
                "cena_jednostkowa": row[5],
                "calkowita_cena": row[6]
            }
            for row in produkty
        ]

        return jsonify(produkty_json), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# Pobieranie dostępnych dostawców dla produktu
@produkty_blueprint.route("/<int:produkt_id>/dostawcy", methods=["GET"])
def get_dostawcy(produkt_id):
    try:
        ilosc = request.args.get("ilosc", type=int, default=0)
        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT d.id, d.nazwa, pd.cena, pd.dostepnosc
                FROM magazyn2.produkt_dostawca pd
                JOIN magazyn2.dostawcy d ON pd.dostawca_id = d.id
                WHERE pd.produkt_id = %s AND pd.dostepnosc >= %s
                ORDER BY pd.cena ASC
                """,
                (produkt_id, ilosc)
            )
            dostawcy = cursor.fetchall()
        
        result = [
            {"id": dostawca[0], "nazwa": dostawca[1], "cena": dostawca[2], "dostepnosc": dostawca[3]}
            for dostawca in dostawcy
        ]
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Błąd: {str(e)}"}), 500
