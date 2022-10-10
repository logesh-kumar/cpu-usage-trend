import { getSystemInfo } from "./utils"


getSystemInfo(({ cpu: { modelName, usage } }) => {
  const idle = usage.reduce((a, b) => a + b.idle / b.total, 0) / usage.length
  console.log(`${modelName} ${Math.round((1 - idle) * 100)}%`)
})