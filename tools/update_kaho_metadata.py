import sys, os
sys.path.append('/home/shunan/Documents/PROJECTS/SUPASONIC BEATS')
import tools.yt_api as yt

VIDEO_ID = 'OAxXnaUsiZw'

TITLE = "KAHO NA KAHO | Heavy Trance x Car Music • Late Night Driving Bass | Supasonic Beats [130 BPM]"

DESCRIPTION = """KAHO NA KAHO | Heavy Trance x Car Music • Late Night Driving Bass | Supasonic Beats [130 BPM]

Experience the iconic melody 'Kaho Na Kaho' reimagined into a high-velocity Heavy Trance & Car Music club banger. Powered by a driving 130 BPM rolling trance bassline, deep 40Hz chest-thumping subwoofer frequencies, hypnotic Spanish acoustic guitar riffs, and a seductive bilingual vocal delivery. Engineered for high-end car sound systems, night drives, and dancefloors.

🎧 Track Information:
• Title: KAHO NA KAHO (Heavy Car Trance Mix)
• Artist: Supasonic Beats
• Tempo: 130.0 BPM
• Key: F# Minor / Melodic Trance
• Mastering Target: -13.6 LUFS (Optimized for Car Subwoofers & YouTube Audio)

🕒 Timestamps:
0:00 Seductive Acoustic Guitar & Bilingual Hook
0:18 Heavy 130 BPM Trance Car Drop
1:13 Midnight Highway Drive Verse
1:43 Hypnotic Trance Build & Sub Rumble
2:15 Peak Hour Euphoric Dance Drop
3:05 Arabic Breakdown & Deep Whisper
3:35 Climax Outro Drop & Rolling Bassline Fade

✨ Follow Supasonic Beats:
Subscribe for daily Indian Afro House, Deep House, and High-Energy Car Music club bangers!
👉 https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1

🎧 Recommended Hits on Channel:
• DEEDAR DE (Club Mix): https://youtu.be/BuvPDZawk9M
• RAAT BAKI (Afro House): https://youtu.be/iXySpPM-wOc
• MADHOSH (Deep House Banger): https://youtu.be/0kS84V3qE5Y
• KAALI RAAT (Raga Techno): https://youtu.be/lcqS1aTRGDk
• SAJAN SAJAN (Afro House): https://youtu.be/dscqPBwW8bw

📜 Disclaimer & Fair Use Notice:
This track is an original transformative remix and tribute inspired by the classic composition 'Kaho Na Kaho' (Amir Jamal / Murder). All production, arrangement, sound design, sound recording, and master audio created independently by Supasonic Beats.

#KahoNaKaho #CarMusic #HeavyTrance #BassBoosted #SupasonicBeats #IndianAfroHouse #DeepHouseRemix #ClubBangers #SubwooferBass #LateNightDrive"""

TAGS = [
    "kaho na kaho", "kaho na kaho remix", "kaho na kaho car music",
    "kaho na kaho trance", "kaho na kaho bass boosted", "heavy trance car music",
    "indian afro house", "deep house remix", "supasonic beats", "car bass",
    "subwoofer test music", "driving car music", "late night car music",
    "bollywood trance remix", "kaho na kaho dance mix", "kaho na kaho 2026",
    "amir jamal remix", "murder movie song remix", "130 bpm trance",
    "club bangers 2026", "best car audio songs", "bass boosted trance",
    "hindi english remix", "bollywood club mix"
]

def update_metadata(privacy_status=None):
    # Fetch current snippet to avoid losing anything
    curr = yt.api_get(f'videos?part=snippet,status&id={VIDEO_ID}')['items'][0]
    snippet = curr['snippet']
    status = curr['status']
    
    snippet['title'] = TITLE
    snippet['description'] = DESCRIPTION
    snippet['tags'] = TAGS
    snippet['categoryId'] = '10' # Music
    
    payload = {
        'id': VIDEO_ID,
        'snippet': snippet
    }
    
    if privacy_status:
        status['privacyStatus'] = privacy_status
        payload['status'] = status
        
    res = yt.api_put('videos?part=snippet,status', payload)
    print("Metadata updated successfully! Title:", res['snippet']['title'])
    return res

if __name__ == '__main__':
    update_metadata()
