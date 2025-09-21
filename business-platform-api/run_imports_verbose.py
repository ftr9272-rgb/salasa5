import traceback,sys
modules = ['src.main','src.routes.supplier','src.routes.merchant','src.routes.auth','src.models.supplier','src.models.merchant']
for m in modules:
    print('--- IMPORT',m,'---')
    try:
        __import__(m)
        print('OK')
    except Exception:
        traceback.print_exc()
        print('FAILED')
        # don't exit, continue to see other errors
print('done')
