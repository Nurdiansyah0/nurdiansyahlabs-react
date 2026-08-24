import requests
import json
import os
import sys

API_KEY = os.getenv("GCP_API_KEY", "")
PROJECT_ID = "9426888637321116572"

SCREENS = {
    "home_code.html": "5806ca2a25d14eaf853aff94ac85dd27",
    "services_code.html": "9fd3c1568c54474daf6c3b6cd2b99ced",
    "contact_code.html": "eb8248d645474a25a70ebef39cf7b92e",
}

for filename, screen_id in SCREENS.items():
    url = f"https://stitch.googleapis.com/v1/projects/{PROJECT_ID}/screens/{screen_id}"
    print(f"Fetching metadata for {filename}...")
    headers = {"X-Goog-Api-Key": API_KEY}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        download_url = data.get("htmlCode", {}).get("downloadUrl")
        if download_url:
            print(f"Downloading HTML to {filename}...")
            html_res = requests.get(download_url)
            with open(filename, "w") as f:
                f.write(html_res.text)
            print("Done.")
        else:
            print(f"No download URL found for {screen_id}")
    else:
        print(f"Failed fetching {screen_id}: {response.status_code}")
