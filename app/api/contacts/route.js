import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (webhook) {
      const discordPayload = {
        embeds: [
          {
            title: "New portfolio inquiry",
            color: 0x6b4fc8,
            fields: [
              { name: "Name", value: name, inline: true },
              { name: "Email", value: email, inline: true },
              { name: "Message", value: message },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const discordRes = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload),
      });

      if (!discordRes.ok) {
        return NextResponse.json(
          { success: false, message: "Could not deliver message. Try again later." },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact POST error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}