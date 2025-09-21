import sys,traceback,os
sys.path.insert(0, r'C:\salasa_backend')
try:
    __import__('src.main')
    print('IMPORT_OK')
except Exception:
    traceback.print_exc()
    raise
