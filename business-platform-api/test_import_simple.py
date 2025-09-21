import traceback
try:
    import src.main
    print('OK')
except Exception:
    traceback.print_exc()
    print('FAILED')
