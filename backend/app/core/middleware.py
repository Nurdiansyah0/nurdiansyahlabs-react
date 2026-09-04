from flask import request
import time
import logging

logger = logging.getLogger("nurdiansyahlabs")

def setup_middleware(app):
    @app.before_request
    def start_timer():
        request.start_time = time.time()

    @app.after_request
    def log_response(response):
        duration = time.time() - getattr(request, 'start_time', time.time())
        # Avoid logging passwords / auth tokens
        if not request.path.startswith('/static'):
            logger.info(f"{request.method} {request.path} {response.status_code} - {duration:.4f}s")
        return response
