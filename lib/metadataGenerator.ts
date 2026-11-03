// Zero-API-Key Algorithmic Title, Tag & Description Generator for Supasonic Beats

export interface MetadataGeneratorInput {
  songName: string;
  subgenre: string;
  bpm: string;
  key: string;
  mood: string;
}

export interface GeneratedMetadata {
  titles: Array<{
    type: string;
    title: string;
    charCount: number;
    advantage: string;
  }>;
  tagsString: string;
  tagList: string[];
  totalTagChars: number;
  descriptionTemplate: string;
}

export function generateSongMetadata(input: MetadataGeneratorInput): GeneratedMetadata {
  const name = (input.songName || "NEW TRACK").trim().toUpperCase();
  const subgenre = input.subgenre || "Hindi Afro House";
  const bpm = input.bpm || "124";
  const key = input.key || "C Minor";
  const mood = input.mood || "Late Night Drive";

  // 1. Generate 5 High-Converting Title Variations
  const titles = [
    {
      type: "🔥 Algorithm Search Magnet (Recommended)",
      title: `${name} | ${subgenre} x Deep House | Supasonic Beats [${bpm} BPM]`,
      charCount: `${name} | ${subgenre} x Deep House | Supasonic Beats [${bpm} BPM]`.length,
      advantage: "Highest search volume: Captures both genre keywords and BPM tempo searchers.",
    },
    {
      type: "🚗 Late Night & Vibe Hook",
      title: `${name} (${mood} Mix) 🌙 Hindi Deep House & Afro Groove [${key}]`,
      charCount: `${name} (${mood} Mix) 🌙 Hindi Deep House & Afro Groove [${key}]`.length,
      advantage: "Strong emotional trigger: High click-through rate for late night music listeners.",
    },
    {
      type: "⚡ Club DJ & Beat Producer Standard",
      title: `[FREE] ${name} - ${subgenre} Club Drop (${bpm} BPM - ${key}) | Supasonic Beats`,
      charCount: `[FREE] ${name} - ${subgenre} Club Drop (${bpm} BPM - ${key}) | Supasonic Beats`.length,
      advantage: "Targets artists and DJs looking for fresh tracks and setlist openers.",
    },
    {
      type: "✨ Clean Minimal Aesthetic",
      title: `${name} • ${subgenre} (${key} • ${bpm} BPM)`,
      charCount: `${name} • ${subgenre} (${key} • ${bpm} BPM)`.length,
      advantage: "Ultra clean: Great readability on smart TVs and compact mobile feeds.",
    },
    {
      type: "🎧 Curiosity & Drop Hook",
      title: `Wait For The Drop! ⚡ ${name} - Hindi Afro House x Electronic Soul`,
      charCount: `Wait For The Drop! ⚡ ${name} - Hindi Afro House x Electronic Soul`.length,
      advantage: "Curiosity loop: Drives immediate play clicks from recommendation feeds.",
    },
  ];

  // 2. Generate 20 High-Ranking Tags (Under 500 Chars)
  const baseTags = [
    name.toLowerCase(),
    `${name.toLowerCase()} song`,
    `${name.toLowerCase()} supasonic beats`,
    subgenre.toLowerCase(),
    "hindi afro house",
    "deep house hindi",
    "supasonic beats",
    "desi electronic music",
    `${bpm} bpm afro house`,
    `${key.toLowerCase()} beat`,
    "hindi club bangers",
    "late night car music",
    "hindi dance pop",
    "indian electronic fusion",
    "afro beats hindi 2026",
    "car drive music hindi",
    "melodic deep house hindi",
    "best hindi club tracks",
    "desi dance drop",
    "electronic soul hindi",
  ];

  // Filter & ensure under 500 chars
  const tagList: string[] = [];
  let currentLength = 0;
  for (const tag of baseTags) {
    if (currentLength + tag.length + 2 < 490) {
      tagList.push(tag);
      currentLength += tag.length + 2;
    }
  }

  const tagsString = tagList.join(", ");

  // 3. Generate Complete YouTube Description Template
  const descriptionTemplate = `✨ ${name} — Official Release by Supasonic Beats
Discover the hypnotic pulse where Hindi melodies meet modern Afro House and Deep House grooves.

🎵 TRACK DETAILS:
• Track Name: ${name}
• Genre: ${subgenre}
• Tempo / BPM: ${bpm} BPM
• Musical Key: ${key}
• Mood: ${mood}
• Production: Supasonic Beats

🎧 LISTEN / STREAM:
• YouTube: @supasonicbeatsofficial
• Listen with headphones or high-bass speakers for the full experience.

📌 TIMESTAMPS:
0:00 Intro & Vocal Ambiance
0:32 The Groove Enters
1:04 Drop 1 (Afro House Bass)
1:48 Melodic Breakdown
2:20 Drop 2 (Main Energy)
2:58 Outro / Chill Fade

✨ ABOUT SUPASONIC BEATS:
Supasonic Beats brings Hindi melodies into the world of Afro House, Deep House and Dance Pop—blending expressive vocals, hypnotic grooves and deep bass.

#HindiAfroHouse #DeepHouse #SupasonicBeats #DesiElectronic #LateNightDrive #${name.replace(/\\s+/g, "")}`;

  return {
    titles,
    tagsString,
    tagList,
    totalTagChars: tagsString.length,
    descriptionTemplate,
  };
}
