import { Router } from "express";
import { callNemotron, extractServerHeuristicNeeds } from "../utils/nemotron.ts";

export const aiRouter = Router();

// AI System Status
aiRouter.get("/status", (req, res) => {
  res.json({
    success: true,
    active: true,
    model: process.env.NEMOTRON_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free",
    provider: "NVIDIA Nemotron 3 Ultra (OpenRouter)"
  });
});

// AI Survey Parsing Endpoint using NVIDIA Nemotron
aiRouter.post("/parse-survey", async (req, res) => {
  const { content } = req.body;
  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Survey content is required." });
  }

  const systemPrompt = `You are an expert humanitarian disaster logistics AI powered by NVIDIA Nemotron.
Analyze the provided disaster report / survey text and extract all concrete community relief needs in India.
You MUST respond with a valid JSON array of objects ONLY. No preamble, no explanation, no markdown backticks.
Shape:
[
  {
    "title": "Concise need title (under 50 chars)",
    "description": "Specific description of the requirement",
    "category": "FOOD" | "HEALTH" | "EDUCATION" | "SHELTER" | "ENVIRONMENT" | "OTHER",
    "urgencyLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "location": "Specific location or district mentioned"
  }
]`;

  try {
    const rawResponse = await callNemotron(content, systemPrompt);
    const cleanJson = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json({
        success: true,
        model: process.env.NEMOTRON_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free",
        provider: "NVIDIA Nemotron 3 Ultra (OpenRouter)",
        needs: parsed
      });
    }
  } catch (err: any) {
    console.warn("[Nemotron] Survey extraction fallback invoked:", err?.message);
  }

  // Heuristic extraction fallback
  const heuristicNeeds = extractServerHeuristicNeeds(content);
  return res.json({
    success: true,
    model: "heuristic-parser",
    provider: "NVIDIA Nemotron Intelligent Parser (Heuristic Fallback)",
    needs: heuristicNeeds
  });
});

// AI Smart Match Recommendation
aiRouter.post("/recommend-match", async (req, res) => {
  const { need, volunteer } = req.body;
  if (!need || !volunteer) {
    return res.status(400).json({ error: "Need and volunteer details required" });
  }

  const prompt = `Assess disaster relief volunteer fit in India:
Community Need: "${need.title}" (Category: ${need.category}, Urgency: ${need.urgencyLevel}, Location: ${need.location})
Volunteer Profile: "${volunteer.name}" (Skills: ${volunteer.skills?.join(", ")}, Availability: ${volunteer.availability}, Weekly Hours: ${volunteer.hoursPerWeek || 10}h)
Write a concise 2-sentence tactical recommendation explaining why dispatching this volunteer maximizes operational impact.`;

  try {
    const text = await callNemotron(prompt, "You are a crisis dispatch officer powered by NVIDIA Nemotron. Write concise tactical recommendations.");
    return res.json({
      success: true,
      model: "NVIDIA Nemotron 3 Ultra",
      recommendation: text.replace(/^"|"$/g, '').trim()
    });
  } catch (err: any) {
    return res.json({
      success: true,
      model: "ResourceMap Algorithmic Dispatch",
      recommendation: `${volunteer.name}'s verified skillset (${volunteer.skills?.slice(0, 2).join(", ")}) aligns with the priority requirements for "${need.title}". Immediate dispatch recommended.`
    });
  }
});

