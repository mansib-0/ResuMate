import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export async function POST(req: Request) {
  try {
    const { baseCv, jobDescription } = await req.json();

    if (!baseCv || !jobDescription) {
      return NextResponse.json({ error: 'Missing baseCv or jobDescription' }, { status: 400 });
    }

    // If no real API key is present, return mock data for the demo
    if (!process.env.OPENAI_API_KEY) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        tailoredCv: `[DEMO MODE: No OpenAI API Key found]\n\nTailored Resume:\n\n${baseCv}\n\n---\n* Added keywords from job description: scalability, React, microservices.\n* Re-phrased bullet points to highlight leadership and cloud deployment.`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. Your task is to rewrite the provided base CV to perfectly match the provided Job Description. Optimize bullet points to include relevant keywords, emphasize matching skills, and ensure a professional tone. Return ONLY the tailored CV text."
        },
        {
          role: "user",
          content: `JOB DESCRIPTION:\n${jobDescription}\n\nBASE CV:\n${baseCv}`
        }
      ],
      temperature: 0.7,
    });

    const tailoredCv = response.choices[0].message?.content || "No content generated.";

    return NextResponse.json({ tailoredCv });

  } catch (error: any) {
    console.error("Error in /api/tailor:", error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
