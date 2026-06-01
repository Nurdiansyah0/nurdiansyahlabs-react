import os

apps_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src/showcases/apps'

def fix_contrast(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Red
    content = content.replace('#dc2626', '#991b1b')
    # Amber
    content = content.replace('#d97706', '#92400e')
    # Emerald / Green
    content = content.replace('#059669', '#065f46')
    content = content.replace('#16a34a', '#166534')
    # Blue
    content = content.replace('#2563eb', '#1e40af')
    content = content.replace('#3b82f6', '#1e40af') # blue-500
    # Indigo
    content = content.replace('#4f46e5', '#3730a3')
    # Purple
    content = content.replace('#9333ea', '#6b21a8')
    # Pink
    content = content.replace('#db2777', '#9d174d')
    # Gray (6b7280 is 4.54:1 on white, fails AAA for small text)
    content = content.replace('#6b7280', '#4b5563')
    # Sky (0ea5e9 is sky-500, terrible contrast on white)
    content = content.replace('#0ea5e9', '#0369a1') # sky-700
    content = content.replace('#0284c7', '#075985') # sky-600 -> sky-800

    with open(file_path, 'w') as f:
        f.write(content)

for root, _, files in os.walk(apps_dir):
    for file in files:
        if file.endswith('.jsx'):
            fix_contrast(os.path.join(root, file))

print("Mass contrast upgrade applied to all showcase apps!")
