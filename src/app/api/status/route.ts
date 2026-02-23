import { execSync } from "node:child_process";
import { NextResponse } from "next/server";

export async function GET() {
  let openclawVersion = "unknown";
  let nodeVersion = process.version;
  let timestamp = new Date().toISOString();

  try {
    openclawVersion = execSync("openclaw --version", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    // keep unknown
  }

  return NextResponse.json({
    openclawVersion,
    nodeVersion,
    timestamp,
    agentName: "Bernard",
  });
}
