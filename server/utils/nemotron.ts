/**
 * NVIDIA Nemotron 3 Ultra LLM Integration via OpenRouter
 */

export async function callNemotron(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.NVIDIA_NEMOTRON || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NVIDIA_NEMOTRON / OPENROUTER_API_KEY in environment");
  }

  const primaryModel = process.env.NEMOTRON_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
  const candidateModels = [
    primaryModel,
    "nvidia/nemotron-3-ultra-550b-a55b:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "nvidia/llama-3.1-nemotron-70b-instruct:free"
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "ResourceMap India Disaster Relief"
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: systemPrompt || "You are an expert humanitarian disaster response AI powered by NVIDIA Nemotron. Output structured actionable data precisely."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.1
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return text;
        }
      } else {
        const errText = await response.text();
        lastError = new Error(`Model ${model} returned ${response.status}: ${errText}`);
        console.warn(`[Nemotron] ${model} unavailable, trying fallback:`, errText.slice(0, 100));
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("All AI candidate models failed");
}

export function extractServerHeuristicNeeds(content: string) {
  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
  const lower = content.toLowerCase();
  const needs: any[] = [];

  if (lower.includes("food") || lower.includes("ration") || lower.includes("hunger") || lower.includes("water") || lower.includes("drink")) {
    needs.push({
      title: "Emergency Potable Water & Rations Relief",
      description: lines.find(l => /food|ration|water|drink|hunger/i.test(l)) || "Critical distribution of drinking water purification units and survival meal packs.",
      category: "FOOD",
      urgencyLevel: lower.includes("immediate") || lower.includes("flood") || lower.includes("critical") ? "CRITICAL" : "HIGH",
      location: "Sundarbans Flood Sector, West Bengal"
    });
  }

  if (lower.includes("medical") || lower.includes("clinic") || lower.includes("doctor") || lower.includes("health") || lower.includes("injury") || lower.includes("illness")) {
    needs.push({
      title: "Rapid Mobile Health & Triage Unit",
      description: lines.find(l => /medical|clinic|doctor|health|illness/i.test(l)) || "Pediatric triage, rehydration kits, and emergency first aid supplies needed for vulnerable evacuees.",
      category: "HEALTH",
      urgencyLevel: "HIGH",
      location: "District Medical Outpost, Wayanad, Kerala"
    });
  }

  if (lower.includes("shelter") || lower.includes("roof") || lower.includes("tent") || lower.includes("blanket") || lower.includes("displaced")) {
    needs.push({
      title: "Disaster Weatherproofing & Emergency Tents",
      description: lines.find(l => /shelter|roof|tent|blanket/i.test(l)) || "Tarpaulins, high-capacity family tents, and winter blankets for displaced residents.",
      category: "SHELTER",
      urgencyLevel: "HIGH",
      location: "Chamoli Emergency Shelter Base, Uttarakhand"
    });
  }

  if (lower.includes("school") || lower.includes("education") || lower.includes("child") || lower.includes("book")) {
    needs.push({
      title: "Displaced Children Learning & Activity Kits",
      description: lines.find(l => /school|education|child|book/i.test(l)) || "Educational materials, psychological support kits, and volunteer tutors for temporary schools.",
      category: "EDUCATION",
      urgencyLevel: "MEDIUM",
      location: "Morigaon Flood Relief Center, Assam"
    });
  }

  if (needs.length === 0) {
    needs.push({
      title: "General Crisis Resource Deployment",
      description: content.slice(0, 160) || "Urgent multi-sector relief and volunteer dispatch required based on incoming survey.",
      category: "OTHER",
      urgencyLevel: "HIGH",
      location: "National Disaster Relief Hub, India"
    });
  }

  return needs;
}
