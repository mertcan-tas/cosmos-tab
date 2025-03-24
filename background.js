// Listen for extension icon click
chrome.action.onClicked.addListener(() => {
  // Open the options page when the extension icon is clicked
  chrome.runtime.openOptionsPage();
}); 

// Background script içine ekleyin
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchFavicon") {
      fetch(request.url)
          .then(response => response.arrayBuffer())
          .then(buffer => sendResponse(new Uint8Array(buffer)))
          .catch(error => sendResponse({ error: error.message }));
      return true; // Async response için
  }
});