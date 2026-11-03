import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TRADES_FILE = path.join(process.cwd(), "data", "paper_trades.json");

function getTradesData() {
  if (!fs.existsSync(TRADES_FILE)) {
    return {
      portfolio: {
        startingBalance: 10000,
        currentBalance: 10000,
        totalPnL: 0,
        pnlPercentage: 0,
        winRate: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
      },
      settledTrades: [],
      activePositions: [],
    };
  }
  return JSON.parse(fs.readFileSync(TRADES_FILE, "utf-8"));
}

export async function GET() {
  try {
    const data = getTradesData();
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoTitle, type, targetStrike, stake, thesis } = body;

    const data = getTradesData();

    const newPosition = {
      tradeId: `TRD-00${data.settledTrades.length + data.activePositions.length + 1}`,
      videoTitle,
      type: type || "CALL (BUY)",
      targetStrike: Number(targetStrike) || 500,
      currentViews: Number(body.currentViews) || 0,
      stake: Number(stake) || 500,
      targetDate: body.targetDate || "Next 24h",
      status: "OPEN",
      thesis: thesis || "Trading hypothesis based on title & BPM momentum",
    };

    // Deduct stake from current balance
    data.portfolio.currentBalance -= newPosition.stake;
    data.activePositions.unshift(newPosition);

    fs.writeFileSync(TRADES_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, newPosition, portfolio: data.portfolio });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
