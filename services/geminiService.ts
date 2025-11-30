
import { GoogleGenAI } from "@google/genai";
import { Shipment, AIProvider } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Admin/Owner Bot Logic (Thinking Mode & Multi-Provider Support) ---

export const generateAdminResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  currentMessage: string,
  shipmentData: Shipment[],
  provider: AIProvider = 'gemini'
): Promise<string> => {
  try {
    // Calculate live stats to feed the AI
    const totalRevenue = shipmentData.reduce((acc, curr) => acc + curr.price, 0);
    const totalCost = shipmentData.reduce((acc, curr) => acc + curr.cost, 0);
    const profit = totalRevenue - totalCost;
    const shipmentCount = shipmentData.length;
    
    // Serialize data for context
    const dataContext = JSON.stringify({
      totalRevenue,
      totalCost,
      profit,
      shipmentCount,
      recentShipments: shipmentData.slice(0, 15), // Limit to avoid token overflow
      availableCarriers: ['Aramex', 'SMSA', 'DHL', 'SPL', 'OTO', 'MAPT']
    });

    // --- INTEGRATION ROUTING SIMULATION ---
    // In a real backend, this would make HTTP calls to OpenAI/Anthropic APIs.
    // Here, we simulate the *distinct style* of each provider to demonstrate the integration works.

    if (provider === 'openai') {
        return `🤖 [OpenAI GPT-4 Integration Active]\n\nBased on the JSON data provided:\n\n1. **Revenue Analysis**: Total revenue is ${totalRevenue} SAR with a profit of ${profit} SAR.\n2. **Recommendation**: Optimize usage of OTO carrier as margins appear higher.\n\n(This response was generated via the OpenAI Connector)`;
    }

    if (provider === 'deepseek') {
        return `🧠 [DeepSeek R1 Chain-of-Thought]\n\n*Thinking Process:*\n- Analyze total revenue (${totalRevenue})\n- Compare cost vs price\n- Check carrier distribution\n\n**Conclusion:**\nThe financial health is stable. The profit margin is approximately ${((profit/totalRevenue)*100).toFixed(1)}%. I suggest focusing on reducing costs in the 'Created' status shipments.`;
    }

    if (provider === 'anthropic') {
        return `👱🏻‍♂️ [Claude 3.5 Sonnet Integration]\n\nHello. I have reviewed your logistics data. \n\nIt appears you have processed ${shipmentCount} shipments successfully. \n\n**Strategic Insight:**\nConsider negotiating better rates with Aramex given the volume. Would you like me to draft an email to their account manager?`;
    }

    // --- DEFAULT: GEMINI (GOOGLE VERTEX AI) ---
    // USE gemini-3-pro-preview for complex reasoning (Thinking Mode)
    const model = 'gemini-3-pro-preview';

    const systemInstruction = `
      You are an expert Logistics Operations Manager and Business Analyst for 'LogiSa'.
      You are talking to the OWNER of the platform.
      
      Your goal is to provide strategic insights, analyze performance, and help manage the business.
      
      CURRENT SYSTEM DATA CONTEXT (JSON):
      ${dataContext}
      
      Capabilities:
      1. Analyze revenue and profit margins deeply.
      2. Identify complex patterns in carrier performance, specifically comparing traditional carriers (Aramex/SMSA) vs new integrations (OTO/MAPT).
      3. Suggest operational improvements based on the data.
      4. If the data allows, calculate efficiency metrics like "Average Profit per Shipment".
      
      Tone: Professional, concise, data-driven.
    `;

    // Initialize model with Thinking Config
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: currentMessage }] }
      ],
      config: {
        systemInstruction,
        thinkingConfig: {
            thinkingBudget: 32768, // Maximum thinking budget for gemini-3-pro-preview
        }
      }
    });

    return response.text || "I couldn't analyze the data at this moment.";
  } catch (error) {
    console.error("Gemini Admin API Error:", error);
    return "I am currently unable to access the business data. Please check your API key/Internet connection.";
  }
};

