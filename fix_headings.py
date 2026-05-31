import os
import glob
import re

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src/showcases/apps'

for filepath in glob.glob(src_dir + '/*.jsx'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Change h3 to h2 (Lighthouse complains if h3 comes immediately after h1)
    content = content.replace('<h3', '<h2')
    content = content.replace('</h3>', '</h2>')

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed headings in {filepath}")
