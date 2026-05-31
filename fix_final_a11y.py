import os
import glob
import re

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src'

for filepath in glob.glob(src_dir + '/**/*.jsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # 1. Fix contrast ratios for light grays on white backgrounds
    content = content.replace('#94a3b8', '#475569')
    content = content.replace('#64748b', '#475569')
    content = content.replace('#9ca3af', '#4b5563')
    
    # 2. Fix missing main landmarks
    # For TrendsDashboard
    if 'TrendsDashboard.jsx' in filepath:
        content = content.replace('<div style={{ minHeight: \'100vh\', background: \'#f8fafc\'', '<main style={{ minHeight: \'100vh\', background: \'#f8fafc\'')
        content = re.sub(r'</div>\s*\)\s*}\s*$', '</main>\n    )\n}\n', content)
        
    # For BlogListing
    if 'BlogListing.jsx' in filepath:
        content = content.replace('<div style={{ minHeight: \'100vh\'', '<main style={{ minHeight: \'100vh\'')
        content = re.sub(r'</div>\s*\)\s*}\s*$', '</main>\n    )\n}\n', content)
        
    # For BlogPage
    if 'BlogPage.jsx' in filepath:
        content = content.replace('<div style={{ minHeight: \'100vh\', background: \'#fff\'', '<main style={{ minHeight: \'100vh\', background: \'#fff\'')
        content = re.sub(r'</div>\s*\)\s*}\s*$', '</main>\n    )\n}\n', content)
        
    # For AdminDashboard
    if 'AdminDashboard.jsx' in filepath:
        content = content.replace('<div style={{ minHeight: \'100vh\', display: \'flex\', background: \'#f8fafc\'', '<main style={{ minHeight: \'100vh\', display: \'flex\', background: \'#f8fafc\'')
        content = re.sub(r'</div>\s*\)\s*}\s*$', '</main>\n    )\n}\n', content)
        
    # For Home
    if 'Home.jsx' in filepath:
        content = content.replace('<Hero />', '<main>\n            <Hero />')
        content = content.replace('<CTA />', '<CTA />\n            </main>')

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {filepath}")
