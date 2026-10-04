import { NextRequest, NextResponse } from "next/server";
import { setServerStatus, validateWebhookSecret, ServerStatus } from "@/lib/serverStatus";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secretHeader = req.headers.get("x-webhook-secret");
    const token = authHeader || secretHeader;

    if (!validateWebhookSecret(token)) {
      return NextResponse.json({ error: "Unauthorized: Invalid webhook secret token" }, { status: 401 });
    }

    const body = (await req.json()) as Partial<ServerStatus>;

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const updated = await setServerStatus(body);

    return NextResponse.json({
      success: true,
      message: "Server status updated successfully",
      status: updated,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error processing webhook update" },
      { status: 500 }
    );
  }
}
