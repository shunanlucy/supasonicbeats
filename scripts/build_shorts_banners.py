import os
import subprocess
import json

SHORTS_DIR = "/home/shunan/Downloads/SHORTS"
OUTPUT_DIR = "public/shorts_banner"
MANIFEST_FILE = "data/shorts_banner_manifest.json"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs("data", exist_ok=True)

files = [f for f in os.listdir(SHORTS_DIR) if f.endswith(".mp4")]
files.sort()

manifest = []

# Title & Metadata dictionary for each file
META_MAP = {
    "jaadu.mp4": {"title": "JAADU", "bpm": 124, "key": "F Minor", "genre": "Hindi Afro House", "views": 18400, "videoId": "87ndOuq346I"},
    "kabhi shaam dhale.mp4": {"title": "KABHI SHAAM DHALE", "bpm": 122, "key": "C Minor", "genre": "Deep House x Sunset Mix", "views": 24200, "videoId": "wE7QEsQ9IPI"},
    "labonko.mp4": {"title": "LABON KO", "bpm": 125, "key": "G Minor", "genre": "Desi Afro Beats", "views": 15600, "videoId": "UjthtKkgwWU"},
    "madhosh.mp4": {"title": "MADHOSH", "bpm": 124, "key": "D Minor", "genre": "Late Night Drive", "views": 31000, "videoId": "rC8QB0BZ9EU"},
    "majboor.mp4": {"title": "MAJBOOR", "bpm": 126, "key": "A# Minor", "genre": "Melodic Afro Techno", "views": 19800, "videoId": "1Mg56Wyc56U"},
    "nazrein.mp4": {"title": "NAZREIN", "bpm": 122, "key": "F Minor", "genre": "Afro House Club Groove", "views": 27500, "videoId": "1v5PsqhH95k"},
    "raatbaki.mp4": {"title": "RAAT BAKI", "bpm": 124, "key": "C Minor", "genre": "Retro Afro House Fusion", "views": 42000, "videoId": "1suK9qPK_ds"},
    "sajna.mp4": {"title": "SAJNAA", "bpm": 120, "key": "E Minor", "genre": "Deep House x Soul", "views": 22400, "videoId": "2JGI6vn2kW8"},
    "scene.mp4": {"title": "SCENE", "bpm": 126, "key": "F Minor", "genre": "Festival Club Banger", "views": 53000, "videoId": "SQzOlmY413Y"},
    "sunona.mp4": {"title": "SUNO NA", "bpm": 123, "key": "G Minor", "genre": "Chill Midnight Pop", "views": 16900, "videoId": "Ossd36BQPzs"},
    "tabaahi.mp4": {"title": "TABAAHI", "bpm": 128, "key": "D Minor", "genre": "Heavy 808 Bass Boosted", "views": 38700, "videoId": "pgJIMI4Ihzw"},
    "tumiljaye.mp4": {"title": "TU MIL JAYE", "bpm": 124, "key": "A# Minor", "genre": "Romantic Afro Pop", "views": 29100, "videoId": "87ndOuq346I"},
}

for idx, filename in enumerate(files):
    base_name = os.path.splitext(filename)[0].replace(" ", "_").lower()
    input_path = os.path.join(SHORTS_DIR, filename)
    gif_path = os.path.join(OUTPUT_DIR, f"{base_name}.gif")
    mp4_preview = os.path.join(OUTPUT_DIR, f"{base_name}.mp4")
    jpg_thumb = os.path.join(OUTPUT_DIR, f"{base_name}.jpg")

    meta = META_MAP.get(filename, {
        "title": base_name.upper().replace("_", " "),
        "bpm": 124,
        "key": "F Minor",
        "genre": "Hindi Afro House",
        "views": 20000 + idx * 1500,
        "videoId": "87ndOuq346I"
    })

    print(f"Processing [{idx+1}/{len(files)}] {filename} -> {base_name}...")

    # 1. Generate JPG poster frame
    if not os.path.exists(jpg_thumb):
        subprocess.run([
            "ffmpeg", "-y", "-ss", "1", "-i", input_path,
            "-vframes", "1", "-q:v", "3", jpg_thumb
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 2. Generate lightweight 2.5s GIF (width=280, fps=10, palettegen)
    if not os.path.exists(gif_path):
        subprocess.run([
            "ffmpeg", "-y", "-ss", "0", "-t", "2.5", "-i", input_path,
            "-vf", "fps=10,scale=280:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer",
            gif_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 3. Generate compressed 5s MP4 preview loop (crf=28, width=320)
    if not os.path.exists(mp4_preview):
        subprocess.run([
            "ffmpeg", "-y", "-ss", "0", "-t", "5", "-i", input_path,
            "-an", "-vf", "scale=320:-2", "-c:v", "libx264", "-crf", "28", "-preset", "fast",
            mp4_preview
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    manifest.append({
        "id": f"short-{base_name}",
        "rawFilename": filename,
        "baseName": base_name,
        "title": meta["title"],
        "bpm": meta["bpm"],
        "key": meta["key"],
        "genre": meta["genre"],
        "views": meta["views"],
        "videoId": meta["videoId"],
        "gifUrl": f"/shorts_banner/{base_name}.gif",
        "mp4Url": f"/shorts_banner/{base_name}.mp4",
        "posterUrl": f"/shorts_banner/{base_name}.jpg",
        "watchUrl": f"/watch/{meta['videoId']}?from=short-{base_name}",
        "audioUrl": "/audio/clover_clip.mp3",
    })

with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

print(f"✓ All {len(manifest)} shorts processed successfully!")
