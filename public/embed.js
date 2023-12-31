// embed.js
window.mountChatbot = function(selector) {
  // Wait for the DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Find the container using the selector provided
    var container = document.querySelector(selector);
    
    if (container) {
      // Clear existing content of the container
      container.innerHTML = '';
      
      // Create the div element for the chatbot
      var widgetContainer = document.createElement('div');
      widgetContainer.id = 'vaccin_bot'; // The ID should match the one in your React app
      
      // Append the div to the specified container
      container.appendChild(widgetContainer);
      
      // Load the chatbot script using bootstrap.js
      var script = document.createElement('script');
      script.src = 'https://chatbot.snabbvaccin.se/bootstrap.js'; // The URL to your bootstrap script
      script.async = true;
      document.body.appendChild(script);
    } else {
      console.error('The specified container was not found in the DOM.');
    }
  });
};

// Example usage:
// mountChatbot('.book-cta');

