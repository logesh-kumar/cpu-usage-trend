//import { getSystemInfo } from "./utils";

console.log("Backgroud script loaded");

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    previousCpuInfo: { used: null, available: null, timestamp: false },
  });
});

function getCpuUsage(processors, processorsOld) {
  const usage = [];
  for (let i = 0; i < processors.length; i++) {
    const processor = processors[i];

    if (processor.total === 0) continue;

    const processorOld = processorsOld[i];
    usage.push(
      processorOld
        ? {
            user: processor.user - processorOld.user,
            kernel: processor.kernel - processorOld.kernel,
            idle: processor.idle - processorOld.idle,
            total: processor.total - processorOld.total,
          }
        : processor
    );
  }
  return usage;
}

async function getSystemInfo(status, cb, processorsOld) {
  const [cpu, memory, storage] = await Promise.all([
    new Promise((resolve) => {
      chrome.system.cpu.getInfo((v) => resolve(v));
    }),
    new Promise((resolve) => {
      chrome.system.memory.getInfo((v) => resolve(v));
    }),
    new Promise((resolve) => {
      chrome.system.storage.getInfo((v) => resolve(v));
    }),
  ]);

  const processors = cpu.processors.map(({ usage }) => usage);
  const data = {
    cpu: {
      modelName: cpu.modelName,
      usage: getCpuUsage(processors, processorsOld),
      temperatures: cpu.temperatures ?? [],       
      // temperatures: [40, 50],
    },
    memory,
    storage,
  };

  cb(data);

  setTimeout(() => {
    getSystemInfo(status, cb, processors);
  }, TIMEOUT);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  getSystemInfo({ cpu: true }, ({ cpu: { modelName, usage } }) => {
    const idle = usage.reduce((a, b) => a + b.idle / b.total, 0) / usage.length;    
    sendResponse({ idle });
  });
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   getSystemInfo({ cpu: true }, ({ cpu: { modelName, usage } }) => {
//     const idle = usage.reduce((a, b) => a + b.idle / b.total, 0) / usage.length;
//     cpuIdleArray.push(idle);
//     cpuIdleArray.shift();
//     sendResponse({ cpuIdleArray });
//   });
// });

/*chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // If the message is a cpu info message then calculate the cpu usage and send it back to the content script to display
  chrome.storage.sync.get("previousCpuInfo", function (storageData) {
    chrome.system.cpu.getInfo(function (cpuInfo) {
      let sumOfUsed = 0;
      let sumOfIdle = 0;

      // Calculate the sum of used and available cpu time
      for (let i = 0; i < cpuInfo.numOfProcessors; i++) {
        let usage = cpuInfo.processors[i].usage;
        // used Cpu time is the sum of user and kernel time
        sumOfUsed = sumOfUsed + usage.kernel + usage.user;
        sumOfIdle = sumOfIdle + usage.idle;
      }

      // Calculate the cpu usage

      let cpuUsage = 0;
      if (storageData.previousCpuInfo.used !== null) {
        let usedDiff = sumOfUsed - storageData.previousCpuInfo.used;
        let idleDiff = sumOfIdle - storageData.previousCpuInfo.idle;
        cpuUsage = (usedDiff / (usedDiff + idleDiff)) * 100;
      }

      // // Save the current cpu info for the next calculation
      // chrome.storage.sync.set({
      //   previousCpuInfo: {
      //     used: sumOfUsed,
      //     idle: sumOfIdle,
      //     timestamp: Date.now(),
      //   },
      // });

      // Send the cpu usage back to the content script
      sendResponse({ cpuUsage: cpuUsage });

      //Return a response. If the previous call was not within 5 seconds,
      // and if not there was either no previous call or the previous call is from a different session.
      // if (
      //   !storageData.previousCpuInfo.timestamp ||
      //   Date.now() - storageData.previousCpuInfo.timestamp > 5000
      // ) {
      //   sendResponse({
      //     currentCpuUsage: currentCpuUsage,
      //     loadBetweenCalls: false,
      //   });
      // } else {
      //   sendResponse({
      //     currentCpuUsage: currentCpuUsage,
      //     loadBetweenCalls: Math.floor(
      //       ((sumOfUsed - storageData.previousCpuInfo.used) /
      //         (sumOfAvailable - storageData.previousCpuInfo.available)) *
      //         100
      //     ),
      //   });
      // }
    });
    return true; //Required for async requests.
  });
  return true; //Required for async requests.
});
*/
