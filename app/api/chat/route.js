import { GoogleGenAI } from "@google/genai";
import ListingModel from "Model/ListingModel" // adjust path

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ reply: "Please type something to continue." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- Check MongoDB for location keywords ---
    const locationMatch = message.match(/in (\w+)/i); // very basic example
    let listingsMessage = "";
    if (locationMatch) {
      const location = locationMatch[1];
      const listings = await ListingModel.find({ location: new RegExp(location, "i") });
      if (listings.length === 0) {
        listingsMessage = `Sorry, we don't have any listings in ${location} right now.`;
      } else {
        listingsMessage = `We have ${listings.length} listing(s) in ${location}.`;
      }
    }

    // --- Prepare prompt for Gemini ---
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = "gemini-2.0-flash";

    const userMessage = `
You are an Airbnb chatbot assistant.
- Greet users politely.
- Guide users step by step for login and signup.
- Help users with booking, listings, or general Airbnb questions.
- Always answer clearly and politely.

Listing info: "${listingsMessage}"

User asked: "${message}"
    `;

    const contents = [
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const response = await ai.models.generateContent({ model, contents });

    let reply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn’t understand that.";

    // Clean formatting and limit ~50 words
    reply = reply.replace(/[\*\-\n]+/g, " ").replace(/\s+/g, " ").trim();
    const words = reply.split(" ");
    // if (words.length > 50) {
    //   reply = words.slice(0, 50).join(" ") + "...";
    // }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({ reply: `⚠️ Something went wrong: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
