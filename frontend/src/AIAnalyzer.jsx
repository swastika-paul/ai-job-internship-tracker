
import { useState } from "react";
import "./AIAnalyzer.css";

function AIAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [userSkills, setUserSkills] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "http://localhost:3000/api/ai/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobDescription,
            userSkills: userSkills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const requiredCount = analysis?.requiredSkills?.length || 0;
  const matchingCount = analysis?.matchingSkills?.length || 0;

  const matchPercentage = requiredCount
    ? Math.round((matchingCount / requiredCount) * 100)
    : 0;

  return (
    <div className="ai-page">
      <div className="ai-heading">
        <span>AI CAREER ASSISTANT</span>
        <h1>Job Description Analyzer ✨</h1>
        <p>
          Understand job requirements, identify skill gaps
          and prepare for interviews with AI.
        </p>
      </div>

      <div className="ai-input-card">
        <label>Job Description</label>

        <textarea
          placeholder="Paste the complete job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={7}
        />

        <label>Your Technical Skills</label>

        <input
          type="text"
          placeholder="Example: JavaScript, React, Node.js, MongoDB"
          value={userSkills}
          onChange={(e) => setUserSkills(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Job Description ✨"}
        </button>

        {error && <p className="ai-error">{error}</p>}
      </div>

      {analysis && (
        <div className="ai-results">

          <div className="ai-match-card">
            <h2>{analysis.jobRole}</h2>
            <p>Your Skill Match</p>

            <div className="match-number">
              {matchPercentage}%
            </div>

            <div className="match-track">
              <div
                className="match-progress"
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
          </div>

          <div className="ai-result-grid">

            <div className="ai-result-card">
              <h3>Required Skills</h3>
              <div className="skill-list">
                {analysis.requiredSkills?.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="ai-result-card">
              <h3>Matching Skills ✓</h3>
              <div className="skill-list matching">
                {analysis.matchingSkills?.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="ai-result-card">
              <h3>Skills to Improve</h3>
              <div className="skill-list missing">
                {analysis.missingSkills?.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="ai-result-card">
              <h3>Learning Recommendations</h3>
              <ul>
                {analysis.recommendations?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

          </div>

          <div className="ai-result-card interview-card">
            <h3>AI Generated Interview Questions</h3>

            {analysis.interviewQuestions?.map((item, index) => (
              <div className="interview-question" key={index}>
                <h4>
                  {index + 1}. {item.question}
                </h4>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default AIAnalyzer;
