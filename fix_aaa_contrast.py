import os

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project'

# 1. Fix TrendsDashboard.jsx
trends = os.path.join(src_dir, 'src/pages/TrendsDashboard.jsx')
with open(trends, 'r') as f:
    content = f.read()

# Make the text colors on the light backgrounds EXTREMELY dark to pass AAA (7:1) for 11px text
content = content.replace("color: '#1e3a8a'", "color: '#172554'") # blue-950
content = content.replace("color: '#4338ca'", "color: '#1e1b4b'") # indigo-950
content = content.replace("color: '#065f46'", "color: '#022c22'") # emerald-950
content = content.replace("color: '#5b21b6'", "color: '#2e1065'") # violet-950
content = content.replace("color: '#059669'", "color: '#022c22'") # just in case

with open(trends, 'w') as f:
    f.write(content)

# 2. Fix BlogPage.jsx (the dynamic post.accent might be amber-500 from DB)
blog = os.path.join(src_dir, 'src/pages/BlogPage.jsx')
with open(blog, 'r') as f:
    content = f.read()

# Override post.accent if it's the light amber
content = content.replace('background: post.accent,', 'background: post.accent === "#f59e0b" ? "#92400e" : post.accent,')
content = content.replace('background: `linear-gradient(135deg, ${post.accent},', 'background: `linear-gradient(135deg, ${post.accent === "#f59e0b" ? "#92400e" : post.accent},')

with open(blog, 'w') as f:
    f.write(content)

# 3. Fix auto_post_trends.php for future posts
auto_post = os.path.join(src_dir, 'api/auto_post_trends.php')
with open(auto_post, 'r') as f:
    content = f.read()

content = content.replace("'accent' => '#f59e0b',", "'accent' => '#92400e',")
with open(auto_post, 'w') as f:
    f.write(content)

print("Fixed TrendsDashboard and BlogPage contrast ratios for AAA compliance.")
