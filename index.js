import { marked } from "marked";
import DOMPurify from "dompurify";
import { autoResizeTextarea, setLoading } from "./utils.js";

const translatorForm = document.getElementById('translator-form');
const userInput = document.getElementById("user-input");
const languagePicker = document.getElementById("language-picker");
const outputContent = document.getElementById("output-content");

function start() {
    userInput.addEventListener("input", () => autoResizeTextarea(userInput));
    // FIX: Pass the function name directly so it gets the event 'e'
    translatorForm.addEventListener("submit", handleTranslationRequest);
}

async function handleTranslationRequest(e) {
    e.preventDefault(); // Stop page refresh
    
    const text = userInput.value.trim();
    const language = languagePicker.value; 
    
    if (!text) return;
    
    setLoading(true);
    try {
        const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, language })
        });

        const data = await response.json();
        const translation = data.translation;
        
        // FIX: marked.parse, not .purse
        const html = marked.parse(translation);
        const safeHtml = DOMPurify.sanitize(html);
        
        outputContent.innerHTML = safeHtml;
        
    } catch (err) {
        console.error(err); // Match the variable in catch(err)
        outputContent.textContent = "Sorry, Polly is having trouble right now.";
    } finally {
        setLoading(false);
    }
}

start();