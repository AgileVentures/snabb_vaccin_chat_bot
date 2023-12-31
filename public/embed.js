(function () {
  var widgetContainer = document.createElement("div");
  widgetContainer.id = "vaccin_bot"; // The ID should match the one in your React app
  document.body.appendChild(widgetContainer);

  var script = document.createElement("script");
  script.src = "https://chatbot.snabbvaccin.se/bootstrap.js"; // Adjust the URL as needed
  script.async = true;
  document.body.appendChild(script);
})();
