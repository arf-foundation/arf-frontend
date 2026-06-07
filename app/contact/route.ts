import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  // Here you can send an email (e.g., using Resend, Nodemailer, or a webhook to Slack).
  // For now, just log and return success.
  console.log(`Contact from ${name} (${email}): ${message}`);
  // TODO: integrate with email service.
  return NextResponse.json({ success: true });
}
