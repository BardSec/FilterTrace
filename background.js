// Store requests per tab
const tabRequests = new Map();

// Listen to all web requests
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const tabId = details.tabId;
    
    // Ignore requests from the extension itself and background tabs
    if (tabId === -1) return;
    
    // Initialize tab storage if needed
    if (!tabRequests.has(tabId)) {
      tabRequests.set(tabId, []);
    }
    
    // Store request info
    const request = {
      url: details.url,
      type: details.type,
      method: details.method,
      timestamp: new Date().toISOString(),
      timeValue: Date.now()
    };
    
    tabRequests.get(tabId).push(request);
    
    // Keep only last 1000 requests per tab to prevent memory issues
    const requests = tabRequests.get(tabId);
    if (requests.length > 1000) {
      requests.shift();
    }
  },
  { urls: ["<all_urls>"] }
);

// Clear requests when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabRequests.delete(tabId);
});

// Clear requests when tab navigates to new page
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading' && changeInfo.url) {
    tabRequests.delete(tabId);
  }
});

// Message handler for popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRequests') {
    const requests = tabRequests.get(request.tabId) || [];
    sendResponse({ requests: requests });
  } else if (request.action === 'clearRequests') {
    tabRequests.delete(request.tabId);
    sendResponse({ success: true });
  }
  return true;
});
