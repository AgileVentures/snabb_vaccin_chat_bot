// bootstrap.js
fetch("https://chatbot.snabbvaccin.se/manifest.json")
  .then((response) => response.json())
  .then((manifest) => {
    // Extract the CSS file path from the manifest
    const cssPath = manifest["index.css"].file;

    // Create a link tag for the CSS and append it to the head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://chatbot.snabbvaccin.se/${cssPath}`;
    document.head.appendChild(link);

    // Extract the JS file path from the manifest
    const mainJs = manifest["index.html"].file;

    // Create a script tag for the JS and append it to the body
    const script = document.createElement('script');
    script.type = 'module'; // Use module if your script uses ES6 imports/exports
    script.src = `https://chatbot.snabbvaccin.se/${mainJs}`;
    document.body.appendChild(script);
  })
  .catch((error) => console.error("Error loading the chatbot:", error));
