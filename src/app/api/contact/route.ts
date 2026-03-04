import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, service, message } = await req.json();
    if (!name || !phone || !service || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const text = `🚀 *New FAZO inquiry*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n🔧 *Service:* ${service}\n💬 *Message:* ${message}`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
