import os
import glob
import re

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src'

for filepath in glob.glob(src_dir + '/**/*.jsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # 1. Fix contrast ratios for colorful badges and buttons on white backgrounds
    content = content.replace('#22c55e', '#166534') # Green
    content = content.replace('#10b981', '#047857') # Emerald
    content = content.replace('#f59e0b', '#b45309') # Amber
    content = content.replace('#ef4444', '#b91c1c') # Red
    content = content.replace('#6366f1', '#4338ca') # Indigo
    content = content.replace('#8b5cf6', '#6d28d9') # Violet
    content = content.replace('#7c3aed', '#5b21b6') # Violet
    content = content.replace('#1d4ed8', '#1e3a8a') # Blue
    content = content.replace('#3b82f6', '#1d4ed8') # Blue
    content = content.replace('#4f46e5', '#3730a3') # Indigo
    content = content.replace('#059669', '#065f46') # Emerald

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed colors in {filepath}")

# 2. Fix App.jsx to wrap EVERYTHING in a <main> tag to guarantee the landmark exists
app_file = os.path.join(src_dir, 'App.jsx')
with open(app_file, 'r') as f:
    app_content = f.read()

if '<main id="main-content">' not in app_content:
    app_content = app_content.replace('<Routes>', '<main id="main-content">\n                    <Routes>')
    app_content = app_content.replace('</Routes>', '</Routes>\n                    </main>')
    with open(app_file, 'w') as f:
        f.write(app_content)
    print("Fixed App.jsx main landmark")
