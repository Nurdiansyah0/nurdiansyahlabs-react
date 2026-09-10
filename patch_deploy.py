import re

with open(".github/workflows/deploy.yml", "r") as f:
    content = f.read()

# Insert SEO drift check after build
step_to_insert = """
      # ─── 4.5. SEO Drift Validation ────────────────────────────────
      - name: 🔍 SEO Drift Validation
        run: |
          # Start a local static server to serve the build output
          npx serve -s dist -l 3000 &
          SERVE_PID=$!
          # Wait for server to start
          sleep 3
          # Run the drift script against the local build
          export SEO_TARGET_URL="http://127.0.0.1:3000"
          python3 scripts/seo_drift.py
          # Kill the server
          kill $SERVE_PID
"""

# Insert before "5. Prepare Full Deployment Package"
content = content.replace("      # ─── 5. Prepare Full Deployment Package", step_to_insert.lstrip('\n') + "\n      # ─── 5. Prepare Full Deployment Package")

with open(".github/workflows/deploy.yml", "w") as f:
    f.write(content)
