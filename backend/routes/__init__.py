from .zamowienia import zamowienia_blueprint
from .klienci import klienci_blueprint
from .produkty import produkty_blueprint
from .raporty import raporty_bp
from .dostawcy import dostawcy_blueprint

# Zarejestruj wszystkie blueprinty
def register_blueprints(app):
    app.register_blueprint(raporty_bp, url_prefix='/api/raporty')
    app.register_blueprint(zamowienia_blueprint, url_prefix='/api/zamowienia')
    app.register_blueprint(klienci_blueprint, url_prefix='/api/klienci')
    app.register_blueprint(produkty_blueprint, url_prefix='/api/produkty')
    app.register_blueprint(dostawcy_blueprint, url_prefix='/api/dostawcy')
