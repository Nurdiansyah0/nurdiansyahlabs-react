import os

src_dir = '/home/nurdiansyah/Nurdiansyah_dev/Personal_project/src'

# Fix Navbar.jsx select element
navbar = os.path.join(src_dir, 'components/Navbar.jsx')
with open(navbar, 'r') as f:
    nav_content = f.read()

nav_content = nav_content.replace('<select\n                        value={lang}', '<select aria-label="Select Language"\n                        value={lang}')
with open(navbar, 'w') as f:
    f.write(nav_content)

# Fix ContactForm.jsx select element
contact = os.path.join(src_dir, 'components/ContactForm.jsx')
with open(contact, 'r') as f:
    contact_content = f.read()

contact_content = contact_content.replace('<select\n                                name="service" required', '<select aria-label="Select Service"\n                                name="service" required')
with open(contact, 'w') as f:
    f.write(contact_content)

print("Fixed select aria-labels")
