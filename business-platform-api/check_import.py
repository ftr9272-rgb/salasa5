import traceback
try:
    import src.main as m
    print('import ok')
except Exception:
    traceback.print_exc()
