import os
import glob
import re

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src'

for filepath in glob.glob(src_dir + '/**/*.jsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Tailwind classes fix for text contrast
    content = content.replace('text-slate-400', 'text-slate-600')
    content = content.replace('text-gray-400', 'text-gray-600')
    content = content.replace('text-zinc-400', 'text-zinc-600')
    content = content.replace('text-neutral-400', 'text-neutral-600')
    
    # Tailwind colorful text fix
    content = content.replace('text-emerald-500', 'text-emerald-700')
    content = content.replace('text-emerald-600', 'text-emerald-700')
    content = content.replace('bg-emerald-500 text-white', 'bg-emerald-700 text-white')
    content = content.replace('bg-emerald-600 text-white', 'bg-emerald-700 text-white')
    content = content.replace('bg-emerald-600', 'bg-emerald-700')
    
    content = content.replace('text-green-500', 'text-green-700')
    content = content.replace('text-green-600', 'text-green-700')
    content = content.replace('bg-green-500 text-white', 'bg-green-700 text-white')
    content = content.replace('bg-green-600 text-white', 'bg-green-700 text-white')
    
    content = content.replace('text-red-500', 'text-red-700')
    content = content.replace('text-red-600', 'text-red-700')
    content = content.replace('bg-red-500 text-white', 'bg-red-700 text-white')
    
    content = content.replace('text-amber-500', 'text-amber-700')
    content = content.replace('text-amber-600', 'text-amber-700')
    content = content.replace('bg-amber-500 text-white', 'bg-amber-700 text-white')
    
    content = content.replace('text-indigo-500', 'text-indigo-700')
    content = content.replace('text-blue-500', 'text-blue-700')

    # Wait, any remaining hex codes from earlier?
    # I already did #22c55e, #10b981 etc.
    # What about rgba?
    # The user pasted: `div style="font-size: 0.7rem; color: rgb(71, 85, 105); font-weight: 800;"`
    # rgb(71, 85, 105) is #475569! This is slate-600!
    # If slate-600 fails contrast, it must be because it's on a gray background or font size is too small (0.7rem).
    # Let's replace #475569 with #1e293b (slate-800)!
    content = content.replace('#475569', '#1e293b')
    content = content.replace('#4b5563', '#1f2937') # gray-600 -> gray-800
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed Tailwind classes in {filepath}")
