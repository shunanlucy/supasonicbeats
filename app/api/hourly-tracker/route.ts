import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SNAPSHOT_PATH = path.join(process.cwd(), "data", "hourly_snapshots.json");

export async function GET() {
  try {
    if (!fs.existsSync(SNAPSHOT_PATH)) {
      return NextResponse.json({
        success: true,
        currentVelocity: 0,
        peakStatus: "BASELINE_SLUMP",
        peakLabel: "No data yet",
        history: [],
      });
    }

    const raw = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
    const history = JSON.parse(raw);
    const latest = history[history.length - 1] || null;

    // Calculate last 24h summary if available
    const recentSnapshots = history.slice(-24);

    return NextResponse.json({
      success: true,
      current: latest,
      recentSnapshots,
      historyCount: history.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
