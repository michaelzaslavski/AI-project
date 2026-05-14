/**
 * 1. The Guard: Ensures your .env secrets are loaded
 */
export function checkEnvironment() {
  const required = ["AI_KEY", "AI_URL", "AI_MODEL"];
  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Critical Error: Missing ${key} in your .env file!`);
    }
  });
  console.log("✅ Environment check passed. Polly is ready for takeoff.");
}

/**
 * 2. The Stylist: Makes the textarea grow with the text
 */
export function autoResizeTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

/**
 * 3. The Communicator: Handles the UI loading states
 */
export function setLoading(isLoading) {
  const translateBtn = document.getElementById("translate-btn");
  const outputContent = document.getElementById("output-content");

  if (!translateBtn) return;

  translateBtn.disabled = isLoading;

  if (isLoading) {
    translateBtn.textContent = "Polly is thinking...";
    translateBtn.classList.add("loading");
    // Optionally clear previous output
    if (outputContent) outputContent.innerHTML = ""; 
  } else {
    translateBtn.textContent = "Translate";
    translateBtn.classList.remove("loading");
  }
}