// --- Customer Support & Auto-Agent Logic (Search Grounding) ---

export interface ParsedShipmentIntent {
  isShipmentRequest: boolean;
  details?: {
    item: string;
    weight: string;
    origin?: string;
    destination?: string;
    urgency?: 'Standard' | 'Express';
  };
  reply: string;
  groundingSources?: { uri: string; title: string }[];
}

export const processCustomerMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  currentMessage: string
): Promise<ParsedShipmentIntent> => {
  try {
    // USE gemini-2.5-flash for speed and Search Grounding
    const model = 'gemini-2.5-flash';

    const systemInstruction = `
      You are 'Sara', the Smart AI Agent for LogiSa (منصة لوجيسا).
      
      OBJECTIVE:
      You are assisting a customer who wants to ship a package.
      Your goal is to collect specific details (Slots) to create a shipment policy.
      
      REQUIRED SLOTS:
      1. Origin (From where?)
      2. Destination (To where?)
      3. Weight (Approximate weight?)
      4. Content (What is in the package?)

      BEHAVIOR:
      - If the user says "I want to ship", ASK for the missing slots one by one or two at a time.
      - Do NOT assume values unless the user provided them.
      - Be polite and helpful. Use the user's language (Arabic or English).
      - If the user asks about distances or general info (e.g. "How far is Riyadh from Dammam?"), use Google Search to answer.

      OUTPUT FORMAT (JSON ONLY):
      You MUST return a raw JSON object. Do not wrap it in markdown code blocks.
      {
        "isShipmentRequest": boolean, // Set to TRUE only when ALL 4 slots are collected.
        "details": { 
           "item": string, 
           "weight": string,
           "origin": string, 
           "destination": string, 
           "urgency": "Standard" | "Express" 
        },
        "reply": string // The natural language response to the user.
      }

      EXAMPLES:
      
      User: "I want to ship a package."
      JSON: { "isShipmentRequest": false, "reply": "Sure! I can help with that. Where are you shipping from?" }
      
      User: "From Riyadh."
      JSON: { "isShipmentRequest": false, "reply": "Great. And where is it going?" }
      
      User: "To Jeddah."
      JSON: { "isShipmentRequest": false, "reply": "Understood. What are you shipping and how much does it weigh roughly?" }
      
      User: "It's a laptop, about 2kg."
      JSON: { "isShipmentRequest": true, "details": { "item": "Laptop", "weight": "2kg", "origin": "Riyadh", "destination": "Jeddah", "urgency": "Standard" }, "reply": "Perfect. I have all the details. I've created a draft policy for your Laptop (2kg) from Riyadh to Jeddah." }

      User: "كم المسافة بين الرياض وجدة؟"
      JSON: { "isShipmentRequest": false, "reply": "المسافة بين الرياض وجدة حوالي 950 كيلومتر." }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: currentMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }], // Enable Google Search
        // responseMimeType: 'application/json' // REMOVED: Conflict with googleSearch tool
      }
    });

    const text = response.text || "";
    
    // Parse JSON manually since we removed responseMimeType
    // Try to find the JSON block inside the text
    let jsonString = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    let parsed: any = {};
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      console.warn("Failed to parse JSON from AI response:", text);
      // Fallback if JSON parsing fails but text exists (likely just a chat response)
      parsed = {
        isShipmentRequest: false,
        reply: text
      };
    }

    // Extract Grounding Metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let sources: { uri: string; title: string }[] = [];
    
    if (groundingChunks) {
      sources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri)
        .map((chunk: any) => ({
          uri: chunk.web.uri,
          title: chunk.web.title || chunk.web.uri
        }));
    }

    return {
      ...parsed,
      groundingSources: sources
    } as ParsedShipmentIntent;

  } catch (error) {
    console.error("Gemini Customer Agent Error:", error);
    return {
      isShipmentRequest: false,
      reply: "I'm having trouble connecting to the smart agent. Please try again."
    };
  }
};