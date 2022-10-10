const TIMEOUT = 1000

function getCpuUsage(
  processors: chrome.system.cpu.ProcessorUsage[],
  processorsOld: chrome.system.cpu.ProcessorUsage[]
) {
  const usage = []
  for (let i = 0; i < processors.length; i++) {
    const processor = processors[i]

    if (processor.total === 0) continue

    const processorOld = processorsOld[i]
    usage.push(
      processorOld
        ? {
            user: processor.user - processorOld.user,
            kernel: processor.kernel - processorOld.kernel,
            idle: processor.idle - processorOld.idle,
            total: processor.total - processorOld.total,
          }
        : processor
    )
  }
  return usage
}

interface SystemInfoData {
  cpu: {
    modelName: chrome.system.cpu.CpuInfo['modelName']
    usage: chrome.system.cpu.ProcessorUsage[]
    temperatures?: number[]
  }
}

export async function getSystemInfo(
  cb: (data: SystemInfoData) => void,
  processorsOld: chrome.system.cpu.ProcessorUsage[] = []
) {
  const [cpu] = await Promise.all([
    new Promise<chrome.system.cpu.CpuInfo>((resolve) => {
      chrome.system.cpu.getInfo((v) => resolve(v))
    }),
  ])

  const processors = cpu.processors.map(({ usage }) => usage)
  const data: SystemInfoData = {
    cpu: {
      modelName: cpu.modelName,
      usage: getCpuUsage(processors, processorsOld),
      temperatures: (cpu as any).temperatures ?? [],
    },
  }

  cb(data)

  setTimeout(() => {
    getSystemInfo(cb, processors)
  }, TIMEOUT)
}

