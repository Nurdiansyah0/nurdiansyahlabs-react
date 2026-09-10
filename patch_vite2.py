import re

with open("vite.config.js", "r") as f:
    content = f.read()

content = content.replace("renderAfterDocumentEvent: 'render-event'", "renderAfterTime: 5000")

with open("vite.config.js", "w") as f:
    f.write(content)
