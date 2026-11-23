import json, urllib.request, urllib.parse, os, time

DATA_TOKENS = os.path.expanduser('~/Documents/PROJECTS/SUPASONIC BEATS/data/tokens.json')
CREDS_FILE = os.path.expanduser('~/Documents/PROJECTS/SUPASONIC BEATS/tools/youtube-marketing-skills/credentials.json')

def get_token():
    for attempt in range(4):
        try:
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
            with urllib.request.urlopen(req, timeout=15) as resp:
                new_t = json.loads(resp.read().decode('utf-8'))

            tokens['access_token'] = new_t['access_token']
            with open(DATA_TOKENS, 'w') as f:
                json.dump(tokens, f, indent=2)
            return tokens['access_token']
        except Exception as e:
            if attempt == 3:
                raise e
            time.sleep(2 ** attempt)

def api_get(endpoint):
    for attempt in range(3):
        try:
            token = get_token()
            headers = {'Authorization': f'Bearer {token}'}
            url = f'https://www.googleapis.com/youtube/v3/{endpoint}'
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            if attempt == 2:
                raise e
            time.sleep(1.5)

def api_put(endpoint, payload):
    for attempt in range(3):
        try:
            token = get_token()
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            url = f'https://www.googleapis.com/youtube/v3/{endpoint}'
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers=headers, method='PUT')
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            if attempt == 2:
                raise e
            time.sleep(1.5)

def api_post(endpoint, payload):
    for attempt in range(3):
        try:
            token = get_token()
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            url = f'https://www.googleapis.com/youtube/v3/{endpoint}'
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            if attempt == 2:
                raise e
            time.sleep(1.5)

if __name__ == '__main__':
    t = get_token()
    print('Token refreshed successfully!')
