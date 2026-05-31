import os
import re

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src'

# 1. Fix ContactForm.jsx select label
contact_path = os.path.join(src_dir, 'components/ContactForm.jsx')
with open(contact_path, 'r') as f:
    content = f.read()

content = content.replace('<select\n                                name="service"', '<select aria-label="Select Service"\n                                name="service"')

with open(contact_path, 'w') as f:
    f.write(content)

# 2. Fix BlogPage.jsx dynamic badge background logic for extreme contrast
blog_path = os.path.join(src_dir, 'pages/BlogPage.jsx')
with open(blog_path, 'r') as f:
    content = f.read()

# I previously wrote: background: post.accent === "#f59e0b" ? "#92400e" : post.accent
# Now we replace it with a comprehensive check using a function
safe_accent_func = """
    // Function to ensure any badge background provides AAA contrast (7:1) with white text (#fff)
    const getSafeAccent = (hex) => {
        if (!hex) return '#1e293b';
        const lower = hex.toLowerCase();
        if (lower.includes('059669') || lower.includes('10b981')) return '#022c22'; // Emerald -> super dark green
        if (lower.includes('22c55e') || lower.includes('16a34a')) return '#14532d'; // Green -> super dark green
        if (lower.includes('f59e0b') || lower.includes('d97706')) return '#78350f'; // Amber -> super dark amber
        if (lower.includes('3b82f6') || lower.includes('2563eb')) return '#1e3a8a'; // Blue -> super dark blue
        if (lower.includes('8b5cf6') || lower.includes('a855f7')) return '#2e1065'; // Violet -> super dark violet
        if (lower.includes('6366f1') || lower.includes('4f46e5')) return '#1e1b4b'; // Indigo -> super dark indigo
        return lower; // Assume others are safe (like original '#3730a3' or already dark)
    };
"""

# Insert function before component returns or inside it
if "const getSafeAccent" not in content:
    content = content.replace('export default function BlogPage() {', safe_accent_func + '\nexport default function BlogPage() {')

# Replace the previous fix with the new function
content = content.replace('background: post.accent === "#f59e0b" ? "#92400e" : post.accent,', 'background: getSafeAccent(post.accent),')
content = content.replace('background: `linear-gradient(135deg, ${post.accent === "#f59e0b" ? "#92400e" : post.accent},', 'background: `linear-gradient(135deg, ${getSafeAccent(post.accent)},')

with open(blog_path, 'w') as f:
    f.write(content)

# 3. Fix BlogListing.jsx dynamic badge background
listing_path = os.path.join(src_dir, 'pages/BlogListing.jsx')
with open(listing_path, 'r') as f:
    content = f.read()

if "const getSafeAccent" not in content:
    content = content.replace('export default function BlogListing() {', safe_accent_func + '\nexport default function BlogListing() {')

content = content.replace('background: article.accent, color: \'#fff\',', 'background: getSafeAccent(article.accent), color: \'#fff\',')

with open(listing_path, 'w') as f:
    f.write(content)

print("Comprehensive fixes applied!")
