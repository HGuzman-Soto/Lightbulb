from bettercrative import create_app

app = create_app()
app.app_context().push()

from bettercrative import db

db.create_all()
