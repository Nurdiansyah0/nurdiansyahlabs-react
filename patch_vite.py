import re

with open("vite.config.js", "r") as f:
    content = f.read()

content = content.replace("renderAfterTime: 2000", "renderAfterDocumentEvent: 'render-event'")

with open("vite.config.js", "w") as f:
    f.write(content)
