import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import create_app

app = create_app()

def application(environ, start_response):
    script_name = environ.get("SCRIPT_NAME", "")
    path_info = environ.get("PATH_INFO", "")
    
    if script_name:
        full_path = script_name.rstrip("/") + ("/" + path_info.lstrip("/") if path_info else "")
        environ["PATH_INFO"] = full_path
        environ["SCRIPT_NAME"] = ""

    return app.wsgi_app(environ, start_response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), debug=True)
