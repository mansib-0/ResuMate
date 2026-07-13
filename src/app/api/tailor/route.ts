import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

export async function POST(req: Request) {
  try {
    const { baseCv, jobDescription, targetCompany, jobTitle } = await req.json();

    if (!baseCv || !jobDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("dummy")) {
      // Fallback for Demo
      const mockResult = `[DEMO MODE: No GEMINI API Key found]\n\nTailored Resume:\n\nJohn Doe\nSoftware Developer\n\nExperience:\nWeb Developer at TechSolutions (2021 - Present)\n- Built web pages using HTML, CSS, and JavaScript.\n- Used React to make a dashboard for clients.\n- Made the website faster so it loads quicker.\n- Worked with designers to make the site look good.\n\nJunior Dev at StartUp Inc (2019 - 2021)\n- Fixed bugs on the front end.\n- Used TypeScript on some projects.\n\n---\n* Added keywords from job description: scalability, React, microservices.\n* Re-phrased bullet points to highlight leadership and cloud deployment.`;
      
      return NextResponse.json({ tailoredResume: mockResult });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert technical recruiter and ATS optimization tool.
      Take the provided 'Original Resume' and tailor its bullet points to specifically match the 'Job Description' for the role of '${jobTitle}' at '${targetCompany}'.
      Do not invent new experience, but rephrase existing points to highlight relevant skills and include keywords from the job description.
      Output ONLY the tailored resume text.
      
      Company: ${targetCompany}
      Job Title: ${jobTitle}
      
      Job Description:
      ${jobDescription}
      
      Original Resume:
      ${baseCv}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ tailoredResume: responseText });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