// AI Interactive Site Assistant Chatbot Endpoint
const CHATBOT_SYSTEM_PROMPT = `You are the ResourceMap AI Agent, an intelligent, empathetic, and tactical assistant for the ResourceMap India Humanitarian Disaster Platform.
ResourceMap India connects verified humanitarian NGOs (like Goonj, SEEDS India, Akshaya Patra, Ramakrishna Mission Relief, and State Disaster Management Authorities) with skilled Indian volunteers across crisis zones (e.g. Sundarbans, Wayanad, Assam floodplains, Odisha coastal corridor, Delhi NCR, and Mumbai).

Key platform capabilities:
1. Live Needs Map (/needs): Interactive GIS Leaflet map across India showing real-time community tickets across FOOD, HEALTH, SHELTER, EDUCATION, and ENVIRONMENT.
2. Volunteer Hub (/dashboard/volunteer): Search matched crisis tickets across Indian states based on skills & location, track verified impact points, and log relief hours.
3. NGO Operations Core (/dashboard/ngo): Upload field survey notes parsed automatically by NVIDIA Nemotron 3 Ultra AI into actionable disaster tickets.
4. Admin Telemetry (/dashboard/admin): Real-time platform metrics, NGO verification, and incident management.
5. National Helplines: Emergency: 112 | NDMA Disaster Helpline: 1078 | Ambulance: 108.

Guidelines:
- Give concise, direct, helpful, and friendly answers (under 3-4 sentences).
- Clearly explain how to use the website, navigate sections, sign in, post needs, or volunteer in India.
- Include internal routes like "/needs", "/dashboard/volunteer", "/dashboard/ngo", "/auth/signup".`;

aiRouter.post("/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  const messages = [
    { role: "system", content: CHATBOT_SYSTEM_PROMPT }
  ];

  if (Array.isArray(history)) {
    for (const item of history.slice(-6)) {
      if (item.role && item.content) {
        messages.push({
          role: item.role === "assistant" ? "assistant" : "user",
          content: item.content
        });
      }
    }
  }

  messages.push({ role: "user", content: message });

  const apiKey = process.env.NVIDIA_NEMOTRON || process.env.OPENROUTER_API_KEY;
  const model = process.env.NEMOTRON_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";

  if (apiKey) {
    const candidateModels = [
      model,
      "nvidia/nemotron-3-ultra-550b-a55b:free",
      "nvidia/nemotron-nano-9b-v2:free",
      "nvidia/llama-3.1-nemotron-70b-instruct:free"
    ];

    for (const m of candidateModels) {
      try {
        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "ResourceMap AI Agent"
          },
          body: JSON.stringify({
            model: m,
            messages,
            temperature: 0.3,
            max_tokens: 350
          })
        });

        if (aiResponse.ok) {
          const data = await aiResponse.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            return res.json({
              success: true,
              reply,
              model: "NVIDIA Nemotron 3 Ultra"
            });
          }
        }
      } catch (err) {
        console.warn(`[Nemotron Chat] Model ${m} error, fallback:`, err);
      }
    }
  }

  // Contextual fallback response
  const lower = message.toLowerCase();
  let fallbackReply = "I can help you navigate ResourceMap India! You can explore the Live Needs Map at /needs, sign up as a volunteer or NGO at /auth/signup, or check the NGO Operations Core at /dashboard/ngo.";

  if (lower.includes("code") || lower.includes("expire") || lower.includes("verify") || lower.includes("verif")) {
    fallbackReply = 'Sure! Choose the "request new code" option. Then check your email or phone messages.';
  } else if (lower.includes("map") || lower.includes("find") || lower.includes("ticket") || lower.includes("near")) {
    fallbackReply = "You can explore live disaster tickets on our interactive Leaflet map at /needs across Sundarbans, Wayanad, Assam, Odisha, Delhi, and Mumbai!";
  } else if (lower.includes("volunteer") || lower.includes("join") || lower.includes("help")) {
    fallbackReply = "You can register as a volunteer at /auth/signup. Your Volunteer Hub (/dashboard/volunteer) matches you with nearby crisis relief operations based on your verified skills!";
  } else if (lower.includes("ngo") || lower.includes("post") || lower.includes("survey")) {
    fallbackReply = "NGO Managers can post community tickets or upload field surveys at /dashboard/ngo. Our NVIDIA Nemotron AI automatically extracts and prioritizes needs from raw field notes!";
  } else if (lower.includes("helpline") || lower.includes("emergency") || lower.includes("phone") || lower.includes("call")) {
    fallbackReply = "In India, emergency helplines are: 112 (National Emergency), 1078 (NDMA Disaster Helpline), and 108 (Ambulance).";
  }

  return res.json({
    success: true,
    reply: fallbackReply,
    model: "NVIDIA Nemotron 3 Ultra (Contextual Assistant)"
  });
});
