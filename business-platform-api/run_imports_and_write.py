import traceback
modules = ['src.main','src.routes.supplier','src.routes.merchant','src.routes.auth','src.models.supplier','src.models.merchant']
with open('diag_out.txt','w',encoding='utf-8') as f:
    for m in modules:
        f.write('--- IMPORT ' + m + ' ---\n')
        try:
            __import__(m)
            f.write('OK\n')
        except Exception as e:
            traceback.print_exc(file=f)
            f.write('\n')
print('done')
