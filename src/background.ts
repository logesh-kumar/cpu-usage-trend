import { getSystemInfo } from './utils'

getSystemInfo(({ cpu: { modelName, usage } }) => {  
  const idle =
    usage.reduce(
      (prevValue, currValue) => prevValue + currValue.idle / currValue.total,
      0
    ) / usage.length // usage.length is the number of processors

  const cpuUsage = Math.round((1 - idle) * 100)

  // console.log(`${modelName} - ${cpuUsage}%`)

  // send to content script to all tabs
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
    chrome.tabs.sendMessage(tabs[0].id, { cpuUsage })
  })
})
