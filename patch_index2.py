with open("index.html", "r") as f:
    content = f.read()

content = content.replace("</head>", '  <link rel="canonical" href="https://nurdiansyahlabs.com" />\n</head>')

with open("index.html", "w") as f:
    f.write(content)
