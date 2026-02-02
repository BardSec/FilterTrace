# Filter Trace - Chrome Extension

A Chrome extension designed for network administrators and IT professionals to monitor all background requests and resources loaded by websites. Perfect for troubleshooting content filters, analyzing web traffic, and understanding what resources websites are accessing.

## Features

- 📡 **Real-time Request Monitoring** - Captures all network requests as they happen
- 🔍 **Request Type Filtering** - Filter by:
  - Documents (HTML pages)
  - Scripts (JavaScript)
  - Stylesheets (CSS)
  - Images
  - XHR (AJAX requests)
  - Fetch API requests
  - Fonts
  - Media (audio/video)
  - WebSockets
- 🔎 **URL Search** - Quickly find specific requests by searching URLs
- 💾 **Export Functionality** - Export all requests to a CSV file for analysis in Excel or Google Sheets
- 📊 **Request Statistics** - See total and filtered request counts
- 🌙 **Dark Mode** - Eye-friendly dark theme
- 🔄 **Auto-refresh** - Updates every 2 seconds to show new requests
- 🎨 **Color-coded Types** - Each request type has a distinct color for easy identification

## Perfect For

- K-12 School Network Administrators managing content filters
- IT Professionals troubleshooting web access issues
- Web Developers analyzing third-party resources
- Security Professionals auditing website connections
- Anyone needing to see what a website is loading in the background

## Installation

### Method 1: Load as Unpacked Extension

1. Download or clone all the extension files to a folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension folder
6. The Background Request Monitor icon will appear in your toolbar

### Method 2: Pack and Install

1. Follow steps 1-3 from Method 1
2. Click "Pack extension"
3. Select the extension folder
4. Chrome will create a `.crx` file
5. Drag the `.crx` file into Chrome to install

## Usage

1. Navigate to any website
2. Click the Filter Trace icon
3. The extension will display all requests made by that page
4. Use filters to narrow down specific types of requests
5. Use the search box to find specific URLs
6. Click 💾 to export all requests to a CSV file
7. Click 🗑️ to clear captured requests for the current tab

## Use Cases

### Content Filter Troubleshooting
When a website isn't loading correctly through your content filter:
1. Load the page with the extension active
2. Review all background requests
3. Identify which domains/resources are being blocked
4. Adjust filter rules accordingly

### Third-Party Resource Analysis
See what external services and trackers a website uses:
1. Filter by "Scripts" to see JavaScript files
2. Filter by "XHR" and "Fetch" to see API calls
3. Export to CSV for analysis in spreadsheet software

### Performance Analysis
Identify resource-heavy pages:
1. Count total requests
2. Check for excessive image/script loading
3. Identify slow or problematic resources

## Request Types Explained

- **Document** - HTML pages and frames
- **Script** - JavaScript files
- **Stylesheet** - CSS files
- **Image** - PNG, JPG, GIF, SVG, etc.
- **XHR** - XMLHttpRequest (AJAX) calls
- **Fetch** - Modern Fetch API requests
- **Font** - Web fonts (WOFF, TTF, etc.)
- **Media** - Audio and video files
- **WebSocket** - WebSocket connections
- **Other** - Everything else

## Files Included

- `manifest.json` - Extension configuration
- `background.js` - Service worker that captures requests
- `popup.html` - User interface
- `popup.js` - UI logic and filtering
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons
- `README.md` - This file

## Privacy

This extension:
- Only monitors requests for the active tab when you open the extension
- Does not send any data to external servers
- Stores request data temporarily in memory only
- Clears data when tabs are closed or navigated
- Does not track your browsing history

## Technical Details

- Uses Chrome's WebRequest API to monitor network traffic
- Manifest Version 3 compliant
- Service worker architecture for efficiency
- Stores up to 1000 requests per tab to prevent memory issues
- Auto-clears data when tabs close or navigate

## Permissions Required

- `webRequest` - To monitor network requests
- `activeTab` - To identify the current tab
- `storage` - To save dark mode preference
- `<all_urls>` - To monitor requests from any domain

## Troubleshooting

**Extension not showing requests:**
- Reload the page after opening the extension
- Check that you have the correct tab active
- Some Chrome internal pages cannot be monitored

**Too many requests:**
- Use filters to narrow down what you're looking for
- Use the search box to find specific URLs
- Clear requests periodically

**Export not working:**
- Make sure you have requests captured first
- Check your browser's download settings

## Tips for Content Filter Management

1. **Identify Blocked Resources** - Look for requests that might be failing
2. **Document Third-Party Dependencies** - Export to CSV and analyze in Excel/Sheets
3. **Compare Working vs. Broken Pages** - Use export to compare request patterns
4. **Monitor Real-time** - Keep the extension open while troubleshooting
5. **Filter by Type** - Focus on specific resource types causing issues
6. **Use CSV for Reporting** - Import exported data into your reporting tools

## License

Free to use and modify for educational and professional purposes.
