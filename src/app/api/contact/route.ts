import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
};

function escapeMarkdownV1(value: string) {
  return value.replace(/([_*`\[])/g, "\\$1");
}

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits.startsWith("998") || digits.length < 12) return raw;

  const local = digits.slice(3, 12);
  return `+998 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
}

function resolveAdminIds() {
  const multiAdminIds = (process.env.TELEGRAM_ADMIN_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (multiAdminIds.length > 0) return multiAdminIds;

  const fallbackSingleAdmin = process.env.TELEGRAM_CHAT_ID?.trim();
  return fallbackSingleAdmin ? [fallbackSingleAdmin] : [];
}

async function sendToTelegramAdmin(botToken: string, chatId: string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram request failed with HTTP ${response.status} for chat_id ${chatId}`);
  }

  const result = (await response.json()) as { ok?: boolean; description?: string };
  if (!result.ok) {
    throw new Error(result.description ?? `Telegram API rejected message for chat_id ${chatId}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, service, message } = (await req.json()) as ContactPayload;

    if (!name || !phone || !service) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminIds = resolveAdminIds();

    if (!botToken) {
      return NextResponse.json({ error: "Missing bot token" }, { status: 500 });
    }

    if (adminIds.length === 0) {
      return NextResponse.json({ error: "Missing admin IDs" }, { status: 500 });
    }

    const safeName = escapeMarkdownV1(name.trim());
    const safePhone = escapeMarkdownV1(formatPhone(phone));
    const safeService = escapeMarkdownV1(service.trim());
    const safeMessage = escapeMarkdownV1(message?.trim() || "No message");
    const safeWebsite = escapeMarkdownV1("fazo.uz");
    const safeTime = escapeMarkdownV1(new Date().toLocaleString());

    const text = [
      "🚀 *New FAZO Contact Request*",
      "",
      `👤 Name: ${safeName}`,
      `📞 Phone: ${safePhone}`,
      `🛠 Service: ${safeService}`,
      "",
      "💬 Message:",
      safeMessage,
      "",
      `🌐 Website: ${safeWebsite}`,
      `🕒 Time: ${safeTime}`,
      "📍 Page: Contact Form",
    ].join("\n");

    await Promise.all(adminIds.map((chatId) => sendToTelegramAdmin(botToken, chatId, text)));

    return NextResponse.json({ success: true, recipients: adminIds.length });
  } catch (error) {
    console.error("Telegram multi-admin send failed:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
