import { Derive, useRef } from "kaioken"
import {
  currentMilestoneIndex,
  currentTime,
  interval,
  isInactive,
  isRunning,
  notRunning,
} from "../state"
import { Button } from "./Button"
import { formatTime } from "../utils"

export function Stopwatch() {
  const offset = useRef(0) // Last reference time

  const start = () => {
    if (interval.value === -1) {
      offset.current = performance.now()
      interval.value = window.setInterval(() => {
        const now = performance.now()
        const delta = now - offset.current
        offset.current = now
        currentTime.value += delta
      }, 1000 / 60)
    }
  }

  const pause = () => {
    if (interval.value !== -1) {
      clearInterval(interval.value)
      interval.value = -1
    }
  }

  const reset = () => {
    pause()
    currentTime.value = 0
    currentMilestoneIndex.value = 0
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center p-4 rounded">
      <span className="font-bold select-none font-mono">
        <Derive from={currentTime}>
          {(time) => {
            const { hours, minutes, seconds, hundredths } = formatTime(time)
            return (
              <>
                <span className="text-5xl">
                  {hours > 0 ? `${hours}:` : ""}
                  {minutes > 0 ? `${minutes}:` : ""}
                  {String(seconds).padStart(minutes > 0 ? 2 : 1, "0")}
                </span>
                <span className="text-4xl">
                  .{String(hundredths).padStart(2, "0")}
                </span>
              </>
            )
          }}
        </Derive>
      </span>
      <div className="flex gap-4 justify-center items-center">
        <Button disabled={isRunning} onclick={start}>
          Start
        </Button>
        <Button disabled={notRunning} onclick={pause}>
          Pause
        </Button>
        <Button disabled={isInactive} onclick={reset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
