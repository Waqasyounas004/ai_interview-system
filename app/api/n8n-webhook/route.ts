import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
      "https://waqasyounas.app.n8n.cloud/webhook/interview-completed";

    console.log("🚀 Server-side forwarding to n8n Webhook:", n8nWebhookUrl);

    const res = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resText = await res.text();
    console.log("✅ n8n response status:", res.status, resText);

    return NextResponse.json({
      success: res.ok,
      status: res.status,
      response: resText,
    });
  } catch (error: any) {
    console.error("❌ Error in /api/n8n-webhook route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to contact n8n" },
      { status: 500 }
    );
  }
}
