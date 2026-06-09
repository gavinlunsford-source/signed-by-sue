import { NextRequest, NextResponse } from 'next/server';

interface PhotoAttachment {
  name: string;
  type: string;
  data: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name, email, phone, eventType, eventDate,
      size, complexity, material, rush,
      estimatedTotal, description, inspirationLinks,
      photos = [] as PhotoAttachment[],
    } = body;

    if (!name || !email || !eventType || !description) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // ── Save to Sanity ────────────────────────────────────────────────────────
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const sanityToken = process.env.SANITY_API_TOKEN;

    if (projectId && sanityToken) {
      try {
        const { createClient } = await import('@sanity/client');
        const writeClient = createClient({
          projectId,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
          apiVersion: '2024-01-01',
          token: sanityToken,
          useCdn: false,
        });

        await writeClient.create({
          _type: 'quoteRequest',
          name, email, phone: phone || null,
          eventType, eventDate: eventDate || null,
          size: size || null, complexity: complexity || null,
          material: material || null, rush: rush || null,
          estimatedTotal: estimatedTotal || null,
          description, inspirationLinks: inspirationLinks || null,
          photoCount: (photos as PhotoAttachment[]).length,
          submittedAt: new Date().toISOString(),
          status: 'new',
        });
      } catch (sanityErr) {
        console.error('Failed to save to Sanity:', sanityErr);
        // Don't block email sending if Sanity fails
      }
    }

    // ── Send emails ───────────────────────────────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL ?? 'halliesue2009@gmail.com';

    if (!apiKey) {
      console.log('📬 Quote request received (Resend not configured):', { name, email, eventType });
      return NextResponse.json({ success: true });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    // Convert base64 photos to Buffers for Resend
    const attachments = (photos as PhotoAttachment[]).map((photo) => ({
      filename: photo.name,
      content: Buffer.from(photo.data.split(',')[1] ?? photo.data, 'base64'),
      content_type: photo.type,
    }));

    const row = (label: string, value: string) =>
      `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EAE3;width:160px;color:#9A8E82;font-size:13px;">${label}</td><td style="padding:10px 0;border-bottom:1px solid #F0EAE3;font-size:15px;">${value}</td></tr>`;

    await resend.emails.send({
      from: 'Signed by Sue <onboarding@resend.dev>',
      to: notificationEmail,
      replyTo: email,
      subject: `New Quote Request — ${eventType} from ${name}`,
      attachments,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#2A2018;">
          <h1 style="font-size:28px;font-weight:300;border-bottom:1px solid #E8E0D8;padding-bottom:16px;">New Quote Request</h1>
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            ${row('Name', name)}
            ${row('Email', `<a href="mailto:${email}" style="color:#B89872;">${email}</a>`)}
            ${phone ? row('Phone', phone) : ''}
            ${row('Event Type', eventType)}
            ${eventDate ? row('Event Date', eventDate) : ''}
            ${size ? row('Size', size) : ''}
            ${complexity ? row('Complexity', complexity) : ''}
            ${material ? row('Material', material) : ''}
            ${rush ? row('Rush', rush) : ''}
          </table>
          <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#9A8E82;margin-top:24px;">Description</h3>
          <p style="font-size:15px;line-height:1.7;background:#F9F6F1;padding:16px;border-radius:8px;margin-top:8px;">${description.replace(/\n/g, '<br>')}</p>
          ${inspirationLinks ? `<h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#9A8E82;margin-top:24px;">Inspiration Links</h3><p style="font-size:15px;line-height:1.7;background:#F9F6F1;padding:16px;border-radius:8px;margin-top:8px;">${inspirationLinks.replace(/\n/g, '<br>')}</p>` : ''}
          ${estimatedTotal ? `
          <div style="margin-top:24px;background:#F9F6F1;border:1px solid #EAD7C8;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;color:#9A8E82;text-transform:uppercase;letter-spacing:0.1em;">Client's Estimated Total</span>
            <span style="font-size:28px;font-family:Georgia,serif;color:#B89872;font-weight:400;">${estimatedTotal}</span>
          </div>` : ''}
          ${attachments.length > 0 ? `<p style="margin-top:16px;font-size:13px;color:#9A8E82;">${attachments.length} inspiration photo${attachments.length > 1 ? 's' : ''} attached above.</p>` : ''}
          <p style="margin-top:32px;font-size:13px;color:#9A8E82;border-top:1px solid #E8E0D8;padding-top:16px;">
            Also saved to your <strong>Quote Requests</strong> inbox in Sanity Studio. Reply to respond to ${name}.
          </p>
        </div>
      `,
    });

    await resend.emails.send({
      from: 'Signed by Sue <onboarding@resend.dev>',
      to: email,
      subject: `Got your request, ${name.split(' ')[0]}! 🌸`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2A2018;">
          <h1 style="font-size:32px;font-weight:300;">Thank you, ${name.split(' ')[0]}!</h1>
          <p style="font-size:16px;line-height:1.8;color:#5C5044;">I received your quote request and I&apos;m so excited to hear about your ${eventType.toLowerCase()}.</p>
          <p style="font-size:16px;line-height:1.8;color:#5C5044;">I&apos;ll be in touch within <strong>24–48 hours</strong> with pricing and availability. Feel free to reply to this email with any questions or additional photos.</p>
          <p style="font-size:16px;line-height:1.8;color:#5C5044;">Thank you for trusting me with your celebration. 🌸</p>
          <p style="margin-top:32px;font-size:16px;color:#2A2018;">Warmly,<br><em style="font-size:20px;">Hallie</em><br><span style="font-size:12px;color:#9A8E82;letter-spacing:0.1em;">SIGNED BY SUE</span></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quote form error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
