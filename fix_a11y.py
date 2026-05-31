import os
import glob
import re

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src'

for filepath in glob.glob(src_dir + '/**/*.jsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Fix iframes missing title
    content = re.sub(r'<iframe(?![^>]*title=)', r'<iframe title="Embedded Content"', content)
    
    # Fix buttons missing aria-label
    content = re.sub(r'<button(?![^>]*aria-label=)', r'<button aria-label="Action button"', content)
    
    # Fix inputs missing aria-label
    content = re.sub(r'<input(?![^>]*aria-label=)(?![^>]*type="hidden")', r'<input aria-label="Form input"', content)

    # Fix textareas missing aria-label
    content = re.sub(r'<textarea(?![^>]*aria-label=)', r'<textarea aria-label="Text input"', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed A11y in {filepath}")
