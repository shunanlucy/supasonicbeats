#!/usr/bin/env python3
"""
Supasonic Beats - Automated Channel Tracker & Brain Synchronizer
Fetches live stats, view counts, new uploads, and updates the Channel Brain.
"""

import json
import urllib.request
import os
import datetime

WORKSPACE = "/home/shunan/Documents/PROJECTS/SUPASONIC BEATS"
TOKENS_PATH = os.path.join(WORKSPACE, "data/tokens.json")
PROFILE_PATH = os.path.join(WORKSPACE, "channel_brain/CHANNEL_PROFILE.md")
SONG_VAULT_PATH = os.path.join(WORKSPACE, "channel_brain/SONG_VAULT.md")

def get_token():
    with open(TOKENS_PATH) as f:
        tokens = json.load(f)
    return tokens['access_token']

def api_get(url, token):
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
    return json.loads(urllib.request.urlopen(req).read().decode())

def main():
    token = get_token()
    
    # 1. Channel stats
    ch_url = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics,snippet&mine=true'
    ch_data = api_get(ch_url, token)['items'][0]
    stats = ch_data['statistics']
    subs = stats.get('subscriberCount', '0')
    views = stats.get('viewCount', '0')
    vid_count = stats.get('videoCount', '0')
    uploads_id = ch_data['contentDetails']['relatedPlaylists']['uploads']
    
    now_str = datetime.datetime.now().strftime("%d %b %Y, %I:%M %p")
    print(f"[{now_str}] Channel Stats: Subs={subs}, Total Views={views}, Videos={vid_count}")
    
    # 2. Uploads list
    vids = []
    page_token = ''
    while True:
        url = f'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId={uploads_id}&pageToken={page_token}'
        res = api_get(url, token)
        vids.extend(res.get('items', []))
        page_token = res.get('nextPageToken')
        if not page_token:
            break
            
    video_ids = [v['contentDetails']['videoId'] for v in vids]
    all_details = []
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i:i+50]
        b_url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,status&id=' + ','.join(batch)
        b_res = api_get(b_url, token)
        all_details.extend(b_res.get('items', []))
        
    sorted_vids = sorted(all_details, key=lambda x: int(x.get('statistics', {}).get('viewCount', 0)), reverse=True)
    
    # Save snapshot
    snap_path = os.path.join(WORKSPACE, "channel_brain/live_videos_snapshot.json")
    with open(snap_path, 'w') as f:
        json.dump({
            "timestamp": now_str,
            "subscribers": subs,
            "views": views,
            "videos": sorted_vids
        }, f, indent=2)
        
    print(f"Channel snapshot saved with {len(sorted_vids)} tracks.")

if __name__ == "__main__":
    main()
