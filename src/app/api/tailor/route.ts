import { NextResponse } from 'next/server';

const MOCK_RESUME = `JANE DOE
Senior Software Engineer | jane.doe@email.com | linkedin.com/in/janedoe

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience building scalable web applications. Proven track record of delivering high-quality solutions using React, Node.js, and cloud technologies. Passionate about clean code, performance optimization, and collaborative agile development.

SKILLS
• Frontend: React, TypeScript, Next.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, REST APIs, GraphQL
• Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, CI/CD, GitHub Actions
• Databases: PostgreSQL, MongoDB, Redis

PROFESSIONAL EXPERIENCE

Senior Frontend Engineer — TechNova Inc. (Remote)
Jan 2022 – Present
• Architected and delivered scalable React/TypeScript SPA, reducing load time by 40% through code splitting and lazy loading
• Led migration from legacy codebase to Next.js 14 with SSR, improving SEO performance by 60%
• Collaborated with cross-functional Agile teams of 8 engineers across product, design, and QA
• Designed RESTful API integrations with microservices architecture on AWS, handling 2M+ monthly requests
• Mentored 3 junior engineers through code reviews and weekly 1:1 sessions

Software Engineer — DataFlow Corp. (New York, NY)
Jun 2019 – Dec 2021
• Built full-stack features using Node.js (Express) backend and React frontend, shipping 12 major features
• Implemented PostgreSQL database schemas and optimized slow queries, improving response time by 35%
• Set up Docker containers and CI/CD pipelines with GitHub Actions for automated testing and deployment
• Participated in 2-week sprint cycles with daily standups and sprint retrospectives

EDUCATION
B.Sc. Computer Science — State University (2019) | GPA: 3.8/4.0

CERTIFICATIONS
• AWS Solutions Architect Associate (2023)
• Google Professional Cloud Developer (2022)
`;

export async function POST(req: Request) {
  try {
    const { baseCv, jobDescription, targetCompany, jobTitle } = await req.json();

    if (!baseCv || !jobDescription) {
      return NextResponse.json({ error: 'baseCv and jobDescription are required.' }, { status: 400 });
    }

    const hasGemini = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('dummy');

    if (!hasGemini) {
      const mock = `[TAILORED RESUME — Demo Mode]
Target Role: ${jobTitle || 'Software Engineer'} @ ${targetCompany || 'Target Company'}

${MOCK_RESUME}

---
[ATS NOTE] Keywords injected from job description: scalability, React, microservices, CI/CD, Agile.
Bullet points rephrased to emphasize quantifiable achievements and leadership.`;
      return NextResponse.json({ tailoredResume: mock });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are an expert ATS optimization specialist and career coach.
Your task: Tailor the provided "Original Resume" to perfectly match the "Job Description" for the role of "${jobTitle}" at "${targetCompany}".
Rules:
1. Do NOT invent new experience or skills the candidate does not have.
2. Rephrase existing bullet points to highlight relevant skills from the job description.
3. Add relevant keywords from the job description naturally throughout.
4. Keep the same overall format but optimize for ATS systems.
5. Output ONLY the tailored resume text with no preamble.

Target Company: ${targetCompany}
Job Title: ${jobTitle}

Job Description:
${jobDescription}

Original Resume:
${baseCv}`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ tailoredResume: result.response.text() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('Tailor error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
