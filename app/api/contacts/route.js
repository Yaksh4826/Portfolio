import { NextResponse } from "next/server";


export async function POST(req) {
  try {

    const { name, email, message } = await req.json();

   
    // 2. Send to Discord
    const discordPayload = {
      embeds: [
        {
          title: "🚀 New Portfolio Inquiry",
          color: 0x00ff00, // Green
          fields: [
            { name: "Name", value: name, inline: true },
            { name: "Email", value: email, inline: true },
            { name: "Message", value: message },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    return NextResponse.json({ success: true , message:"Message sent successfully"});
  } catch (error) {
    console.error("Discord Webhook Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}