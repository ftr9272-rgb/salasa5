import traceback
try:
    import src.routes.supplier as s
    print('Imported src.routes.supplier OK')
except Exception:
    traceback.print_exc()
try:
    import src.main as m
    print('Imported src.main OK')
except Exception:
    traceback.print_exc()
