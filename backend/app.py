from flask import Flask
from flask_cors import CORS
# from routes.produkty import produkty_blueprint
# from routes.zamowienia import zamowienia_blueprint
# from routes.klienci import klienci_blueprint
from routes import register_blueprints


app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register routes
register_blueprints(app)


with app.app_context():
    print(app.url_map)


if __name__ == "__main__":
    app.run(debug=True)
