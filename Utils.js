export function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export function setLoading(isLoading) {
  // Use 'translate-btn' (lowercase) to match your HTML exactly
  const translateBtn = document.getElementById("translate-btn");
  const userInput = document.getElementById("user-input");
  const outputContainer = document.getElementById("output-container");

  if (!translateBtn) return; // Safety check

  translateBtn.disabled = isLoading;

  if (isLoading) {
    outputContainer.classList.add("hidden");
    outputContainer.classList.remove("visible");
    userInput.style.height = "auto";

    // FIX: Change text on the button itself instead of 'lampText'
    translateBtn.textContent = "Polly is thinking...";
  } else {
    outputContainer.classList.remove("hidden");
    outputContainer.classList.add("visible");

    // FIX: Reset the button text
    translateBtn.textContent = "Translate";
  }
}