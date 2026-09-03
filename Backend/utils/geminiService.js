import { GoogleGenAI } from '@google/genai';

/**
 * Generate Structured Gemini AI Business Insights from calculated metrics.
 * NEVER sends raw dataset; only structured calculated numerical metrics.
 * Uses Indian Rupee (₹) and simple business owner language.
 */
export async function generateBusinessInsights(structuredPayload) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  // Deterministic local fallback if no API key is provided
  if (!apiKey || apiKey.trim() === '') {
    return buildLocalFallbackInsights(structuredPayload);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a friendly, simple business advisor explaining business performance to a normal business owner.
Convert the following calculated numerical metrics into structured, simple business insights.

RULES:
1. Do NOT invent or hallucinate any numbers, percentages, or metrics. Use ONLY the provided numbers.
2. Use Indian Rupee (₹) formatting for all monetary amounts (e.g., ₹17,40,934, ₹1,00,000, ₹10,000).
3. Use simple, everyday English. Avoid technical jargon like "Z-Score", "Regression", "Feature Importance", "Operational Optimization", "Strategic Intervention", "Sales Motion".
4. Return ONLY a valid JSON object strictly matching this schema:
{
  "summary": "Simple overall business status summary",
  "businessHealthExplanation": "Explanation of health score in simple words",
  "keyFindings": ["Finding 1", "Finding 2"],
  "risks": ["Risk 1", "Risk 2"],
  "recommendations": [
    {
      "code": "REC-01",
      "title": "Simple Title (e.g. Improve Top Item Sales)",
      "problem": "What we found",
      "evidence": "Numerical evidence in ₹",
      "recommendedAction": "Simple actionable advice",
      "priority": "HIGH",
      "upside": "Estimated benefit in ₹",
      "category": "REVENUE_GROWTH",
      "status": "ACTIVE"
    }
  ],
  "priorityActions": [
    {
      "title": "Simple Action Title",
      "problem": "What we found",
      "evidence": "Numerical evidence in ₹",
      "recommendedAction": "Simple action step",
      "priority": "HIGH",
      "status": "PENDING",
      "dueDate": "Next 14 Days"
    }
  ]
}

DATA PAYLOAD:
${JSON.stringify(structuredPayload, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error('Gemini API call failed, using deterministic local engine fallback:', error.message);
    return buildLocalFallbackInsights(structuredPayload);
  }
}

function buildLocalFallbackInsights(payload) {
  const healthScore = payload.summary?.healthScore || 70;
  const monthlyRevenue = payload.summary?.monthlyRevenue || 0;
  const profitMargin = payload.summary?.profitMargin || '0%';
  const revFormatted = '₹' + Math.round(monthlyRevenue).toLocaleString('en-IN');

  return {
    summary: `We analyzed ${payload.profile?.totalRows || 'your uploaded'} records. Your business health score is ${healthScore} out of 100 with total revenue of ${revFormatted} and profit margin of ${profitMargin}.`,
    businessHealthExplanation: `Your business is operating at a health score of ${healthScore} out of 100.`,
    keyFindings: payload.summary?.positiveFactors || ['Sales trajectory is stable across recent periods.', 'Your data quality is good.'],
    risks: payload.summary?.negativeFactors || ['Profit margins have room for improvement.'],
    recommendations: payload.recommendations || [],
    priorityActions: (payload.recommendations || []).map(r => ({
      title: r.title,
      problem: r.problem,
      evidence: r.evidence,
      recommendedAction: r.recommendedAction,
      priority: r.priority || 'HIGH',
      status: 'PENDING',
      dueDate: 'Next 14 Days'
    }))
  };
}
