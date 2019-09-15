from Init import app
from os import environ

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
