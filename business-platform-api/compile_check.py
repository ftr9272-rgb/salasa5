import os, py_compile, traceback
out = 'syntax_check_out.txt'
root = os.path.join(os.path.dirname(__file__), 'src')
errors = []
for dirpath, dirnames, filenames in os.walk(root):
    for fn in filenames:
        if fn.endswith('.py'):
            path = os.path.join(dirpath, fn)
            try:
                py_compile.compile(path, doraise=True)
            except Exception as e:
                errors.append((path, ''.join(traceback.format_exception_only(type(e), e))))
with open(out, 'w', encoding='utf-8') as f:
    if not errors:
        f.write('ALL_OK')
    else:
        for p, msg in errors:
            f.write(f'FILE: {p}\n{msg}\n')
print('WROTE', out)
