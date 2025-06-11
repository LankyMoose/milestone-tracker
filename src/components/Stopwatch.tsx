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
import { TimeDisplay } from "./TimeDisplay"

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
    <div className="flex flex-col gap-4 justify-center items-center p-4 bg-white/5 rounded">
      <span className="font-bold select-none font-mono">
        <Derive from={currentTime}>
          {(time) => <TimeDisplay time={formatTime(time)} />}
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
