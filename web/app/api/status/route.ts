import { NextResponse } from "next/server";
import { getServerStatus } from "@/lib/serverStatus";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const status = await getServerStatus();
    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Failed to retrieve server status:", error);
    return NextResponse.json(
      { error: "Failed to retrieve server status" },
      { status: 500 }
    );
  }
}
