// Catalog SEO & Health Audit Engine for Supasonic Beats

export interface VideoAuditItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  publishedAt: string;
  thumbnail: string;
  ageDays: number;
  viewsPerDay: number;
  healthScore: number; // 0 - 100
  status: "Optimized" | "Needs Polish" | "Critical Fix";
  issues: string[];
  suggestedTitle: string;
  suggestedTags: string[];
}

export interface CatalogAuditResult {
  overallHealthScore: number;
  totalAudited: number;
  optimizedCount: number;
  needsPolishCount: number;
  criticalFixCount: number;
  missingBpmCount: number;
  missingKeyCount: number;
  missingSubgenreCount: number;
  items: VideoAuditItem[];
}

export function auditVideoCatalog(beats: any[]): CatalogAuditResult {
  const now = new Date();
  let totalScore = 0;
  let missingBpmCount = 0;
  let missingKeyCount = 0;
  let missingSubgenreCount = 0;

  const items: VideoAuditItem[] = beats.map((b) => {
    const title = b.title || "";
    const tags = b.tags || [];
    const views = b.views || 0;
    const likes = b.likes || 0;
    const pubDate = new Date(b.publishedAt || now);
    const ageDays = Math.max(1, Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24)));
    const viewsPerDay = parseFloat((views / ageDays).toFixed(1));

    let score = 100;
    const issues: string[] = [];

    // 1. BPM Check
    const hasBpm = Boolean(b.bpm) || /\b\d{2,3}\s*bpm\b/i.test(title);
    if (!hasBpm) {
      score -= 25;
      missingBpmCount++;
      issues.push("BPM missing in title (Artists search specifically by tempo like '124 BPM').");
    }

    // 2. Key Check
    const hasKey = Boolean(b.key) || /\b[A-G][#b]?(?:\s*(?:min(?:or)?|maj(?:or)?|m))\b/i.test(title);
    if (!hasKey) {
      score -= 15;
      missingKeyCount++;
      issues.push("Musical Key missing (Singers & DJs filter by key).");
    }

    // 3. Subgenre / Keyword Check
    const hasSubgenre = /afro house|deep house|club banger|dance pop|late night|mix|phonk/i.test(title);
    if (!hasSubgenre) {
      score -= 30;
      missingSubgenreCount++;
      issues.push("Subgenre missing! Title doesn't mention 'Afro House', 'Deep House', etc.");
    }

    // 4. Formatting Separator Check
    const hasSeparators = /\||•|x|-/.test(title);
    if (!hasSeparators) {
      score -= 15;
      issues.push("Separator formatting (| ya x) missing for clean mobile readability.");
    }

    // 5. Length Check
    if (title.length < 35) {
      score -= 15;
      issues.push("Title too short (< 35 chars) — misses out on search traffic.");
    }

    score = Math.max(15, Math.min(100, score));
    totalScore += score;

    let status: "Optimized" | "Needs Polish" | "Critical Fix" = "Optimized";
    if (score < 55) status = "Critical Fix";
    else if (score < 80) status = "Needs Polish";

    // Generate Suggested Replacement Title
    const baseSongName = title.split(/[|•x-]/)[0].trim().toUpperCase() || "UNTITLED BEAT";
    const cleanGenre = b.genre === "Shorts / Teaser" ? "Hindi Afro House" : (b.genre || "Hindi Afro House x Deep House");
    const bpmSuffix = b.bpm ? ` [${b.bpm} BPM]` : " [124 BPM]";
    const keySuffix = b.key ? ` (${b.key})` : "";
    
    const suggestedTitle = `${baseSongName} | ${cleanGenre}${keySuffix} | Supasonic Beats${bpmSuffix}`;

    // Generate Suggested Tags
    const suggestedTags = [
      baseSongName.toLowerCase(),
      cleanGenre.toLowerCase(),
      "hindi afro house",
      "deep house hindi",
      "supasonic beats",
      "desi electronic music",
      "club bangers hindi",
      "late night drive songs",
      "indian deep house",
      "afro beats hindi",
      b.bpm ? `${b.bpm} bpm beat` : "124 bpm afro house",
    ];

    return {
      id: b.id,
      title,
      views,
      likes,
      publishedAt: b.publishedAt,
      thumbnail: b.thumbnail,
      ageDays,
      viewsPerDay,
      healthScore: score,
      status,
      issues,
      suggestedTitle,
      suggestedTags,
    };
  });

  const totalAudited = items.length;
  const overallHealthScore = totalAudited > 0 ? Math.round(totalScore / totalAudited) : 100;
  const optimizedCount = items.filter((i) => i.status === "Optimized").length;
  const needsPolishCount = items.filter((i) => i.status === "Needs Polish").length;
  const criticalFixCount = items.filter((i) => i.status === "Critical Fix").length;

  return {
    overallHealthScore,
    totalAudited,
    optimizedCount,
    needsPolishCount,
    criticalFixCount,
    missingBpmCount,
    missingKeyCount,
    missingSubgenreCount,
    items,
  };
}
