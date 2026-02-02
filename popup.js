let allRequests = [];
let currentFilter = 'all';
let searchTerm = '';
let currentTabId = null;

// Dark mode toggle
function initDarkMode() {
  const darkModeBtn = document.getElementById('darkModeBtn');
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeBtn.textContent = '☀️';
  }
  
  darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeBtn.textContent = isDark ? '☀️' : '🌙';
  });
}

// Get current tab and load requests
async function loadRequests() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTabId = tab.id;
  
  const url = new URL(tab.url);
  document.getElementById('domain').textContent = url.hostname;
  
  // Get requests from background script
  chrome.runtime.sendMessage(
    { action: 'getRequests', tabId: tab.id },
    (response) => {
      allRequests = response.requests || [];
      updateDisplay();
    }
  );
}

// Update the display based on filters
function updateDisplay() {
  const container = document.getElementById('requestsContainer');
  
  // Filter requests
  let filtered = allRequests;
  
  // Apply type filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(req => req.type.toLowerCase() === currentFilter);
  }
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(req => 
      req.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Update stats
  document.getElementById('totalCount').textContent = allRequests.length;
  document.getElementById('filteredCount').textContent = filtered.length;
  
  // Display requests
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div>No requests match your filters</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  filtered.forEach(request => {
    const item = createRequestItem(request);
    container.appendChild(item);
  });
}

// Create request item element
function createRequestItem(request) {
  const div = document.createElement('div');
  div.className = 'request-item';
  
  const type = request.type.toLowerCase();
  const typeClass = `type-${type}`;
  
  const timestamp = new Date(request.timestamp).toLocaleTimeString();
  
  div.innerHTML = `
    <div>
      <span class="request-type ${typeClass}">${request.type}</span>
      <span class="request-meta">${request.method} • ${timestamp}</span>
    </div>
    <div class="request-url">${request.url}</div>
  `;
  
  return div;
}

// Filter button handlers
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.type;
    updateDisplay();
  });
});

// Search box handler
document.getElementById('searchBox').addEventListener('input', (e) => {
  searchTerm = e.target.value;
  updateDisplay();
});

// Clear button handler
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Clear all captured requests for this tab?')) {
    chrome.runtime.sendMessage(
      { action: 'clearRequests', tabId: currentTabId },
      () => {
        allRequests = [];
        updateDisplay();
      }
    );
  }
});

// Export to CSV
document.getElementById('exportBtn').addEventListener('click', () => {
  if (allRequests.length === 0) {
    alert('No requests to export');
    return;
  }
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    
    // Create CSV content
    let csvContent = 'Timestamp,Type,Method,URL\n';
    
    allRequests.forEach(req => {
      const timestamp = new Date(req.timestamp).toLocaleString();
      const type = req.type;
      const method = req.method;
      const requestUrl = req.url.replace(/"/g, '""'); // Escape quotes in URL
      
      csvContent += `"${timestamp}","${type}","${method}","${requestUrl}"\n`;
    });
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `filter-trace-${url.hostname}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  });
});

// Auto-refresh requests every 2 seconds
setInterval(() => {
  if (currentTabId) {
    chrome.runtime.sendMessage(
      { action: 'getRequests', tabId: currentTabId },
      (response) => {
        if (response && response.requests) {
          allRequests = response.requests;
          updateDisplay();
        }
      }
    );
  }
}, 2000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  loadRequests();
});
