import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, subject, body, fileUrl } = await req.json();

  
if (!email || !subject || !body || !fileUrl) {
  return NextResponse.json(
    { success: false, error: "Email, subject, body, and fileUrl are required." },
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
      <div style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:32px 12px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 35px rgba(17,24,39,0.08);">
                
                <tr>
                  <td style="background:linear-gradient(135deg,#f16625,#ff8a3d);padding:34px 28px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.3;font-weight:800;">
                      Your PDF is Ready 🎉
                    </h1>
                    <p style="margin:10px 0 0;color:#fff4ed;font-size:15px;">
                      Your webpage has been successfully converted into a PDF.
                    </p>
                  </td>
                </tr>
    
                <tr>
                  <td style="padding:34px 30px;">
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#374151;">
                      Hi,
                    </p>
    
                    <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:#374151;">
                      Your converted PDF is now ready. You can open or download it using the button below.
                    </p>
    
                    <div style="text-align:center;margin:30px 0;">
                      <a 
                       href="${fileUrl}" 
                        target="_blank"
  rel="noopener noreferrer"
                        
                        style="display:inline-block;background:#f16625;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:15px 28px;border-radius:12px;box-shadow:0 10px 24px rgba(241,102,37,0.28);"
                      >
                        Open Your PDF
                      </a>
                    </div>
    
                    <div style="background:#fff7f2;border:1px solid #ffd8c2;border-radius:14px;padding:18px 20px;margin:26px 0;">
                      <p style="margin:0;font-size:14px;line-height:1.7;color:#7c2d12;">
                        Need to convert another webpage? KhanPDF helps you turn public URLs into clean PDF files quickly and easily.
                      </p>
                    </div>
    
                    <div style="text-align:center;margin:28px 0 8px;">
                      <a 
                        href="https://khanpdf.com/" 
                        target="_blank"
                        style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 24px;border-radius:10px;"
                      >
                        Visit KhanPDF
                      </a>
                    </div>
    
                    <p style="margin:26px 0 0;font-size:14px;line-height:1.7;color:#6b7280;text-align:center;">
                      Thank you for using <strong style="color:#111827;">KhanPDF</strong>.
                    </p>
                  </td>
                </tr>
    
                <tr>
                  <td style="background:#f9fafb;padding:20px 28px;text-align:center;border-top:1px solid #eef0f4;">
                    <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">
                      Fast URL to PDF conversion, built for simple online use.
                    </p>
                    <a href="https://khanpdf.com/" target="_blank" style="color:#f16625;text-decoration:none;font-size:13px;font-weight:700;">
                      khanpdf.com
                    </a>
                  </td>
                </tr>
    
              </table>
            </td>
          </tr>
        </table>
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