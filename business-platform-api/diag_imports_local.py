import sys, traceback, os
out = os.path.join(os.path.dirname(__file__), 'diag_local.txt')
modules = ['src.main','src.routes.supplier','src.routes.merchant','src.routes.auth','src.routes.shipping','src.models.supplier','src.utils.jwt_utils']
with open(out,'w',encoding='utf-8') as f:
    for m in modules:
        f.write('--- IMPORT %s ---\n' % m)
        try:
            __import__(m)
            f.write('OK\n')
        except Exception:
            f.write('FAILED\n')
            traceback.print_exc(file=f)
            f.write('\n')
print('WROTE', out)
