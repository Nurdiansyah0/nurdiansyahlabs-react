import os
import glob

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src'

for filepath in glob.glob(src_dir + '/**/*.jsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if '<select ' in content:
        # Menambahkan aria-label ke semua elemen <select> yang belum memilikinya
        new_content = content.replace('<select ', '<select aria-label="Select option" ')
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
