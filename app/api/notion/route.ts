import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

function cleanSelect(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.replace(/,/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      company,
      industry,
      jobRole,
      useCase,
      expectedVolume,
      cloudEnvironment,
      aiMaturity,
      budgetApproved,
      timeline,
    } = body;

    if (!fullName || !email || !company) {
      return NextResponse.json(
        { error: 'Full name, email, and company are required.' },
        { status: 400 }
      );
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID as string },
      properties: {
        'Full Name': {
          title: [{ text: { content: fullName } }],
        },
        Email: {
          email: email,
        },
        Company: {
          rich_text: [{ text: { content: company } }],
        },
        Industry: {
          select: industry ? { name: cleanSelect(industry) } : null,
        },
        'Job Role': {
          select: jobRole ? { name: cleanSelect(jobRole) } : null,
        },
        'Use Case': {
          rich_text: useCase ? [{ text: { content: useCase } }] : [],
        },
        'Expected Volume': {
          select: expectedVolume ? { name: cleanSelect(expectedVolume) } : null,
        },
        'Cloud Environment': {
          select: cloudEnvironment ? { name: cleanSelect(cloudEnvironment) } : null,
        },
        'AI Maturity': {
          select: aiMaturity ? { name: cleanSelect(aiMaturity) } : null,
        },
        'Budget Approved': {
          select: budgetApproved ? { name: cleanSelect(budgetApproved) } : null,
        },
        Timeline: {
          select: timeline ? { name: cleanSelect(timeline) } : null,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: `Notion error: ${error instanceof Error ? error.message : String(error) || 'Unknown'}` },
      { status: 500 }
    );
  }
}
