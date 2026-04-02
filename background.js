// Store requests per tab
const tabRequests = new Map();
// Index requests by requestId for quick status updates
const requestIndex = new Map();

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
      timeValue: Date.now(),
      statusCode: null,
      error: null,
      hasError: false
    };

    tabRequests.get(tabId).push(request);

    // Index by requestId for later status updates
    requestIndex.set(details.requestId, request);

    // Keep only last 1000 requests per tab to prevent memory issues
    const requests = tabRequests.get(tabId);
    if (requests.length > 1000) {
      const removed = requests.shift();
      // Clean up index for removed requests (best-effort)
    }
  },
  { urls: ["<all_urls>"] }
);

// Track completed requests — flag HTTP errors (4xx, 5xx)
chrome.webRequest.onCompleted.addListener(
  function(details) {
    const request = requestIndex.get(details.requestId);
    if (request) {
      request.statusCode = details.statusCode;
      if (details.statusCode >= 400) {
        request.hasError = true;
        request.error = `HTTP ${details.statusCode}`;
      }
      requestIndex.delete(details.requestId);
    }
  },
  { urls: ["<all_urls>"] }
);

// Track failed requests — blocked, DNS failures, connection errors, etc.
chrome.webRequest.onErrorOccurred.addListener(
  function(details) {
    const request = requestIndex.get(details.requestId);
    if (request) {
      request.hasError = true;
      request.error = details.error;
      requestIndex.delete(details.requestId);
    }
  },
  { urls: ["<all_urls>"] }
);

// Clear requests when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  // Clean up request index entries for this tab
  const requests = tabRequests.get(tabId);
  if (requests) {
    tabRequests.delete(tabId);
  }
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
