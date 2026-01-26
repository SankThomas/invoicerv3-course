import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, subject, message, pdfBase64, invoiceNumber } = body;

    if (!to || !pdfBase64) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "",
      to,
      subject,
      html: message.replace(/\n/g, "<br />"),
      attachments: [
        {
          fileName: `Invoice-${invoiceNumber.invoiceNumber}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email send error", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
