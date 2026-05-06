import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, subject, body } = await req.json();

    if (!email || !subject || !body) {
      return NextResponse.json(
        { success: false, error: "Email, subject, and body are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "KhanPDF"}" <${process.env.SMTP_FROM}>`,
      to: email,
      subject,
      text: body,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2>Your converted PDF is ready</h2>
          <p>Hi,</p>
          <p>Your PDF has been converted successfully.</p>
          <p>You can download or open your PDF using the link below:</p>
          <p>
            <a href="${body.match(/https?:\/\/[^\s]+/)?.[0] || "#"}" target="_blank">
              Open your PDF
            </a>
          </p>
          <p>Thank you for using KhanPDF.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[sendemail] error:", err);

    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}