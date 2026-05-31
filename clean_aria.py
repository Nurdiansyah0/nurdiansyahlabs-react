import os
import glob
import re

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src'

for filepath in glob.glob(src_dir + '/**/*.jsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Remove duplicate aria-labels
    content = re.sub(r'aria-label="Select option"\s*aria-label="Select option"', 'aria-label="Select option"', content)
    content = re.sub(r'aria-label="Action button"\s*aria-label="Action button"', 'aria-label="Action button"', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Cleaned {filepath}")
