#!/usr/bin/env python3
"""
Supasonic Beats — VidIQ-Style Automated Competitor Tracker & Audit Engine
Pulls live data across all top competitors:
  - Live Subscribers & Catalog Size
  - Recent Drops & Upload Cadence
  - Views Per Hour (VPH) & Velocity
  - Engagement Rate % (Likes / Views)
  - VidIQ-Style Tag Inspector (Extracts exact tags/keywords)
  - Breakout Outlier Detection
"""

import urllib.request
import urllib.parse
import json
import re
import os
import sys
from datetime import datetime, timezone

COMPETITORS = [
    {"name": "Singularity Beats", "handle": "@singularityme", "id": "UCJYfHSDTzYipudeDVqA3ALQ"},
    {"name": "Dhun Music Vibes", "handle": "@dhunmusicvibe", "id": "UCxN448G94J5J9R7z73l_wKw"},
    {"name": "SANIRA", "handle": "@sanira", "id": "sanira"},
    {"name": "Clover Beats", "handle": "@cloverbeats", "id": "cloverbeats"},
    {"name": "DJ CatHouse", "handle": "@djcathouse", "id": "djcathouse"},
    {"name": "DJ Arjun (Official)", "handle": "@djarjunofficial", "id": "djarjun"},
    {"name": "AG Lofi Zone", "handle": "@aglofizone", "id": "UCYVsixaymNo3KpUtyIEtS3w"},
    {"name": "FLIPMODE", "handle": "@flipmode-ofc", "id": "UCoeaji0aND567AoqJulfOEQ"},
    {"name": "Nomadic Beats", "handle": "@nomadicbeatss", "id": "UC787fmQpNhb0fagWDLi4Hqw"},
    {"name": "Supasonic Beats (YOU)", "handle": "@SupasonicBeatsOfficial", "id": "UCM1yIAO_tvDGWOYi3JcyacA"}
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

def fetch_channel_data(handle):
    url = f"https://www.youtube.com/{handle}/videos"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
            # Extract Subs
            subs_match = re.findall(r'(\d+[\d\.]*[KM]?\s*subscribers)', html, re.I)
            subs = subs_match[0] if subs_match else "N/A"
            
            # Extract Videos
            vids_match = re.findall(r'(\d+[\d\.]*[KM]?\s*videos)', html, re.I)
            vids_count = vids_match[0] if vids_match else "N/A"
            
            # Extract recent video IDs & titles
            video_ids = re.findall(r'/watch\?v=([a-zA-Z0-9_-]{11})', html)
            # Unique preserve order
            seen = set()
            recent_vids = []
            for v in video_ids:
                if v not in seen:
                    seen.add(v)
                    recent_vids.append(v)
                if len(recent_vids) >= 3:
                    break
                    
            return {
                "subscribers": subs,
                "video_count": vids_count,
                "recent_video_ids": recent_vids
            }
    except Exception as e:
        return {"subscribers": "N/A", "video_count": "N/A", "recent_video_ids": [], "error": str(e)}

def fetch_video_metrics(video_id):
    url = f"https://www.youtube.com/watch?v={video_id}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
            # Title
            title_m = re.search(r'<title>(.*?)</title>', html)
            title = title_m.group(1).replace(" - YouTube", "") if title_m else video_id
            
            # Views
            views_m = re.search(r'\"viewCount\":\"(\d+)\"', html)
            views = int(views_m.group(1)) if views_m else 0
            
            # Likes
            likes_m = re.findall(r'(\d+[\d,]*)\s*likes', html, re.I)
            likes = int(likes_m[0].replace(',', '')) if likes_m else 0
            
            # Publish Date (ISO)
            pub_m = re.search(r'\"publishDate\":\"([^\"]+)\"', html)
            pub_date = pub_m.group(1) if pub_m else None
            
            # Tags / Keywords (VidIQ Inspector)
            keywords_m = re.search(r'\"keywords\":\[(.*?)\]', html)
            keywords = []
            if keywords_m:
                try:
                    keywords = json.loads(f"[{keywords_m.group(1)}]")
                except:
                    keywords = [k.strip('\"') for k in keywords_m.group(1).split(',')]
            
            # VPH (Views Per Hour) Calculation
            vph = 0.0
            hours_old = 1.0
            if pub_date:
                try:
                    # Clean date format
                    dt = datetime.fromisoformat(pub_date.replace("Z", "+00:00"))
                    now = datetime.now(timezone.utc)
                    hours_old = max(1.0, (now - dt).total_seconds() / 3600.0)
                    vph = round(views / hours_old, 1)
                except Exception:
                    pass
            
            # Engagement Rate
            eng_rate = round((likes / max(1, views)) * 100, 2)
            
            return {
                "id": video_id,
                "title": title,
                "views": views,
                "likes": likes,
                "vph": vph,
                "hours_old": round(hours_old, 1),
                "engagement_rate_pct": eng_rate,
                "keywords": keywords[:15]
            }
    except Exception as e:
        return {"id": video_id, "title": "Error", "views": 0, "likes": 0, "vph": 0, "keywords": [], "error": str(e)}

def run_audit(save_snapshot=True):
    print("=" * 75)
    print("🚀 SUPASONIC BEATS — VIDIQ-STYLE COMPETITOR AUDIT ENGINE")
    print(f"🕒 Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}")
    print("=" * 75)
    
    report_data = []
    
    for comp in COMPETITORS:
        name = comp["name"]
        handle = comp["handle"]
        print(f"\n📡 Tracking [{name}] ({handle})...")
        ch_data = fetch_channel_data(handle)
        
        # Analyze top recent video
        latest_vid = None
        if ch_data["recent_video_ids"]:
            latest_vid = fetch_video_metrics(ch_data["recent_video_ids"][0])
            
        entry = {
            "name": name,
            "handle": handle,
            "subscribers": ch_data["subscribers"],
            "total_videos": ch_data["video_count"],
            "latest_track": latest_vid
        }
        report_data.append(entry)
        
        # Live feedback
        if latest_vid and latest_vid.get("title") != "Error":
            print(f"  • Subs: {ch_data['subscribers']} | Videos: {ch_data['video_count']}")
            print(f"  • Latest Drop: '{latest_vid['title'][:45]}...'")
            print(f"  • Views: {latest_vid['views']:,} | VPH: {latest_vid['vph']} | Eng: {latest_vid['engagement_rate_pct']}%")
            if latest_vid['keywords']:
                print(f"  • VidIQ Tags ({len(latest_vid['keywords'])}): {', '.join(latest_vid['keywords'][:5])}...")
        else:
            print(f"  • Subs: {ch_data['subscribers']} | Videos: {ch_data['video_count']}")
            
    # Save snapshot
    if save_snapshot:
        snapshot_dir = "/home/shunan/Documents/PROJECTS/SUPASONIC BEATS/channel_brain"
        os.makedirs(snapshot_dir, exist_ok=True)
        snapshot_file = os.path.join(snapshot_dir, "competitor_vidiq_snapshots.json")
        with open(snapshot_file, "w") as f:
            json.dump({"timestamp": datetime.now().isoformat(), "audit": report_data}, f, indent=2)
        print(f"\n✅ Snapshot successfully saved to: {snapshot_file}")
        
    return report_data

if __name__ == "__main__":
    run_audit()
