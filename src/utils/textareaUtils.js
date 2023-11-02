export function adjustTextareaHeight(textarea) {
  textarea.style.height = "auto"; // Reset height to auto
  textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
}
