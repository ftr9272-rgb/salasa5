import sys, traceback, tempfile, os
# Ensure project root is on sys.path
proj_root = os.path.abspath(os.path.dirname(__file__))
if proj_root not in sys.path:
    sys.path.insert(0, proj_root)
out = os.path.join(tempfile.gettempdir(), 'salasa_import_diag.txt')
try:
    __import__('src.main')
    with open(out, 'w', encoding='utf-8') as f:
        f.write('IMPORT_OK')
    print('WROTE_OK', out)
except Exception:
    s = ''.join(traceback.format_exception(*sys.exc_info()))
    with open(out, 'w', encoding='utf-8') as f:
        f.write(s)
    print('WROTE_ERR', out)
    print(s)
    # do not re-raise to allow terminal output capture
