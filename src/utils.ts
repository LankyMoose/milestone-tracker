import { Time } from "./state"

export function formatTime(ms: number): Time {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const hundredths = Math.floor((ms % 1000) / 10)

  return { hours, minutes, seconds, hundredths, raw: ms }
}
