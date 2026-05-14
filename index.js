import { marked } from "marked";
import DOMPurify from "dompurify";
import { autoResizeTextarea, setLoading } from "./utils.js";

// 1. SELECTING NEW CHAT ELEMENTS
const chatForm = document.getElementById('chat-form');
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById("user-input");

// 2. STATE: This is the "Memory" of your conversation
let conversationHistory = [];

function start() {
    userInput.addEventListener("input", () => autoResizeTextarea(userInput));
    chatForm.addEventListener("submit", handleChatRequest);
}

/**
 * Helper to create and append a message bubble to the UI
 */
function appendMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(role === 'user' ? 'user-message' : 'assistant-message');
    
    // Parse Markdown for the AI, plain text for the user
    const content = role === 'assistant' ? marked.parse(text) : text;
    messageDiv.innerHTML = DOMPurify.sanitize(content);
    
    chatWindow.appendChild(messageDiv);
    
    // Auto-scroll to the bottom so the new message is visible
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function handleChatRequest(e) {
    e.preventDefault();
    
    const text = userInput.value.trim();
    if (!text) return;

    // A. Add User message to Memory and UI
    conversationHistory.push({ role: "user", content: text });
    appendMessage('user', text);
    
    // B. Clear input immediately for a "snappy" feel
    userInput.value = "";
    autoResizeTextarea(userInput);
    setLoading(true);

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // C. Send the WHOLE history to the server
            body: JSON.stringify({ messages: conversationHistory }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || "Server error");
        }

        const data = await response.json();
        const chatresponse = data.chatresponse;
        
        if (chatresponse) {
            // D. Add AI message to Memory and UI
            conversationHistory.push({ role: "assistant", content: chatresponse });
            appendMessage('assistant', chatresponse);
        }
        
    } catch (err) {
        console.error(err);
        appendMessage('assistant', "⚠️ Sorry, Ironi is having trouble connecting. Please try again.");
    } finally {
        setLoading(false);
    }
}

start();