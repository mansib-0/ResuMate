import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// Mock database of jobs to search against
const MOCK_JOBS = [
  { id: "1", title: "Senior React Engineer", company: "TechNova", location: "Remote", skills: ["React", "TypeScript", "Node.js"] },
  { id: "2", title: "Backend Developer", company: "DataFlow", location: "New York", skills: ["Python", "Django", "PostgreSQL"] },
  { id: "3", title: "Full Stack Developer", company: "StartupX", location: "San Francisco", skills: ["React", "Node.js", "MongoDB"] },
  { id: "4", title: "Frontend Specialist", company: "WebCorp", location: "London", skills: ["Vue", "JavaScript", "CSS"] },
  { id: "5", title: "Machine Learning Engineer", company: "AI Inc", location: "Remote", skills: ["Python", "TensorFlow", "PyTorch"] },
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('cv') as File;

    if (!file) {
      return NextResponse.json({ error: 'No CV file uploaded.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF text
    let parsedText = "";
    try {
      parsedText = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
      });
    } catch (err) {
      return NextResponse.json({ error: 'Failed to parse PDF. Please ensure it is a valid PDF document.' }, { status: 400 });
    }

    // Extract skills/keywords via AI to search jobs
    let extractedSkills: string[] = [];
    
    if (process.env.GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "Extract a comma-separated list of the top 5 technical skills from the following resume text. ONLY return the comma-separated list, nothing else. Resume: " + parsedText.substring(0, 3000);
      
      const result = await model.generateContent(prompt);
      const skillString = result.response.text();
      extractedSkills = skillString.split(',').map(s => s.trim());
    } else {
      // Mock extraction if no API key
      if (parsedText.toLowerCase().includes('react')) extractedSkills.push("React");
      if (parsedText.toLowerCase().includes('python')) extractedSkills.push("Python");
      if (parsedText.toLowerCase().includes('node')) extractedSkills.push("Node.js");
      if (extractedSkills.length === 0) extractedSkills = ["React", "JavaScript"]; // fallback
    }

    // Simple matching algorithm: Find jobs that have matching skills
    const matchedJobs = MOCK_JOBS.map(job => {
      const matchCount = job.skills.filter(jobSkill => 
        extractedSkills.some(userSkill => userSkill.toLowerCase() === jobSkill.toLowerCase())
      ).length;
      return { ...job, matchScore: Math.round((matchCount / job.skills.length) * 100) };
    })
    .filter(job => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ 
      success: true, 
      extractedSkills, 
      matchedJobs: matchedJobs.length > 0 ? matchedJobs : MOCK_JOBS.slice(0, 3), // Return some jobs even if no match for demo
      parsedTextSnippet: parsedText.substring(0, 200) + "..."
    });

  } catch (error: any) {
    console.error("Scan CV Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
