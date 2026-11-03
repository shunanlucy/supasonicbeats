import { NextResponse } from "next/server";
import { fetchLivePulse } from "@/lib/youtube";
import fs from "fs";
import path from "path";

const SNAPSHOT_PATH = path.join(process.cwd(), "data", "hourly_snapshots.json");

export async function GET() {
  try {
    const pulse = await fetchLivePulse();

    let hourlyData: any = {
      viewsPerHourRate: 0,
      peakStatus: "BASELINE_SLUMP",
      peakLabel: "Tracking Baseline",
      recentSnapshots: [],
    };

    if (fs.existsSync(SNAPSHOT_PATH)) {
      try {
        const raw = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
        const history = JSON.parse(raw);
        const latest = history[history.length - 1];
        if (latest) {
          hourlyData = {
            viewsPerHourRate: latest.viewsPerHourRate || 0,
            peakStatus: latest.peakStatus || "BASELINE_SLUMP",
            peakLabel: latest.peakLabel || "Tracking Baseline",
            recentSnapshots: history.slice(-24),
            topMovers: latest.topMovers || [],
          };
        }
      } catch (e) {
        // ignore parse error
      }
    }

    return NextResponse.json({ success: true, ...pulse, hourly: hourlyData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
