console.log('Content script loaded')
// receive form background script
chrome.runtime.onMessage.addListener((message) => {
  const db = indexedDB.open('cpu-trend-monitor', 1)
  // save to indexedDB with timestamp
  db.onsuccess = (event: any) => {
    const db = event.target.result
    const transaction = db.transaction('cpu-trend-monitor', 'readwrite')
    const store = transaction.objectStore('cpu-trend-monitor')
    console.log({ 'message.cpuUsage': message.cpuUsage })
    // save to db only if cpu usage is over 50%
    if (message.cpuUsage > 50) {
      store.add({ timestamp: Date.now(), cpuUsage: message.cpuUsage })
    }
  }

  db.onerror = (event) => {
    console.log('Error opening database')
  }

  db.onupgradeneeded = (event: any) => {
    const db = event.target.result
    db.createObjectStore('cpu-trend-monitor', { keyPath: 'timestamp' })
  }
})
