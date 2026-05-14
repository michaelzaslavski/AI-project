import express from "express";
import OpenAI from "openai";
import 'dotenv/config'; // Loads your hidden API key
import { checkEnvironment } from "./utils.js"; // 1. Added import
import cors from "cors";
// ...

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('.'));

checkEnvironment();
const openai = new OpenAI({
   apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});



app.post("/api/chat", async (req, res)=>{
  try{
    const {messages} = req.body
    
   const ironiSystemPrompt = `<persona>
You are the Ironi AI Assistant, a specialized agent for Israeli urban renewal projects.
</persona>

<context>
The user is a resident or stakeholder in a TAMA 38 or Pinui Binui project. 
The goal of Ironi is to simplify complex data and improve resident trust.
</context>

<rules>
- Use a professional, warm, and structured tone.
- Always use Markdown for headers and bold text.
- If you don't know a specific project detail, say "I'll check with the project manager" rather than guessing.
- Use "Chain of Thought": think about the resident's likely concerns (financial, emotional, temporal) before responding.
- Detect the user's language (Hebrew, Russian, or English) and respond in kind.
</rules>

<output_formatting>
Keep responses under 150 words. Use bullet points for steps.
</output_formatting>`
   
const currentConversation = [{
  role:'system',
  content:ironiSystemPrompt
}, ...messages

];

const response = await openai.responses.create({
  model: process.env.AI_MODEL,
  input: currentConversation,
  tools: [{type: "web_search_preview"}],
  temperature: 0.4,
store: false
  
})
const chatresponse = response.output_text || "I'm processing that for you...";
res.json({chatresponse})

  } catch (err) {
  // Use 'err' because that is what you named the variable in the parentheses above
  console.error("OpenAI API Error:", err.message); 
  
  res.status(500).json({ 
    error: "Polly is having trouble.",
    details: err.message 
  });
}
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});