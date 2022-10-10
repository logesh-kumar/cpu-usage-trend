const TIMEOUT = 1000;

// Convert byte to GB
export function toGiga(byte) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2);
}

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

export async function getSystemInfo(status, cb, processorsOld) {
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

export const storage = {
  getPopupStatus() {
    return (
      new Promise() <
      UserSettings >
      ((resolve) => {
        chrome.storage.sync.get((res) => {
          if (!res.popup) res.popup = {};
          const {
            cpu = true,
            memory = true,
            battery = true,
            storage = true,
          } = res.popup;
          resolve({ cpu, memory, battery, storage });
        });
      })
    );
  },
  setPopupStatus(popup) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ popup }, () => {
        resolve();
      });
    });
  },
};
