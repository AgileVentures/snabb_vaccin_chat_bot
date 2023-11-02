export function formatConvHistory(messages) {
  return messages
    .map((message) => {
      return `${message.type}: ${message.text}`;
    })
    .join("\n");
}
