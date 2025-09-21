import sys, traceback, os
out = os.path.join(os.path.dirname(__file__), 'import_trace_ws.txt')
# Ensure project root is on sys.path
proj_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if proj_root not in sys.path:
    sys.path.insert(0, proj_root)
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
