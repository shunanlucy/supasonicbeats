# SUPASONIC BEATS — Pro Studio Analytics 2.0 (Localhost)

A next-generation local analytics suite designed specifically for music producers and beatmakers. Directly connects to your YouTube Studio Analytics via official Google OAuth 2.0 with zero fees and complete privacy.

---

## 🚀 Key Advantages Over Standard YouTube Studio
1. **Automated Beat Tagging**: Automatically detects BPM (tempo), Musical Key, and Beat Genre/Style from your video titles and tags.
2. **Producer Engagement Score**: Measures true listener loyalty (`(Likes * 10 + Comments * 20) / Views * 10`), so you know which beats convert artists into buyers.
3. **Studio Advisor & Growth Matrix**: Recommendations for optimal upload tempos, tags, and audience discovery channels.
4. **Local Privacy**: Your tokens and channel metrics stay 100% on your local machine (`data/tokens.json`).
5. **Fast & Ad-Free**: Instant switching between 7-Day, 28-Day, and 90-Day analytics without the clunkiness of web YouTube Studio.

---

## 🛠️ How to Start the App

In the project folder, simply run:

```bash
./start.sh
```
or
```bash
npm run dev
```

Then open your browser at:
👉 **[http://localhost:3001](http://localhost:3001)**

---

## 🔐 First Time Login
1. Click **"Connect SUPASONIC BEATS Channel"**.
2. Sign in with the Google Account that owns your YouTube channel.
3. If Google displays a *"Google hasn't verified this app"* warning (normal for localhost apps in testing mode), click **Advanced** -> **Go to Supasonic Analytics (unsafe)** -> **Continue**.
4. You will be redirected right back to your dashboard with all your live channel data, recent beats, traffic sources, and watch time charts!
