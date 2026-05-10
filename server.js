import express from "express";
import OpenAI from "openai";
import 'dotenv/config'; // Loads your hidden API key
import { checkEnvironment } from "./utils.js"; // 1. Added import

const app = express();
app.use(express.json());

checkEnvironment();
const openai = new OpenAI({
   apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});


app.post("/api/translate", async (req, res)=>{
  try{
    const {text,language} = req.body
    
   
   
const input = [{
  role:'system',
  content:`You are a professional polyglot translator named Polly. 
        Translate the user's text accurately into ${language}. 
        Output ONLY the translated text. Do not provide any context, 
        introductions, or conversational filler.`
},
{
  role:"user",
  content: `Translate this: "${text}"`
}];

const response = await openai.responses.create({
  model: process.env.AI_MODEL,
  input,
  temperature: 0.3,
  max_tokens: 500,
  store: true
  
})
const translation = response.output_text;
res.json({translation})

  }catch(e){
    console.e("OpenAI API Error:", error);
    res.status(500).json({ error: "The Gift Genie hit a snag. Please try again." });
    
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});