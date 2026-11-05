import json
import os
import re

print("========================================")
print("RUNNING 366 DAYS WITH GOD TEST SUITE")
print("========================================\n")

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# 1. Check Files
required_files = [
    "index.html",
    "manifest.json",
    "service-worker.js",
    "css/style.css",
    "css/themes.css",
    "css/responsive.css",
    "data/daily-devotionals.json",
    "js/bible-data.js",
    "js/state.js",
    "js/daily-reading.js",
    "js/dashboard.js",
    "js/calendar.js",
    "js/favourites.js",
    "js/prayer-journal.js",
    "js/personal-journal.js",
    "js/search.js",
    "js/settings.js",
    "js/notifications.js",
    "js/validator.js",
    "js/pdf-generator.js",
    "js/app.js",
    "js/jspdf.umd.min.js",
    "assets/icons/favicon.png",
    "assets/icons/icon-192.png",
    "assets/icons/icon-512.png"
]

missing_files = []
for rel in required_files:
    p = os.path.join(base_dir, rel)
    if not os.path.exists(p):
        missing_files.append(rel)

if missing_files:
    print(f"❌ FAILED: Missing files ({len(missing_files)}): {missing_files}")
    exit(1)
else:
    print("✅ All 24 core application files present.")

# 2. Check JSON database
json_path = os.path.join(base_dir, "data", "daily-devotionals.json")
with open(json_path, "r", encoding="utf-8") as f:
    devotionals = json.load(f)

print(f"✅ JSON database loaded: {len(devotionals)} entries.")

if len(devotionals) != 366:
    print(f"❌ FAILED: Expected exactly 366 devotionals, got {len(devotionals)}")
    exit(1)

# 3. Check Uniqueness & Completeness
refs = set()
duplicates = []
missing_fields = []
fields_to_check = [
    "id", "day", "month", "dateString", "theme", "dailyTitle", 
    "book", "chapter", "verse", "reference", "text", 
    "explanation", "devotional", "prayer", "reflection", "action"
]

for idx, d in enumerate(devotionals):
    day = d.get("day")
    if day != idx + 1:
        print(f"❌ FAILED: Day sequence error at index {idx}, expected {idx + 1}, got {day}")
        exit(1)

    ref = d.get("reference")
    if not ref:
        missing_fields.append((day, "reference"))
    elif ref in refs:
        duplicates.append((day, ref))
    else:
        refs.add(ref)

    for field in fields_to_check:
        val = d.get(field)
        if val is None or (isinstance(val, str) and not val.strip()):
            missing_fields.append((day, field))

print(f"✅ Unique Bible references verified: {len(refs)} / 366.")

if duplicates:
    print(f"❌ FAILED: Found {len(duplicates)} duplicate references!")
    for dup in duplicates:
        print(f"   Day {dup[0]}: {dup[1]}")
    exit(1)
else:
    print("✅ ZERO duplicate Bible references confirmed.")

if missing_fields:
    print(f"❌ FAILED: Found {len(missing_fields)} missing fields!")
    for mf in missing_fields[:5]:
        print(f"   Day {mf[0]}: {mf[1]}")
    exit(1)
else:
    print("✅ ZERO missing fields across all 366 devotionals.")

# 4. Check Monthly Theme counts
theme_counts = {}
for d in devotionals:
    theme_counts[d["month"]] = theme_counts.get(d["month"], 0) + 1

expected_months = {
    "January": 31, "February": 29, "March": 31, "April": 30,
    "May": 31, "June": 30, "July": 31, "August": 31,
    "September": 30, "October": 31, "November": 30, "December": 31
}

for m, exp in expected_months.items():
    act = theme_counts.get(m, 0)
    if act != exp:
        print(f"❌ FAILED: Month {m} expected {exp} days, got {act}")
        exit(1)

print("✅ All 12 monthly theme day counts strictly verified.")

# 5. Check Day 366 Special Title
day366 = devotionals[365]
if "366 DAYS OF FAITH – OUR JOURNEY CONTINUES" not in day366["dailyTitle"]:
    print(f"❌ FAILED: Day 366 title expected '366 DAYS OF FAITH – OUR JOURNEY CONTINUES', got '{day366['dailyTitle']}'")
    exit(1)
else:
    print(f"✅ Day 366 title verified: '{day366['dailyTitle']}'.")

print("\n========================================")
print("ALL TESTS PASSED WITH 100% SUCCESS! 🛡️")
print("========================================")

