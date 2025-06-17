import { Time } from "./state"

export function formatTime(ms: number): Time {
  const hours = Math.floor(ms / 1000 / 60 / 60)
  const minutes = Math.floor(ms / 1000 / 60) % 60
  const seconds = Math.floor(ms / 1000) % 60
  const hundredths = Math.floor(ms / 10) % 100

  return { hours, minutes, seconds, hundredths }
}
