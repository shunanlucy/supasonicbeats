const fs = require('fs');
const { google } = require('googleapis');

async function main() {
  const tokens = JSON.parse(fs.readFileSync('data/tokens.json', 'utf8'));
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials(tokens);
  oauth2Client.on('tokens', (newTokens) => {
    const merged = { ...tokens, ...newTokens, updated_at: new Date().toISOString() };
    fs.writeFileSync('data/tokens.json', JSON.stringify(merged, null, 2));
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  // 1. Fetch channel playlists
  console.log('Fetching playlists...');
  const playlistsRes = await youtube.playlists.list({
    part: ['snippet', 'contentDetails'],
    mine: true,
    maxResults: 50,
  });

  console.log('\n=== CURRENT PLAYLISTS (' + (playlistsRes.data.items?.length || 0) + ') ===');
  const existingPlaylists = playlistsRes.data.items || [];
  for (const pl of existingPlaylists) {
    console.log(`- Playlist: "${pl.snippet.title}" (ID: ${pl.id}, Items: ${pl.contentDetails.itemCount})`);
    
    // Also fetch items inside this playlist
    const plItems = await youtube.playlistItems.list({
      part: ['snippet'],
      playlistId: pl.id,
      maxResults: 50,
    });
    const itemTitles = plItems.data.items?.map(i => i.snippet.title) || [];
    console.log(`  Videos in playlist:`, itemTitles);
  }

  // 2. Fetch channel upload playlist
  const channelRes = await youtube.channels.list({
    part: ['contentDetails', 'snippet'],
    mine: true,
  });
  const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

  // 3. Fetch all videos
  console.log('\nFetching all uploaded videos...');
  let allVideos = [];
  let pageToken = undefined;
  do {
    const itemsRes = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken,
    });
    for (const item of itemsRes.data.items) {
      allVideos.push({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
      });
    }
    pageToken = itemsRes.data.nextPageToken;
  } while (pageToken);

  console.log(`\n=== TOTAL VIDEOS: ${allVideos.length} ===`);
  allVideos.forEach((v, idx) => {
    console.log(`${idx + 1}. [${v.id}] ${v.title}`);
  });

  fs.writeFileSync('all_channel_videos.json', JSON.stringify({ playlists: existingPlaylists, videos: allVideos }, null, 2));
  console.log('\nWrote all data to all_channel_videos.json');
}

main().catch(console.error);
