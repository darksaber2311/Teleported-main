import os
import re

FRONTEND_DIR = r"c:\Users\Urvi\Documents\Projects\Teleported\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Update Fonts
    content = content.replace("Outfit", "Space Mono")
    content = content.replace("Inter", "Space Mono")

    # 2. Update hardcoded RGB to use CSS variable for dynamic themes
    content = re.sub(r'rgba\(240,\s*168,\s*50,', 'rgba(var(--gold-rgb),', content)
    content = re.sub(r'#f0a832', 'var(--gold)', content)
    content = re.sub(r'#e09020', 'var(--gold-dark)', content)

    # 3. Specifically format global.css
    if "global.css" in filepath.replace("\\", "/"):
        # Update imports
        content = re.sub(
            r"@import url\('.*?'\);",
            "@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');",
            content
        )

        # Let's inject --gold-rgb and --gold-dark into :root
        root_replacement = """:root {
  --bg-deep: #121415;
  --bg-surface: #1a1c1d;
  --bg-card: #222627;
  --bg-glass: rgba(26, 28, 29, 0.82);
  --border: rgba(255, 255, 255, 0.07);
  --border-hover: rgba(var(--gold-rgb), 0.35);
  --gold: #c4d300;
  --gold-dark: #a8b500;
  --gold-rgb: 196, 211, 0;
  --gold-light: #e2f033;
  --teal: #00c9a7;
  --coral: #ff6b6b;
  --purple: #a78bfa;
  --text: #e8eaf6;
  --text-muted: #8899bb;
  --text-faint: #4a5a7a;
  --navbar-h: 68px;
  --sidebar-w: 320px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --shadow-card: 0 8px 32px rgba(0,0,0,0.45);
  --shadow-glow: 0 0 24px rgba(var(--gold-rgb), 0.18);
  --transition: 0.25s cubic-bezier(0.4,0,0.2,1);
}"""
        content = re.sub(r':root\s*\{[^}]+\}', root_replacement, content, count=1, flags=re.DOTALL)

        # Update light mode
        light_replacement = """body.light-mode {
  --bg-deep: #f5f2eb;
  --bg-surface: #ffffff;
  --bg-card: #f9f7f4;
  --bg-glass: rgba(255,255,255,0.88);
  --border: rgba(0,0,0,0.08);
  --border-hover: rgba(var(--gold-rgb), 0.38);
  --gold: #e63946;
  --gold-dark: #c1121f;
  --gold-rgb: 230, 57, 70;
  --text: #2c3033;
  --text-muted: #687076;
  --text-faint: #a0aab2;
  --shadow-card: 0 8px 32px rgba(0,0,0,0.06);
}"""
        content = re.sub(r'body\.light-mode\s*\{[^}]+\}', light_replacement, content, count=1, flags=re.DOTALL)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(FRONTEND_DIR):
    for filename in files:
        if filename.endswith(".css") or filename.endswith(".jsx") or filename.endswith(".js"):
            filepath = os.path.join(root, filename)
            process_file(filepath)

print("UI Update completed.")
