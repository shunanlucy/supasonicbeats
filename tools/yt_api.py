import json, urllib.request, urllib.parse, os

DATA_TOKENS = os.path.expanduser('~/Documents/PROJECTS/SUPASONIC BEATS/data/tokens.json')
CREDS_FILE = os.path.expanduser('~/Documents/PROJECTS/SUPASONIC BEATS/tools/youtube-marketing-skills/credentials.json')

def get_token():
    with open(DATA_TOKENS) as f:
        tokens = json.load(f)
    with open(CREDS_FILE) as f:
        creds = json.load(f)['web']

    data = urllib.parse.urlencode({
        'client_id': creds['client_id'],
        'client_secret': creds['client_secret'],
        'refresh_token': tokens['refresh_token'],
        'grant_type': 'refresh_token'
    }).encode('utf-8')

    req = urllib.request.Request('https://oauth2.googleapis.com/token', data=data)
    with urllib.request.urlopen(req) as resp:
        new_t = json.loads(resp.read().decode('utf-8'))

    tokens['access_token'] = new_t['access_token']
    with open(DATA_TOKENS, 'w') as f:
        json.dump(tokens, f, indent=2)
    return tokens['access_token']

def api_get(endpoint):
    token = get_token()
    headers = {'Authorization': f'Bearer {token}'}
    sep = '&' if '?' in endpoint else '?'
    url = f'https://www.googleapis.com/youtube/v3/{endpoint}'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

if __name__ == '__main__':
    t = get_token()
    print('Token refreshed successfully!')
