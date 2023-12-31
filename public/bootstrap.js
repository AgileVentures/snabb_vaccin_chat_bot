fetch("https://chatbot.snabbvaccin.se/manifest.json")
  .then((response) => response.json())
  .then((manifest) => {
    const mainJs = manifest["index.html"].file;
    const script = document.createElement("script");
    script.src = `https://chatbot.snabbvaccin.se/${mainJs}`;
    document.body.appendChild(script);
  })
  .catch((error) => console.error("Error loading the chatbot:", error));