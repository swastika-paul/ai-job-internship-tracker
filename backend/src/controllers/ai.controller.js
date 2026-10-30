
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeJobDescription = async (req, res) => {
  try {
    const { jobDescription, userSkills } = req.body;

    // Check whether job description is provided
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Please provide a job description",
      });
    }

    if (jobDescription.length > 12000) {
      return res.status(400).json({
        message: "Job description is too long",
      });
    }

    const skills = Array.isArray(userSkills)
      ? userSkills.join(", ")
      : "Not provided";

    const prompt = `
You are an expert career assistant.

Analyze the following job description.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SKILLS:
${skills}

Return ONLY valid JSON in this exact structure:

{
  "jobRole": "Identified job role",
  "requiredSkills": ["skill 1", "skill 2"],
  "matchingSkills": ["skill the candidate has"],
  "missingSkills": ["skill the candidate should learn"],
  "recommendations": ["learning recommendation"],
  "interviewQuestions": [
    {
      "question": "Interview question",
      "answer": "Short suggested answer"
    }
  ]
}

Rules:
- Do not invent candidate skills.
- Compare the candidate skills only with the job requirements.
- If candidate skills are not provided, say so.
- Give 5 relevant interview questions.
- Keep recommendations practical.
`;

 let response;
let attempts = 3;

for (let i = 0; i < attempts; i++) {
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    break;
  } catch (error) {
    console.error(`Gemini attempt ${i + 1} failed:`, error.status);

    if (i === attempts - 1) {
      throw error;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1500 * (i + 1))
    );
  }
}

    const result = JSON.parse(response.text);

    return res.status(200).json({
      message: "Job description analyzed successfully",
      analysis: result,
    });

  } catch (error) {
  console.error("AI analysis error:", error);

  if (error.status === 503 || error.status === 429) {
    return res.status(503).json({
      message: "AI service is temporarily busy. Please try again shortly."
    });
  }

  return res.status(500).json({
    message: "Unable to analyze job description. Please try again."
  });
}
};
