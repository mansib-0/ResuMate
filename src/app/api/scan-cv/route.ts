import { NextResponse } from 'next/server';

const MOCK_JOBS = [
  { id: "1", title: "Senior React Engineer", company: "TechNova", location: "Remote", skills: ["React", "TypeScript", "Node.js", "AWS"] },
  { id: "2", title: "Backend Developer", company: "DataFlow", location: "New York, NY", skills: ["Python", "Django", "PostgreSQL", "Docker"] },
  { id: "3", title: "Full Stack Developer", company: "StartupX", location: "San Francisco, CA", skills: ["React", "Node.js", "MongoDB", "JavaScript"] },
  { id: "4", title: "Frontend Specialist", company: "WebCorp", location: "London, UK", skills: ["Vue", "JavaScript", "CSS", "HTML"] },
  { id: "5", title: "ML Engineer", company: "AI Inc", location: "Remote", skills: ["Python", "TensorFlow", "PyTorch", "SQL"] },
  { id: "6", title: "DevOps Engineer", company: "CloudBase", location: "Austin, TX", skills: ["AWS", "Docker", "Kubernetes", "CI/CD"] },
  { id: "7", title: "TypeScript Developer", company: "CodeCraft", location: "Remote", skills: ["TypeScript", "React", "Node.js", "GraphQL"] },
];

const SKILL_KEYWORDS = [
  "React", "Python", "Java", "Node.js", "TypeScript", "CSS", "HTML", "JavaScript",
  "SQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Django", "Vue", "Angular",
  "GraphQL", "REST", "PostgreSQL", "Redis", "TensorFlow", "PyTorch", "Swift", "Kotlin",
];

async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFParser = require("pdf2json");
    const parser = new PDFParser(null, true);
    parser.on("pdfParser_dataError", (e: { parserError: Error }) => reject(e.parserError));
    parser.on("pdfParser_dataReady", () => resolve(parser.getRawTextContent()));
    parser.parseBuffer(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("cv") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No CV file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let parsedText = "";
    try {
      parsedText = await parsePDF(buffer);
    } catch {
      return NextResponse.json({ error: "Failed to parse PDF. Please upload a valid PDF." }, { status: 400 });
    }

    const lowerText = parsedText.toLowerCase();
    let extractedSkills: string[] = [];

    const hasGemini = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("dummy");

    if (hasGemini) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const result = await model.generateContent(
          "Extract exactly the top 5 technical skills from this resume. Return ONLY a comma-separated list, nothing else.\n\n" +
          parsedText.substring(0, 3000)
        );
        extractedSkills = result.response.text().split(",").map((s: string) => s.trim()).filter(Boolean).slice(0, 5);
      } catch {
        // Fall back to keyword matching
      }
    }

    if (extractedSkills.length === 0) {
      extractedSkills = SKILL_KEYWORDS.filter(skill => lowerText.includes(skill.toLowerCase()));
      if (extractedSkills.length === 0) extractedSkills = ["React", "JavaScript", "Node.js"];
      extractedSkills = extractedSkills.slice(0, 8);
    }

    const matchedJobs = MOCK_JOBS.map(job => {
      const matchCount = job.skills.filter(js =>
        extractedSkills.some(us => us.toLowerCase() === js.toLowerCase())
      ).length;
      const matchScore = Math.round((matchCount / job.skills.length) * 100);
      return { ...job, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

    // Always return at least 3 jobs
    const topJobs = matchedJobs.some(j => j.matchScore > 0)
      ? matchedJobs.filter(j => j.matchScore > 0)
      : MOCK_JOBS.slice(0, 3).map(j => ({ ...j, matchScore: 50 }));

    const finalJobs = topJobs.length >= 3 ? topJobs : [...topJobs, ...MOCK_JOBS.slice(0, 3 - topJobs.length).map(j => ({ ...j, matchScore: 30 }))];

    return NextResponse.json({ success: true, extractedSkills, matchedJobs: finalJobs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Scan CV error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
