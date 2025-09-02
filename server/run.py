from app import create_app
import os

app = create_app()

if __name__ == "__main__":
    # Get port from environment variable (for Render) or default to 8000
    port = int(os.environ.get('PORT', 8000))
    # Disable debug mode in production
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    # Bind to 0.0.0.0 for external access (required for Render)
    app.run(host='0.0.0.0', debug=debug_mode, port=port)
    

