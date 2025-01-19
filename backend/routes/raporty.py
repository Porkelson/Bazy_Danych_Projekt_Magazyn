from flask import Blueprint, jsonify
from db.models import connect_db, execute_query  # Import swojej funkcji do zapytań SQL
import psycopg2.extras  # Pozwala na DictCursor

# Utwórz blueprint dla raportów
raporty_bp = Blueprint('raporty', __name__)

# Endpoint: Najbardziej oplacalni klienci
@raporty_bp.route('/najbardziej-oplacalni-klienci', methods=['GET'])
def najbardziej_oplacalni_klienci():
    query = """SELECT klient_id, klient_nazwa, laczna_wartosc_zamowien
                FROM magazyn2.najbardziej_oplacalni_klienci
                LIMIT 10;
            """
    try:
        # result = execute_query(query)
        conn = connect_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query)
        rows = cur.fetchall()
        result = [dict(row) for row in rows]  # Konwersja do listy słowników
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint: Analiza dostawców
@raporty_bp.route('/analiza-dostawcow', methods=['GET'])
def get_analiza_dostawcow():
    query = "SELECT * FROM magazyn2.analiza_dostawcow;"
    try:
        conn = connect_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query)
        rows = cur.fetchall()
        result = [dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint: Najlepiej sprzedające produkty
@raporty_bp.route('/najlepiej-sprzedajace-produkty', methods=['GET'])
def get_najlepiej_sprzedajace_produkty():
    query = "SELECT * FROM magazyn2.najlepiej_sprzedajace_produkty;"
    try:
        conn = connect_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query)
        rows = cur.fetchall()
        result = [dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint: Raport sprzedaży miesięczny
@raporty_bp.route('/raport-sprzedazy-miesieczny', methods=['GET'])
def get_raport_sprzedazy_miesieczny():
    query = "SELECT * FROM magazyn2.raport_sprzedazy_miesieczny;"
    try:
        conn = connect_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query)
        rows = cur.fetchall()
        result = [dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Endpoint: Raport zyskow i wydatkow
@raporty_bp.route('/raport-zyskow-wydatkow', methods=['GET'])
def get_raport_zyskow_wydatkow():
    query = """SELECT rok, miesiac, zyski, wydatki
               FROM magazyn2.raport_zyskow_i_wydatkow_miesieczny
               ORDER BY rok DESC, miesiac DESC;"""
    try:
        conn = connect_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query)
        rows = cur.fetchall()
        result = [dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Endpoint: balans/podsumowanie
@raporty_bp.route('/balans-podsumowanie', methods=['GET'])
def get_balans_podsumowanie():
    query = "SELECT * FROM magazyn2.balans_podsumowanie;"
    try:
        conn = connect_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query)
        rows = cur.fetchall()
        result = [dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500