import os
import sys
import traceback

# Ensure project root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

BOOT_TRACE = os.path.join(os.path.dirname(__file__), 'boot_trace.txt')

# Try to write an initial boot marker. If this fails (permission issues, path
# encoding), continue — the improved exception handler below will still try to
# capture errors.
try:
    open(BOOT_TRACE, 'w', encoding='utf-8').write('BOOT START\n')
except Exception:
    pass


try:
    # Import inside try so we can capture and persist any import-time errors to
    # `boot_trace.txt` which the user can paste when requesting help.
    from flask import Flask, send_from_directory
    from flask_cors import CORS
    from src.models.supplier import db
    from src.routes.user import user_bp
    from src.routes.auth import auth_bp
    from src.routes.supplier import supplier_bp
    from src.routes.shipping import shipping_bp
    from src.routes.merchant import merchant_bp

    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

    # تفعيل CORS للسماح بالطلبات من الواجهة الأمامية
    CORS(app, supports_credentials=True, origins="*") # Allow all origins for production, or specify your domain

    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(supplier_bp, url_prefix='/api/supplier')
    app.register_blueprint(merchant_bp, url_prefix='/api/merchant')
    app.register_blueprint(shipping_bp, url_prefix='/api/shipping')

    # uncomment if you need to use database
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize DB
    db.init_app(app)
    with app.app_context():
        db.create_all()
        
        # إضافة البيانات التجريبية إذا لم تكن موجودة
        from src.models.supplier import User
        if User.query.count() == 0:
            print("إضافة البيانات التجريبية...")
            try:
                from src.seed_data import create_sample_data
                from src.seed_merchant_data import create_merchant_sample_data
                create_sample_data()
                create_merchant_sample_data() 
                print("تم إضافة البيانات التجريبية بنجاح")
            except Exception as e:
                print(f"خطأ في إضافة البيانات التجريبية: {e}")


    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return "Static folder not configured", 404

        # Serve files with cache disabled during development so clients pick up
        # rebuilt assets immediately. If the requested path isn't a static file
        # (e.g. SPA route like /supplier/merchants), return index.html so the
        # frontend router can handle it.
        # Note: keep cache_timeout=0 to avoid browser caching while developing.
        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            response = send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                response = send_from_directory(static_folder_path, 'index.html')
            else:
                return "index.html not found", 404

        # Safely set no-cache headers for development responses
        try:
            response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
            response.headers['Pragma'] = 'no-cache'
        except Exception:
            pass
        return response


    if __name__ == '__main__':
        # غيّر القيمة إلى True لتفعيل وضع التصحيح
        app.run(host='0.0.0.0', port=5000, debug=True)
except Exception:
    s = ''.join(traceback.format_exception(*sys.exc_info()))
    # Attempt to write the full traceback to the boot trace file and stderr.
    try:
        with open(BOOT_TRACE, 'a', encoding='utf-8') as f:
            f.write('\nEXCEPTION:\n')
            f.write(s)
    except Exception:
        pass
    try:
        # Print to stderr to help local runs capture the error
        sys.stderr.write('\nEXCEPTION (also written to boot_trace.txt):\n')
        sys.stderr.write(s)
    except Exception:
        pass
    # Re-raise so the process exits with non-zero status (visible to the user)
    raise
