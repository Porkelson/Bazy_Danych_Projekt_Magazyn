import psycopg2


def connect_db():
    return psycopg2.connect(
        host="querulously-believable-croaker.data-1.use1.tembo.io",
        database="postgres",
        user="postgres",
        password="SZtF3zeQxZRlur32"
    )


def execute_query(query):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

# Zwraca wynik zapytania w postaci listy słowników
# def execute_query(query):
#     try:
#         conn = connect_db()
#         cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
#         cur.execute(query)
#         rows = cur.fetchall()
#         result = [dict(row) for row in rows]  # Zamiana wyników na słowniki
#         return result
#     except Exception as e:
#         print(f"Error executing query: {e}")
#         return []
